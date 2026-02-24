const state = {};
SECTIONS.forEach((s) => { state[s.id] = new Set(); });

const STYLE_CONFLICT_GROUP = new Set(['Фотореализм', 'Аниме', '3D render', 'Пиксель-арт', 'Полуреализм']);

function init() {
  const main = document.getElementById('main');
  let html = '<section class="section"><div class="section-header"><span class="section-title">⚡ Быстрые сценарии</span></div><div class="presets-wrap">';
  PRESETS.forEach((p, i) => { html += `<button class="preset" onclick="applyPreset(${i})">${p.l}</button>`; });
  html += '</div></section>';

  html += '<section class="section"><div class="section-header"><span class="section-title">🧭 Удобство генерации</span></div>';
  html += '<div class="tools-row">';
  html += '<input id="tagSearch" class="search-input" type="text" placeholder="Поиск тегов: стиль, свет, поза..." oninput="filterTags(this.value)" />';
  html += '<button class="btn btn-balance" onclick="balancePrompt()">🪄 Сбалансировать</button>';
  html += '</div></section>';

  SECTIONS.forEach((sec) => {
    html += `<section class="section" data-section="${sec.id}"><div class="section-header"><span class="section-title">${sec.title}</span><span class="section-badge">${sec.mode === 's' ? 'один' : 'несколько'}</span></div><div class="tags">`;
    sec.tags.forEach((tag, i) => {
      html += `<button class="tag" data-label="${tag.l.toLowerCase()}" data-prompt="${tag.p.toLowerCase()}" id="t_${sec.id}_${i}" title="${tag.p}" onclick="toggleTag('${sec.id}', ${i})">${tag.l}</button>`;
    });
    html += '</div></section>';
  });

  html += '<section class="section"><div class="section-header"><span class="section-title">✏️ Свободный ввод</span></div><textarea id="customInput" class="custom-input" placeholder="Добавь детали на английском (композиция, детализация, ограничения и т.д.)" oninput="buildOutput()"></textarea></section>';

  main.innerHTML = html;
  buildOutput();
}

function getSection(id) {
  return SECTIONS.find((s) => s.id === id);
}

function toggleTag(sectionId, index) {
  const sec = getSection(sectionId);
  if (!sec) return;

  if (sec.mode === 's') {
    if (state[sectionId].has(index)) {
      state[sectionId].clear();
    } else {
      state[sectionId].clear();
      state[sectionId].add(index);
    }
    sec.tags.forEach((_, i) => {
      const el = document.getElementById(`t_${sectionId}_${i}`);
      if (el) el.classList.toggle('on', state[sectionId].has(i));
    });
  } else {
    if (state[sectionId].has(index)) state[sectionId].delete(index);
    else state[sectionId].add(index);
    const el = document.getElementById(`t_${sectionId}_${index}`);
    if (el) el.classList.toggle('on', state[sectionId].has(index));
  }
  buildOutput();
}

function valuesOf(sectionId, field = 'p') {
  const sec = getSection(sectionId);
  if (!sec) return [];
  return [...state[sectionId]].sort((a, b) => a - b).map((i) => sec.tags[i][field]);
}

function scoreQuality(prompt, custom) {
  let score = 0;
  const warnings = [];

  const identityCount = valuesOf('nationality').length + valuesOf('age').length + valuesOf('body').length;
  const styleCount = valuesOf('style').length;
  const sceneCount = valuesOf('camera').length + valuesOf('location').length;

  if (identityCount > 0) score += 25;
  else warnings.push('Добавьте identity-теги (национальность/возраст/фигура).');

  if (styleCount > 0) score += 25;
  else warnings.push('Добавьте стиль рендера для предсказуемого результата.');

  if (sceneCount > 0) score += 20;
  else warnings.push('Добавьте сцену (камера/локация), чтобы усилить контекст.');

  if (valuesOf('expression').length > 0 || valuesOf('pose').length > 0) score += 15;
  else warnings.push('Добавьте эмоцию или позу для живости кадра.');

  if (prompt.length >= 60 && prompt.length <= 320) score += 15;
  else warnings.push('Оптимальная длина промпта: 60–320 символов.');

  if (custom && custom.split(',').length > 8) warnings.push('Свободный ввод перегружен — попробуйте сократить детали.');

  const renderStyles = valuesOf('style', 'l').filter((label) => STYLE_CONFLICT_GROUP.has(label));
  if (renderStyles.length > 1) {
    warnings.push(`Конфликт рендера: ${renderStyles.join(', ')}. Оставьте 1 основной стиль.`);
    score = Math.max(0, score - 20);
  }

  return { score: Math.min(100, score), warnings };
}

