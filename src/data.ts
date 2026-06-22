export type LessonId = 'plant' | 'solar' | 'water'

export type Lesson = {
  id: LessonId
  index: string
  title: string
  shortTitle: string
  subtitle: string
  boardEyebrow: string
  boardPrompt: string
  duration: string
  grade: string
  accent: string
  accentSoft: string
  voiceDescription: string
  caption: string
  summary: string[]
  quiz: {
    question: string
    options: string[]
    answer: number
  }
  detected: {
    objects: string[]
    textBlocks: number
    confidence: string
  }
  tactileLabels: string[]
  library: {
    asset: string
    pages: number
    version: string
    tags: string[]
  }
}

export const lessons: Lesson[] = [
  {
    id: 'plant',
    index: '01',
    title: 'Plant Structure',
    shortTitle: 'Plant',
    subtitle: 'Estrutura das plantas',
    boardEyebrow: 'Ciências · Unidade 02',
    boardPrompt: 'Como cada parte ajuda a planta a viver?',
    duration: '12 min',
    grade: 'Grade 5',
    accent: '#00C896',
    accentSoft: '#E4F8F1',
    voiceDescription:
      'A vertical plant diagram. Roots spread below the soil line, a stem rises through the center, and two leaves connect on opposite sides. A flower sits at the top.',
    caption:
      'As raízes absorvem água e sais minerais. O caule transporta essas substâncias até as folhas.',
    summary: [
      'Raízes fixam a planta e absorvem água.',
      'O caule sustenta e transporta nutrientes.',
      'Folhas usam luz para produzir alimento.',
    ],
    quiz: {
      question: 'Qual parte da planta absorve água do solo?',
      options: ['Folha', 'Flor', 'Raiz', 'Caule'],
      answer: 2,
    },
    detected: {
      objects: ['flower', 'leaf', 'stem', 'roots'],
      textBlocks: 7,
      confidence: '98.4%',
    },
    tactileLabels: ['flower', 'leaves', 'stem', 'soil', 'roots'],
    library: {
      asset: 'Plant anatomy tactile map',
      pages: 4,
      version: 'v1.3',
      tags: ['Biology', 'Botany', 'PT-BR'],
    },
  },
  {
    id: 'solar',
    index: '02',
    title: 'Solar System',
    shortTitle: 'Solar',
    subtitle: 'O sistema solar',
    boardEyebrow: 'Ciências · Unidade 05',
    boardPrompt: 'Por que os planetas não saem de suas órbitas?',
    duration: '15 min',
    grade: 'Grade 6',
    accent: '#7C6CF2',
    accentSoft: '#ECE9FE',
    voiceDescription:
      'A top-down map of the solar system. The Sun is the large circle on the left. Four curved orbital paths extend right, with Earth shown as the third planet.',
    caption:
      'A gravidade do Sol mantém os planetas em órbita. Cada planeta percorre um caminho e possui velocidade própria.',
    summary: [
      'O Sol concentra quase toda a massa do sistema.',
      'Oito planetas orbitam o Sol.',
      'A Terra é o terceiro planeta a partir do Sol.',
    ],
    quiz: {
      question: 'Qual é o terceiro planeta a partir do Sol?',
      options: ['Marte', 'Terra', 'Vênus', 'Júpiter'],
      answer: 1,
    },
    detected: {
      objects: ['sun', 'orbit paths', '8 planets', 'Earth marker'],
      textBlocks: 9,
      confidence: '97.8%',
    },
    tactileLabels: ['Sun', 'orbit 1', 'orbit 2', 'Earth', 'outer orbit'],
    library: {
      asset: 'Solar orbits tactile atlas',
      pages: 6,
      version: 'v1.1',
      tags: ['Astronomy', 'Space', 'PT-BR'],
    },
  },
  {
    id: 'water',
    index: '03',
    title: 'Water Cycle',
    shortTitle: 'Water',
    subtitle: 'O ciclo da água',
    boardEyebrow: 'Ciências · Unidade 03',
    boardPrompt: 'Como a mesma água viaja pela Terra?',
    duration: '11 min',
    grade: 'Grade 5',
    accent: '#2BB3E0',
    accentSoft: '#E3F4FB',
    voiceDescription:
      'A landscape diagram showing the water cycle. Water rises from the sea as evaporation, forms clouds through condensation, falls as rain, and returns downhill as collection.',
    caption:
      'O calor do Sol causa evaporação. O vapor esfria, forma nuvens e retorna à superfície como precipitação.',
    summary: [
      'Evaporação transforma água em vapor.',
      'Condensação forma nuvens.',
      'Precipitação devolve água à superfície.',
    ],
    quiz: {
      question: 'Como se chama a formação das nuvens?',
      options: ['Coleta', 'Condensação', 'Infiltração', 'Evaporação'],
      answer: 1,
    },
    detected: {
      objects: ['sun', 'cloud', 'rain', 'mountain', 'water'],
      textBlocks: 8,
      confidence: '98.1%',
    },
    tactileLabels: ['sun', 'vapor', 'cloud', 'rain', 'collection'],
    library: {
      asset: 'Water cycle tactile sequence',
      pages: 5,
      version: 'v1.2',
      tags: ['Earth Science', 'Climate', 'PT-BR'],
    },
  },
]

export const demoSteps = [
  { number: 1, label: 'Show UFIT Lesson', short: 'UFIT Lesson' },
  { number: 2, label: 'Run Dot Lens Recognition', short: 'Recognition' },
  { number: 3, label: 'Generate DotPad Output', short: 'DotPad Output' },
  { number: 4, label: 'Enable Captions', short: 'Captions' },
  { number: 5, label: 'Start Accessible Quiz', short: 'Quiz' },
  { number: 6, label: 'Save to Tactile World', short: 'Save Library' },
]
