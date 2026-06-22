export type LectureMarker = {
  id: string
  seconds: number
  time: string
  title: string
  type: 'intro' | 'diagram' | 'tactile' | 'quiz'
  tactileTitle: string
  description: string
}

export const lectureMarkers: LectureMarker[] = [
  {
    id: 'introduction',
    seconds: 15,
    time: '00:15',
    title: 'Introdução',
    type: 'intro',
    tactileTitle: 'Cena Tátil: Planta Completa',
    description:
      'A aula apresenta as quatro partes principais de uma planta: a raiz, o caule, as folhas e a flor.',
  },
  {
    id: 'plant-diagram',
    seconds: 80,
    time: '01:20',
    title: 'Diagrama: Estrutura da Planta',
    type: 'diagram',
    tactileTitle: 'Cena Tátil: Estrutura da Planta',
    description:
      'Um diagrama completo da planta aparece na tela. A flor está no topo, o caule no centro e as raízes se espalham abaixo da linha do solo.',
  },
  {
    id: 'root-function',
    seconds: 130,
    time: '02:10',
    title: 'Função da Raiz',
    type: 'tactile',
    tactileTitle: 'Cena Tátil: Raiz da Planta',
    description:
      'Neste momento da aula, a raiz é destacada na parte inferior da planta. Ela absorve água e sais minerais do solo.',
  },
  {
    id: 'quiz-moment',
    seconds: 180,
    time: '03:00',
    title: 'Momento do Questionário',
    type: 'quiz',
    tactileTitle: 'Revisão Tátil: Raiz da Planta',
    description:
      'A aula pausa para uma pergunta acessível sobre qual parte da planta absorve água do solo.',
  },
]

export const videoAnalysisSteps = [
  { label: 'Transcrição extraída', result: 'PT-BR · 684 palavras' },
  { label: 'Imagem científica detectada', result: 'Diagrama de plantas' },
  { label: 'Momento de questionário detectado', result: '03:00' },
  { label: 'Cena tátil gerada', result: '4 cenas' },
  { label: 'Legendas e resumo gerados', result: 'Pronto' },
  { label: 'Salvo como pacote de aula acessível', result: 'Educação' },
]

export const lecturePacks = [
  {
    id: 'plant-video',
    title: 'Aula em Vídeo: Estrutura das Plantas',
    grade: '5º Ano',
    duration: '04:18',
    scenes: 4,
    quizzes: 1,
    status: 'Em revisão',
    tone: 'green',
  },
  {
    id: 'solar-video',
    title: 'Aula em Vídeo: Sistema Solar',
    grade: '6º Ano',
    duration: '06:42',
    scenes: 6,
    quizzes: 2,
    status: 'Rascunho',
    tone: 'purple',
  },
  {
    id: 'water-video',
    title: 'Aula em Vídeo: Ciclo da Água',
    grade: '5º Ano',
    duration: '05:25',
    scenes: 5,
    quizzes: 1,
    status: 'Pronto',
    tone: 'blue',
  },
]