function renderQualityPanel(score, warnings) {
  const panel = document.getElementById('qualityPanel');
  if (!panel) return;

  const tone = score >= 80 ? 'good' : score >= 55 ? 'mid' : 'bad';
  const icon = score >= 80 ? '✅' : score >= 55 ? '⚠️' : '⛔';
  const tips = warnings.length
    ? `<ul>${warnings.map((w) => `<li>${w}</li>`).join('')}</ul>`
    : '<div class="quality-ok">Промпт выглядит адекватно и сбалансировано.</div>';

  panel.className = `quality-panel ${tone}`;
  panel.innerHTML = `<div class="quality-head">${icon} Оценка адекватности: <strong>${score}/100</strong></div>${tips}`;
}

function buildOutput() {
  const blocks = [];
  const identity = [...valuesOf('nationality'), ...valuesOf('age'), ...valuesOf('body')];
  if (identity.length) blocks.push(identity.join(', '));

  const face = [...valuesOf('appearance'), ...valuesOf('expression')];
  if (face.length) blocks.push(face.join(', '));

  const wear = [...valuesOf('clothing'), ...valuesOf('lingerie')];
  if (wear.length) blocks.push(`wearing ${wear.join(', ')}`);

  const scene = [...valuesOf('pose'), ...valuesOf('style'), ...valuesOf('camera'), ...valuesOf('location'), ...valuesOf('atmosphere')];
  if (scene.length) blocks.push(scene.join(', '));

  const custom = document.getElementById('customInput').value.trim();
  if (custom) blocks.push(custom);

  let prompt = blocks.join(' -- ');
  const params = valuesOf('params');
  if (params.length) prompt += ` ${params.join(' ')}`;

  const promptEl = document.getElementById('promptText');
  const count = document.getElementById('charCount');
  const jsonEl = document.getElementById('jsonOutput');

  if (!prompt.trim()) {
    promptEl.innerHTML = '<span class="prompt-empty">← Выберите теги, чтобы собрать промпт...</span>';
    promptEl.dataset.raw = '';
    count.textContent = '';
  } else {
    promptEl.innerHTML = prompt.replaceAll(' -- ', ' <span class="sep">--</span> ');
    promptEl.dataset.raw = prompt;
    count.textContent = `${prompt.length} символов`;
  }

  const quality = scoreQuality(prompt, custom);
  renderQualityPanel(quality.score, quality.warnings);

  const json = {
    prompt,
    quality,
    selected: Object.fromEntries(SECTIONS.map((s) => [s.id, valuesOf(s.id, 'l')])),
    custom
  };
  jsonEl.textContent = JSON.stringify(json, null, 2);
}

function applyPreset(i) {
  const preset = PRESETS[i];
  if (!preset) return;
  resetAll(true);
  Object.entries(preset.s).forEach(([id, labels]) => {
    const sec = getSection(id);
    if (!sec) return;
    labels.forEach((label) => {
      const idx = sec.tags.findIndex((t) => t.l === label);
      if (idx >= 0) {
        state[id].add(idx);
        const el = document.getElementById(`t_${id}_${idx}`);
        if (el) el.classList.add('on');
      }
    });
  });
  buildOutput();
  toast('⚡ Пресет применен');
}

