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
    title: 'Estrutura das Plantas',
    shortTitle: 'Plantas',
    subtitle: 'Estrutura das plantas',
    boardEyebrow: 'Ciências · Unidade 02',
    boardPrompt: 'Como cada parte ajuda a planta a viver?',
    duration: '12 min',
    grade: '5º Ano',
    accent: '#31c88a',
    accentSoft: '#dff8ec',
    voiceDescription:
      'Diagrama vertical de uma planta. As raízes se espalham abaixo da linha do solo, o caule sobe pelo centro e duas folhas se conectam em lados opostos. Uma flor está no topo.',
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
      objects: ['flor', 'folha', 'caule', 'raízes'],
      textBlocks: 7,
      confidence: '98,4%',
    },
    tactileLabels: ['flor', 'folhas', 'caule', 'solo', 'raízes'],
    library: {
      asset: 'Mapa tátil: anatomia vegetal',
      pages: 4,
      version: 'v1.3',
      tags: ['Biologia', 'Botânica', 'PT-BR'],
    },
  },
  {
    id: 'solar',
    index: '02',
    title: 'Sistema Solar',
    shortTitle: 'Solar',
    subtitle: 'O sistema solar',
    boardEyebrow: 'Ciências · Unidade 05',
    boardPrompt: 'Por que os planetas não saem de suas órbitas?',
    duration: '15 min',
    grade: '6º Ano',
    accent: '#7c6cf2',
    accentSoft: '#ebe8ff',
    voiceDescription:
      'Mapa aéreo do sistema solar. O Sol é o grande círculo à esquerda. Quatro órbitas curvas se estendem para a direita, com a Terra indicada como o terceiro planeta.',
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
      objects: ['sol', 'órbitas', '8 planetas', 'marcador Terra'],
      textBlocks: 9,
      confidence: '97,8%',
    },
    tactileLabels: ['Sol', 'órbita 1', 'órbita 2', 'Terra', 'órbita externa'],
    library: {
      asset: 'Atlas tátil: sistema solar',
      pages: 6,
      version: 'v1.1',
      tags: ['Astronomia', 'Espaço', 'PT-BR'],
    },
  },
  {
    id: 'water',
    index: '03',
    title: 'Ciclo da Água',
    shortTitle: 'Água',
    subtitle: 'O ciclo da água',
    boardEyebrow: 'Ciências · Unidade 03',
    boardPrompt: 'Como a mesma água viaja pela Terra?',
    duration: '11 min',
    grade: '5º Ano',
    accent: '#36a9e8',
    accentSoft: '#e1f4ff',
    voiceDescription:
      'Diagrama paisagístico do ciclo da água. A água sobe do mar como evaporação, forma nuvens pela condensação, cai como chuva e retorna descendo como coleta.',
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
      objects: ['sol', 'nuvem', 'chuva', 'montanha', 'água'],
      textBlocks: 8,
      confidence: '98,1%',
    },
    tactileLabels: ['sol', 'vapor', 'nuvem', 'chuva', 'coleta'],
    library: {
      asset: 'Sequência tátil: ciclo da água',
      pages: 5,
      version: 'v1.2',
      tags: ['Ciências da Terra', 'Clima', 'PT-BR'],
    },
  },
]

export const demoSteps = [
  { number: 1, label: 'Exibir Aula UFIT', short: 'Aula UFIT' },
  { number: 2, label: 'Reconhecimento Dot Lens', short: 'Reconhecimento' },
  { number: 3, label: 'Gerar Saída DotPad', short: 'Saída DotPad' },
  { number: 4, label: 'Ativar Legendas', short: 'Legendas' },
  { number: 5, label: 'Questionário Acessível', short: 'Questionário' },
  { number: 6, label: 'Salvar na Biblioteca', short: 'Salvar' },
]
