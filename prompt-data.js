const SECTIONS = [
  { id: 'nationality', title: '🌍 Национальность / типаж', mode: 's', tags: [
    { l: 'Японка', p: 'japanese woman' },
    { l: 'Русская', p: 'russian woman' },
    { l: 'Европейка', p: 'european woman' },
    { l: 'Латина', p: 'latina woman' },
    { l: 'Смешанный типаж', p: 'mixed ethnicity woman' }
  ]},
  { id: 'age', title: '🎂 Возраст', mode: 's', tags: [
    { l: '18-20', p: 'young adult, 18-20 years old' },
    { l: '21-24', p: 'young woman, 21-24 years old' },
    { l: '25-30', p: 'adult woman, 25-30 years old' }
  ]},
  { id: 'body', title: '🏋️ Тело / фигура', mode: 'm', tags: [
    { l: 'Спортивная', p: 'athletic toned body' },
    { l: 'Стройная', p: 'slim body' },
    { l: 'Песочные часы', p: 'hourglass figure' },
    { l: 'Высокая', p: 'tall height' },
    { l: 'Миниатюрная', p: 'petite height' },
    { l: 'Подчеркнутая талия', p: 'defined waistline' }
  ]},
  { id: 'appearance', title: '💇 Внешность', mode: 'm', tags: [
    { l: 'Длинные тёмные волосы', p: 'long dark hair' },
    { l: 'Блонд каре', p: 'blonde bob haircut' },
    { l: 'Хвост', p: 'high ponytail hairstyle' },
    { l: 'Волнистые волосы', p: 'wavy hair texture' },
    { l: 'Яркие глаза', p: 'vivid expressive eyes' },
    { l: 'Натуральный макияж', p: 'natural makeup look' },
    { l: 'Smokey eyes', p: 'smokey eye makeup' }
  ]},
  { id: 'expression', title: '🙂 Эмоция / взгляд', mode: 'm', tags: [
    { l: 'Уверенный взгляд', p: 'confident gaze' },
    { l: 'Нежная улыбка', p: 'soft smile' },
    { l: 'Смотрит в камеру', p: 'looking directly at camera' },
    { l: 'Смотрит в сторону', p: 'looking away' },
    { l: 'Игривое настроение', p: 'playful teasing expression' }
  ]},
  { id: 'pose', title: '🧍 Поза', mode: 's', tags: [
    { l: 'Стоит расслабленно', p: 'relaxed standing pose' },
    { l: 'Сидит на краю', p: 'sitting on edge, elegant posture' },
    { l: 'Идёт по улице', p: 'walking shot, mid-step' },
    { l: 'Поза модели', p: 'fashion model pose, hand on hip' },
    { l: 'Полуоборот через плечо', p: 'looking over shoulder' }
  ]},
  { id: 'clothing', title: '👗 Одежда', mode: 'm', tags: [
    { l: 'Белая футболка', p: 'white fitted t-shirt' },
    { l: 'Кроп-топ', p: 'crop top' },
    { l: 'Мини-юбка', p: 'mini skirt' },
    { l: 'Джинсы', p: 'high-waisted jeans' },
    { l: 'Оверсайз худи', p: 'oversized hoodie' },
    { l: 'Лёгкое платье', p: 'light summer dress' }
  ]},
  { id: 'lingerie', title: '🩱 Бельё / купальник', mode: 'm', tags: [
    { l: 'Кружевной комплект', p: 'lace lingerie set' },
    { l: 'Чёрный боди', p: 'black body suit' },
    { l: 'Спортивный купальник', p: 'sport swimsuit' },
    { l: 'Бикини', p: 'minimal bikini' }
  ]},
  { id: 'style', title: '🎨 Стиль рендера', mode: 'm', tags: [
    { l: 'Фотореализм', p: 'photorealistic style' },
    { l: 'Кинематографично', p: 'cinematic color grading' },
    { l: 'Аниме', p: 'anime illustration style' },
    { l: 'Полуреализм', p: 'semi-realistic rendering' },
    { l: '3D render', p: 'high-end 3d render' },
    { l: 'Пиксель-арт', p: 'pixel art aesthetic' }
  ]},
  { id: 'camera', title: '📷 Камера / свет / эффекты', mode: 'm', tags: [
    { l: '85mm портрет', p: '85mm portrait lens' },
    { l: 'Смартфон-камера', p: 'smartphone camera look' },
    { l: 'Малая ГРИП', p: 'shallow depth of field' },
    { l: 'Боке', p: 'soft background bokeh lights' },
    { l: 'Неоновый свет', p: 'neon rim lighting' },
    { l: 'Контровой свет', p: 'dramatic backlight' }
  ]},
  { id: 'location', title: '🏙️ Место / время', mode: 'm', tags: [
    { l: 'Токио, Гинза', p: 'tokyo ginza district' },
    { l: 'Москва Сити', p: 'moscow city night skyline' },
    { l: 'Киото, онсэн', p: 'traditional kyoto onsen area' },
    { l: 'Отель люкс', p: 'luxury hotel interior' },
    { l: 'Общежитие', p: 'student dorm room' },
    { l: 'Закат', p: 'golden hour sunset' },
    { l: 'Ночь', p: 'night scene' }
  ]},
  { id: 'atmosphere', title: '🌫️ Атмосфера', mode: 'm', tags: [
    { l: 'Романтика', p: 'romantic mood' },
    { l: 'Уличный драйв', p: 'urban energetic atmosphere' },
    { l: 'Меланхолия', p: 'melancholic vibe' },
    { l: 'Премиум-гламур', p: 'luxury glamorous aura' },
    { l: 'Минимализм', p: 'minimal clean composition' }
  ]},
  { id: 'params', title: '⚙️ Параметры генерации', mode: 'm', tags: [
    { l: '--ar 3:4', p: '--ar 3:4' },
    { l: '--ar 2:3', p: '--ar 2:3' },
    { l: '--style raw', p: '--style raw' },
    { l: '--v 6', p: '--v 6' },
    { l: '--q 2', p: '--q 2' }
  ]}
];

const PRESETS = [
  { l: 'Tokyo Night Fashion', s: {
    nationality: ['Японка'], age: ['21-24'], body: ['Стройная'], appearance: ['Длинные тёмные волосы', 'Натуральный макияж'],
    expression: ['Уверенный взгляд', 'Смотрит в камеру'], pose: ['Поза модели'], clothing: ['Кроп-топ', 'Мини-юбка'],
    style: ['Фотореализм', 'Кинематографично'], camera: ['85mm портрет', 'Боке', 'Неоновый свет'],
    location: ['Токио, Гинза', 'Ночь'], atmosphere: ['Премиум-гламур'], params: ['--ar 3:4', '--style raw', '--v 6']
  }},
  { l: 'Anime Soft Mood', s: {
    nationality: ['Смешанный типаж'], age: ['18-20'], appearance: ['Волнистые волосы'], expression: ['Нежная улыбка'], pose: ['Сидит на краю'],
    clothing: ['Лёгкое платье'], style: ['Аниме', 'Полуреализм'], camera: ['Смартфон-камера', 'Малая ГРИП'],
    location: ['Киото, онсэн', 'Закат'], atmosphere: ['Романтика'], params: ['--ar 2:3', '--v 6']
  }}
];
