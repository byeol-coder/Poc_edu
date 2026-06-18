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
    title: 'Introduction',
    type: 'intro',
    tactileTitle: 'Tactile Scene: Whole Plant',
    description:
      'The lecture introduces the four main parts of a plant: the root, stem, leaves, and flower.',
  },
  {
    id: 'plant-diagram',
    seconds: 80,
    time: '01:20',
    title: 'Plant Structure Diagram',
    type: 'diagram',
    tactileTitle: 'Tactile Scene: Plant Structure',
    description:
      'A full plant diagram appears. The flower is at the top, the stem is in the center, and the roots spread below the soil line.',
  },
  {
    id: 'root-function',
    seconds: 130,
    time: '02:10',
    title: 'Root Function',
    type: 'tactile',
    tactileTitle: 'Tactile Scene: Plant Root',
    description:
      'At this point in the lecture, the root is shown at the bottom of the plant. It absorbs water from the soil.',
  },
  {
    id: 'quiz-moment',
    seconds: 180,
    time: '03:00',
    title: 'Quiz Moment',
    type: 'quiz',
    tactileTitle: 'Tactile Review: Plant Root',
    description:
      'The lecture pauses for an accessible question about which plant part absorbs water from the soil.',
  },
]

export const videoAnalysisSteps = [
  { label: 'Transcript extracted', result: 'PT-BR · 684 words' },
  { label: 'Key science image detected', result: 'Plant diagram' },
  { label: 'Quiz moment detected', result: '03:00' },
  { label: 'Tactile scene generated', result: '4 scenes' },
  { label: 'Captions and summary generated', result: 'Ready' },
  { label: 'Saved as accessible lecture pack', result: 'Education' },
]

export const lecturePacks = [
  {
    id: 'plant-video',
    title: 'Plant Structure Video Lesson',
    grade: 'Grade 5',
    duration: '04:18',
    scenes: 4,
    quizzes: 1,
    status: 'In Review',
    tone: 'green',
  },
  {
    id: 'solar-video',
    title: 'Solar System Video Lesson',
    grade: 'Grade 6',
    duration: '06:42',
    scenes: 6,
    quizzes: 2,
    status: 'Draft',
    tone: 'purple',
  },
  {
    id: 'water-video',
    title: 'Water Cycle Video Lesson',
    grade: 'Grade 5',
    duration: '05:25',
    scenes: 5,
    quizzes: 1,
    status: 'Ready',
    tone: 'blue',
  },
]