function randomize() {
  resetAll(true);
  SECTIONS.forEach((sec) => {
    if (sec.id === 'params') return;
    const count = sec.mode === 's' ? 1 : Math.min(2, sec.tags.length);
    const copy = [...Array(sec.tags.length).keys()];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    copy.slice(0, count).forEach((idx) => {
      state[sec.id].add(idx);
      const el = document.getElementById(`t_${sec.id}_${idx}`);
      if (el) el.classList.add('on');
    });
  });

  ['--ar 3:4', '--style raw', '--v 6'].forEach((label) => {
    const sec = getSection('params');
    const idx = sec.tags.findIndex((t) => t.l === label);
    if (idx >= 0) {
      state.params.add(idx);
      const el = document.getElementById(`t_params_${idx}`);
      if (el) el.classList.add('on');
    }
  });

  buildOutput();
  toast('🎲 Рандомный набор готов');
}

function filterTags(query) {
  const q = query.trim().toLowerCase();
  document.querySelectorAll('.tag').forEach((el) => {
    if (!q) {
      el.classList.remove('hidden');
      return;
    }
    const label = el.dataset.label || '';
    const prompt = el.dataset.prompt || '';
    el.classList.toggle('hidden', !label.includes(q) && !prompt.includes(q));
  });
}

function balancePrompt() {
  const styleSec = getSection('style');
  const chosen = [...state.style].sort((a, b) => a - b);
  const renderStyleIndexes = chosen.filter((idx) => STYLE_CONFLICT_GROUP.has(styleSec.tags[idx].l));

  if (renderStyleIndexes.length > 1) {
    const keep = renderStyleIndexes[0];
    renderStyleIndexes.slice(1).forEach((idx) => {
      state.style.delete(idx);
      const el = document.getElementById(`t_style_${idx}`);
      if (el) el.classList.remove('on');
    });
    const keepEl = document.getElementById(`t_style_${keep}`);
    if (keepEl) keepEl.classList.add('on');
  }

  const paramsDefault = ['--ar 3:4', '--style raw', '--v 6'];
  const paramSec = getSection('params');
  if (state.params.size === 0) {
    paramsDefault.forEach((label) => {
      const idx = paramSec.tags.findIndex((t) => t.l === label);
      if (idx >= 0) {
        state.params.add(idx);
        const el = document.getElementById(`t_params_${idx}`);
        if (el) el.classList.add('on');
      }
    });
  }

  buildOutput();
  toast('🪄 Промпт сбалансирован');
}

function resetAll(silent = false) {
  SECTIONS.forEach((sec) => {
    state[sec.id].clear();
    sec.tags.forEach((_, i) => {
      const el = document.getElementById(`t_${sec.id}_${i}`);
      if (el) el.classList.remove('on');
    });
  });
  const input = document.getElementById('customInput');
  const search = document.getElementById('tagSearch');
  if (input) input.value = '';
  if (search) search.value = '';
  filterTags('');
  buildOutput();
  if (!silent) toast('🗑️ Сброшено');
}

async function copyPrompt() {
  const raw = (document.getElementById('promptText').dataset.raw || '').trim();
  if (!raw) return toast('⚠️ Пустой промпт');
  await copyText(raw);
  toast('✅ Текст скопирован');
}

async function copyJson() {
  const raw = document.getElementById('jsonOutput').textContent;
  if (!raw) return toast('⚠️ Пустой JSON');
  await copyText(raw);
  toast('✅ JSON скопирован');
}

async function copyText(raw) {
  try {
    await navigator.clipboard.writeText(raw);
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = raw;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1500);
}

window.randomize = randomize;
window.resetAll = resetAll;
window.copyPrompt = copyPrompt;
window.copyJson = copyJson;
window.toggleTag = toggleTag;
window.applyPreset = applyPreset;
window.filterTags = filterTags;
window.balancePrompt = balancePrompt;

init();
