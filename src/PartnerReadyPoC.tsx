import { useMemo, useState } from 'react'

type Language = 'ko' | 'en'
type DemoStepId = 'source' | 'analysis' | 'tactile' | 'explore' | 'check'
type DemoId = 'plant' | 'solar' | 'body' | 'water' | 'cell' | 'lab'

type ScienceDemo = {
  id: DemoId
  title: string
  subtitle: string
  classroom: string
  original: string
  analysis: string
  tactile: string
  dotpad: string
  audio: string
  question: string
  answer: string
  partnerValue: string
  tags: string[]
}

const copy = {
  ko: {
    badge: 'PoC Simulation · Integration-ready Science Accessibility',
    title: '과학 이미지를 손끝으로 이해할 수 있게 만듭니다',
    subtitle:
      'UFIT의 디지털 과학 콘텐츠를 AI 기반 촉각 그래픽, DotPad 출력, 음성 설명, 학습 확인 흐름으로 확장하여 시각장애 학생도 통합교육 수업에 함께 참여할 수 있도록 지원하는 PoC입니다.',
    primary: '데모 흐름 보기',
    secondary: '파트너 연동 방식 보기',
    heroNote: '기존 플랫폼을 대체하지 않고, 접근성 학습 레이어로 연결됩니다.',
    flow: ['디지털 과학 콘텐츠', 'AI 접근성 분석', '촉각 그래픽 재설계', 'DotPad + 음성 탐색', '학습 이해 확인'],
    problemTitle: '왜 지금 필요한가',
    problem:
      '과학 수업의 핵심 개념은 그림, 도표, 실험 장면에 담겨 있습니다. 하지만 시각장애 학생에게 단순한 대체 텍스트만으로는 구조, 위치, 관계, 흐름을 충분히 전달하기 어렵습니다.',
    solutionTitle: '어떻게 해결하는가',
    solution:
      'Dot Lens는 원본 이미지를 그대로 변환하지 않습니다. 학습에 필요한 핵심 구조만 추출하고, 손으로 탐색 가능한 선·면·패턴·단계로 재설계하여 DotPad와 음성 설명으로 제공합니다.',
    impactTitle: '어떤 효과가 있는가',
    impact:
      '교사는 기존 디지털 교과서를 유지하면서 접근성 자료를 빠르게 준비할 수 있고, 학생은 촉각·음성·퀴즈를 통해 같은 과학 개념을 단계적으로 이해할 수 있습니다.',
    workflowTitle: '수업 현장 적용 흐름',
    workflowSubtitle: '교사, 학생, 보조교사, 플랫폼 운영자가 각자 무엇을 해야 하는지 한 화면에서 이해할 수 있게 구성했습니다.',
    demoTitle: '5단계 PoC 데모 플로우',
    demoSubtitle: '원본 콘텐츠가 접근 가능한 과학 학습 경험으로 바뀌는 과정을 시연합니다.',
    usecaseTitle: '과학 수업 예시 콘텐츠',
    usecaseSubtitle: '파트너가 실제 교과서·퀴즈·영상 콘텐츠에 바로 대입해 볼 수 있도록 구체적인 주제로 구성했습니다.',
    dotpadTitle: 'DotPad는 출력 장치가 아니라 학습 인터페이스입니다',
    dotpadSubtitle:
      '촉각 그래픽은 단순 이미지 변환이 아니라 시각장애 학생이 손으로 구조를 파악할 수 있도록 재설계된 결과물입니다.',
    integrationTitle: '기존 과학 플랫폼과 연결 가능한 구조',
    integrationSubtitle:
      '이 화면은 실제 연동 완료가 아니라 Integration-ready PoC simulation입니다. API, 임베드 패널, 교사용 검토 화면으로 확장할 수 있게 설계했습니다.',
    roadmapTitle: '사업화 확장 로드맵',
    finalTitle: 'UFIT 과학 콘텐츠를 접근 가능한 학습 경험으로 확장할 준비가 되어 있습니다',
    finalSubtitle:
      '다음 단계는 실제 UFIT 콘텐츠 샘플 5~10개를 기준으로 촉각 품질, 교사 검토 흐름, 학생 이해 확인 데이터를 함께 검증하는 것입니다.',
    finalCta: 'Partner PoC Review Ready',
  },
  en: {
    badge: 'PoC Simulation · Integration-ready Science Accessibility',
    title: 'Make Science Images Understandable Through Touch',
    subtitle:
      'An integration-ready PoC that transforms UFIT science content into AI-redesigned tactile graphics, DotPad output, audio guidance, and learning checks for blind and low-vision students in inclusive classrooms.',
    primary: 'View Demo Flow',
    secondary: 'Explore Integration',
    heroNote: 'Designed as an accessibility layer, not a replacement for the existing platform.',
    flow: ['Digital science content', 'AI accessibility analysis', 'Tactile graphic redesign', 'DotPad + audio exploration', 'Learning check'],
    problemTitle: 'Why this matters now',
    problem:
      'Science learning often depends on diagrams, structures, and visual relationships. Text alternatives alone are not enough for blind and low-vision students to understand spatial concepts, processes, and relationships.',
    solutionTitle: 'How Dot Lens helps',
    solution:
      'Dot Lens does not simply convert images. It extracts the learning structure and redesigns it into touch-readable lines, shapes, patterns, and guided steps for DotPad and audio exploration.',
    impactTitle: 'Expected impact',
    impact:
      'Teachers can keep using existing digital textbooks while preparing accessible materials faster. Students can explore the same science concepts through touch, audio, and comprehension checks.',
    workflowTitle: 'Classroom-ready workflow',
    workflowSubtitle: 'A clear role-based journey for teachers, students, assistants, and platform operators.',
    demoTitle: '5-step PoC demo flow',
    demoSubtitle: 'See how source content becomes an accessible science learning experience.',
    usecaseTitle: 'Science use cases',
    usecaseSubtitle: 'Concrete examples that a partner can map to digital textbooks, quizzes, and lecture media.',
    dotpadTitle: 'DotPad is a learning interface, not just an output device',
    dotpadSubtitle:
      'The tactile graphic is redesigned for touch-based understanding, not directly converted from the source image.',
    integrationTitle: 'Designed to connect with existing science platforms',
    integrationSubtitle:
      'This is not claiming completed production integration. It is an integration-ready PoC simulation for API, embed, and teacher-review workflows.',
    roadmapTitle: 'Commercialization roadmap',
    finalTitle: 'Ready to extend UFIT science content into accessible learning experiences',
    finalSubtitle:
      'The next step is to validate tactile quality, teacher review, and student comprehension with 5–10 real UFIT content samples.',
    finalCta: 'Partner PoC Review Ready',
  },
} satisfies Record<Language, Record<string, string | string[]>>

const roleFlows = [
  {
    role: 'Teacher',
    ko: '디지털 교과서, 퀴즈, 수업 화면에서 접근성 변환이 필요한 과학 콘텐츠를 선택합니다.',
    en: 'Selects science content from the digital textbook, quiz, or classroom screen.',
  },
  {
    role: 'Platform',
    ko: '원본 이미지와 콘텐츠 메타데이터를 Dot Lens 접근성 레이어로 전달합니다.',
    en: 'Sends source image and content metadata to the Dot Lens accessibility layer.',
  },
  {
    role: 'AI Layer',
    ko: '학습 목표에 맞춰 구조를 분석하고 촉각 그래픽, 음성 설명, 확인 질문을 생성합니다.',
    en: 'Analyzes learning structure and creates tactile graphics, audio guidance, and checks.',
  },
  {
    role: 'Student',
    ko: 'DotPad에서 손으로 구조를 탐색하고 음성 안내를 들으며 개념을 이해합니다.',
    en: 'Explores the structure on DotPad and understands the concept with audio guidance.',
  },
  {
    role: 'Assistant',
    ko: '필요 시 단계 탐색을 도와주고 학생의 이해 여부를 함께 확인합니다.',
    en: 'Supports step-by-step exploration and helps confirm student understanding.',
  },
]

const demos: ScienceDemo[] = [
  {
    id: 'plant',
    title: 'Plant Structure',
    subtitle: '식물의 구조',
    classroom: 'Grade 5 · Biology',
    original: 'Root, stem, leaves, and flower diagram from a digital science textbook.',
    analysis: 'Detects plant parts, vertical structure, soil line, and the relationship between roots and leaves.',
    tactile: 'Simplifies the diagram into a central stem, branching roots, two leaf shapes, and a flower marker.',
    dotpad: 'Raised outline for stem and leaves, dense texture for roots, clear top-to-bottom exploration order.',
    audio: 'Start at the bottom. The branching lines are roots. Move upward to the stem, leaves, and flower.',
    question: 'Which part of the plant absorbs water from the soil?',
    answer: 'Roots',
    partnerValue: 'Shows how textbook diagrams become structured tactile learning maps.',
    tags: ['Biology', 'Digital textbook', 'Tactile map'],
  },
  {
    id: 'solar',
    title: 'Solar System',
    subtitle: '태양계',
    classroom: 'Grade 6 · Astronomy',
    original: 'Solar system image with the Sun, orbit lines, and planet positions.',
    analysis: 'Detects the Sun, orbital paths, planet order, and Earth as the third planet.',
    tactile: 'Redesigns the layout into a large Sun marker and three clear orbit paths.',
    dotpad: 'Concentric tactile curves with a raised Earth marker for relative-position learning.',
    audio: 'The Sun is on the left. Follow the orbit paths outward. Earth is the third planet.',
    question: 'Which planet is third from the Sun?',
    answer: 'Earth',
    partnerValue: 'Supports spatial order and relative position through touch.',
    tags: ['Astronomy', 'Spatial order', 'Orbit'],
  },
  {
    id: 'body',
    title: 'Human Digestion',
    subtitle: '인체 소화기관',
    classroom: 'Grade 6 · Human Body',
    original: 'Digestive system diagram with mouth, esophagus, stomach, and intestines.',
    analysis: 'Finds the main digestion route and removes non-essential anatomical detail.',
    tactile: 'Converts the organ sequence into a top-to-bottom tactile route.',
    dotpad: 'Raised path for food movement with distinct markers for stomach and intestines.',
    audio: 'Food starts at the mouth, moves down the esophagus, then reaches the stomach.',
    question: 'Where does food go after the mouth?',
    answer: 'Esophagus',
    partnerValue: 'Turns complex body diagrams into sequence-based concept learning.',
    tags: ['Human body', 'Sequence', 'Concept route'],
  },
  {
    id: 'water',
    title: 'Water Cycle',
    subtitle: '물의 순환',
    classroom: 'Grade 5 · Earth Science',
    original: 'Water cycle illustration with evaporation, clouds, rain, and collection.',
    analysis: 'Detects cycle stages and the directional flow between water, cloud, and land.',
    tactile: 'Creates a looped tactile path with stage markers and direction cues.',
    dotpad: 'Raised arrows, cloud texture, rainfall dots, and a water collection baseline.',
    audio: 'Water rises as vapor, forms clouds, falls as rain, and returns to rivers or the sea.',
    question: 'What is the process called when water vapor forms clouds?',
    answer: 'Condensation',
    partnerValue: 'Explains dynamic science processes through tactile sequence and audio.',
    tags: ['Earth science', 'Process', 'Cycle'],
  },
  {
    id: 'cell',
    title: 'Cell Structure',
    subtitle: '세포 구조',
    classroom: 'Grade 7 · Biology',
    original: 'Cell diagram with membrane, nucleus, cytoplasm, and organelles.',
    analysis: 'Identifies the outer boundary, nucleus position, and key internal parts.',
    tactile: 'Separates the cell into outer shell, center nucleus, and simplified internal zones.',
    dotpad: 'Closed boundary, central raised nucleus, and two texture patterns for internal regions.',
    audio: 'First trace the outer membrane. Then find the round nucleus near the center.',
    question: 'Which part controls many cell activities?',
    answer: 'Nucleus',
    partnerValue: 'Makes dense biology diagrams easier to explore without visual clutter.',
    tags: ['Biology', 'Cell', 'Simplification'],
  },
  {
    id: 'lab',
    title: 'Lab Equipment',
    subtitle: '실험 도구',
    classroom: 'Grade 5 · Experiment Safety',
    original: 'Science lab image with beaker, test tube, dropper, and measuring cylinder.',
    analysis: 'Detects tool shapes and separates each object into an accessible tactile icon.',
    tactile: 'Creates a small tactile icon set with one clear shape per tool.',
    dotpad: 'Tool-by-tool tactile preview with simple outlines and different fill patterns.',
    audio: 'The wide cup shape is a beaker. The narrow tall shape is a test tube.',
    question: 'Which tool is usually used to hold and measure liquid?',
    answer: 'Beaker',
    partnerValue: 'Supports pre-lab preparation and inclusive experiment participation.',
    tags: ['Lab', 'Safety', 'Tool icons'],
  },
]

const demoSteps: { id: DemoStepId; ko: string; en: string }[] = [
  { id: 'source', ko: '원본 콘텐츠 선택', en: 'Select source content' },
  { id: 'analysis', ko: 'AI 접근성 분석', en: 'AI accessibility analysis' },
  { id: 'tactile', ko: '촉각 그래픽 재설계', en: 'Tactile redesign' },
  { id: 'explore', ko: 'DotPad + 음성 탐색', en: 'DotPad + audio exploration' },
  { id: 'check', ko: '학습 이해 확인', en: 'Learning check' },
]

const roadmap = [
  ['Phase 1', '과학 이미지 접근성 PoC', 'Science image accessibility PoC'],
  ['Phase 2', '교과서·퀴즈·영상 강의 연동', 'Textbook, quiz, and lecture integration'],
  ['Phase 3', '교사용 관리 화면 및 학습 로그', 'Teacher dashboard and learning logs'],
  ['Phase 4', '다국어·현지 교육과정 대응', 'Multilingual and local curriculum support'],
  ['Phase 5', '정식 플랫폼 파트너십 확장', 'Official platform partnership expansion'],
]

function t(lang: Language, key: keyof typeof copy.ko) {
  return copy[lang][key]
}

function dotRaised(id: DemoId, x: number, y: number) {
  if (id === 'plant') {
    return Math.abs(x - 30) < 1 && y > 8 && y < 30
      || Math.hypot(x - 30, y - 7) < 4.8 && Math.hypot(x - 30, y - 7) > 2.1
      || ((x - 22) / 8) ** 2 + ((y - 17) / 4) ** 2 < 1
      || ((x - 38) / 8) ** 2 + ((y - 15) / 4) ** 2 < 1
      || (y === 30 && x > 8 && x < 53)
      || (y > 30 && (Math.abs(x - (30 - (y - 30) * .9)) < 1 || Math.abs(x - (30 + (y - 30) * .9)) < 1 || Math.abs(x - 30) < 1))
  }
  if (id === 'solar') {
    return Math.hypot(x - 10, y - 20) < 5
      || Math.abs(((x - 10) / 15) ** 2 + ((y - 20) / 7) ** 2 - 1) < .15
      || Math.abs(((x - 10) / 26) ** 2 + ((y - 20) / 12) ** 2 - 1) < .11
      || Math.abs(((x - 10) / 39) ** 2 + ((y - 20) / 17) ** 2 - 1) < .09
      || Math.hypot(x - 34, y - 12) < 2.2
  }
  if (id === 'body') {
    return Math.hypot(x - 30, y - 6) < 3
      || Math.abs(x - 30) < 1 && y > 8 && y < 16
      || ((x - 30) / 6) ** 2 + ((y - 19) / 4) ** 2 < 1
      || (y > 24 && y < 34 && x > 18 && x < 42 && (Math.sin((x + y) / 3) > .62 || Math.cos((x - y) / 4) > .68))
  }
  if (id === 'water') {
    return (x > 6 && x < 28 && y === 31 + Math.round(Math.sin(x / 4)))
      || (Math.hypot(x - 38, y - 10) < 4 || Math.hypot(x - 44, y - 9) < 5 || Math.hypot(x - 50, y - 11) < 4)
      || (x > 39 && x < 51 && y > 15 && y < 25 && (x + y) % 5 === 0)
      || (x > 14 && x < 24 && y > 15 && y < 29 && (x - y) % 5 === 0)
      || (x > 24 && x < 48 && Math.abs(y - (32 - Math.abs(x - 36) * .55)) < 1)
  }
  if (id === 'cell') {
    return Math.abs(((x - 30) / 22) ** 2 + ((y - 20) / 13) ** 2 - 1) < .08
      || Math.hypot(x - 31, y - 19) < 4.5
      || Math.hypot(x - 20, y - 22) < 2
      || Math.hypot(x - 43, y - 17) < 2
      || (x > 15 && x < 46 && y > 12 && y < 29 && (x + y) % 13 === 0)
  }
  return (x > 8 && x < 20 && y > 14 && y < 30 && (x === 9 || x === 19 || y === 29))
    || (x > 26 && x < 34 && y > 8 && y < 31 && (x === 27 || x === 33 || y === 30))
    || (x > 40 && x < 51 && y > 12 && y < 33 && (x === 41 || x === 50 || y === 32 || (y > 25 && x > 42 && x < 49)))
}

export default function PartnerReadyPoC() {
  const [lang, setLang] = useState<Language>('ko')
  const [activeDemo, setActiveDemo] = useState<DemoId>('plant')
  const [activeStep, setActiveStep] = useState<DemoStepId>('source')
  const c = copy[lang]
  const demo = demos.find((item) => item.id === activeDemo) ?? demos[0]
  const dots = useMemo(() => {
    return Array.from({ length: 60 * 40 }, (_, index) => {
      const x = index % 60
      const y = Math.floor(index / 60)
      return { x, y, raised: dotRaised(demo.id, x, y) }
    })
  }, [demo.id])

  const stepDetail = {
    source: demo.original,
    analysis: demo.analysis,
    tactile: demo.tactile,
    explore: `${demo.dotpad} ${demo.audio}`,
    check: `${demo.question} Answer: ${demo.answer}`,
  } satisfies Record<DemoStepId, string>

  return (
    <main className="partner-poc">
      <header className="pp-topbar">
        <a className="pp-brand" href="#top" aria-label="Dot Lens PoC home">
          <span className="pp-mark">dot.</span>
          <span>Dot Lens · UFIT Science Accessibility</span>
        </a>
        <nav className="pp-nav" aria-label="Page sections">
          <a href="#workflow">Workflow</a>
          <a href="#demo">Demo</a>
          <a href="#integration">Integration</a>
          <a href="#roadmap">Roadmap</a>
        </nav>
        <div className="pp-lang" role="group" aria-label="Language">
          <button className={lang === 'ko' ? 'active' : ''} onClick={() => setLang('ko')}>KR</button>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        </div>
      </header>

      <section id="top" className="pp-hero">
        <div className="pp-hero-copy">
          <span className="pp-eyebrow">{c.badge}</span>
          <h1>{c.title}</h1>
          <p>{c.subtitle}</p>
          <div className="pp-actions">
            <a href="#demo" className="pp-button primary">{c.primary}</a>
            <a href="#integration" className="pp-button secondary">{c.secondary}</a>
          </div>
          <small>{c.heroNote}</small>
        </div>

        <div className="pp-pipeline" aria-label="Science accessibility workflow">
          {(c.flow as string[]).map((item, index) => (
            <div className="pp-pipeline-step" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="pp-triad" aria-label="Problem solution impact">
        <article>
          <span>Problem</span>
          <h2>{c.problemTitle}</h2>
          <p>{c.problem}</p>
        </article>
        <article>
          <span>Solution</span>
          <h2>{c.solutionTitle}</h2>
          <p>{c.solution}</p>
        </article>
        <article>
          <span>Impact</span>
          <h2>{c.impactTitle}</h2>
          <p>{c.impact}</p>
        </article>
      </section>

      <section id="workflow" className="pp-section">
        <div className="pp-section-head">
          <span className="pp-eyebrow">Classroom adoption</span>
          <h2>{c.workflowTitle}</h2>
          <p>{c.workflowSubtitle}</p>
        </div>
        <div className="pp-role-flow">
          {roleFlows.map((flow, index) => (
            <article key={flow.role}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{flow.role}</h3>
              <p>{flow[lang]}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="demo" className="pp-section pp-demo-section">
        <div className="pp-section-head">
          <span className="pp-eyebrow">Demo flow</span>
          <h2>{c.demoTitle}</h2>
          <p>{c.demoSubtitle}</p>
        </div>

        <div className="pp-demo-tabs" role="tablist" aria-label="Science demo content">
          {demos.map((item) => (
            <button
              key={item.id}
              className={item.id === activeDemo ? 'active' : ''}
              onClick={() => setActiveDemo(item.id)}
              role="tab"
              aria-selected={item.id === activeDemo}
            >
              <span>{item.subtitle}</span>
              {item.title}
            </button>
          ))}
        </div>

        <div className="pp-demo-grid">
          <article className="pp-demo-card pp-source-card">
            <span className="pp-card-label">Science sample</span>
            <h3>{demo.title}</h3>
            <p>{demo.subtitle} · {demo.classroom}</p>
            <div className="pp-tags">
              {demo.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <strong>{demo.partnerValue}</strong>
          </article>

          <article className="pp-demo-card pp-step-card">
            <div className="pp-step-list" role="tablist" aria-label="Demo steps">
              {demoSteps.map((step, index) => (
                <button
                  key={step.id}
                  className={activeStep === step.id ? 'active' : ''}
                  onClick={() => setActiveStep(step.id)}
                  role="tab"
                  aria-selected={activeStep === step.id}
                >
                  <span>{index + 1}</span>
                  {step[lang]}
                </button>
              ))}
            </div>
            <div className="pp-step-output">
              <span>Current simulation</span>
              <h3>{demoSteps.find((step) => step.id === activeStep)?.[lang]}</h3>
              <p>{stepDetail[activeStep]}</p>
            </div>
          </article>

          <article className="pp-demo-card pp-dotpad-card">
            <div className="pp-dotpad-head">
              <div>
                <span className="pp-card-label">Simulated DotPad output</span>
                <h3>60 × 40 tactile preview</h3>
              </div>
              <span className="pp-status">Preview only</span>
            </div>
            <div className="pp-dotpad" aria-label={`Simulated tactile output for ${demo.title}`}>
              {dots.map((dot) => (
                <i key={`${dot.x}-${dot.y}`} className={dot.raised ? 'raised' : ''} />
              ))}
            </div>
            <p className="pp-dotpad-note">{lang === 'ko'
              ? '원본 이미지를 그대로 복사하지 않고, 손으로 탐색 가능한 학습 구조로 재설계한 출력입니다.'
              : 'This is redesigned for touch-based learning, not a direct copy of the source image.'}</p>
          </article>
        </div>
      </section>

      <section className="pp-section pp-usecases">
        <div className="pp-section-head">
          <span className="pp-eyebrow">Science curriculum fit</span>
          <h2>{c.usecaseTitle}</h2>
          <p>{c.usecaseSubtitle}</p>
        </div>
        <div className="pp-usecase-grid">
          {demos.map((item) => (
            <article key={item.id}>
              <span>{item.classroom}</span>
              <h3>{item.title}</h3>
              <p>{item.partnerValue}</p>
              <ul>
                <li>Original content</li>
                <li>AI tactile redesign</li>
                <li>DotPad output</li>
                <li>Audio guide</li>
                <li>Learning check</li>
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="pp-section pp-dotpad-explain">
        <div>
          <span className="pp-eyebrow">DotPad learning interface</span>
          <h2>{c.dotpadTitle}</h2>
          <p>{c.dotpadSubtitle}</p>
        </div>
        <div className="pp-capability-grid">
          {['Raised / recessed tactile patterns', 'Step-by-step exploration', 'Audio description script', 'Keyboard navigation', 'Screen reader status', 'Teacher learning check'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section id="integration" className="pp-section pp-integration">
        <div className="pp-section-head">
          <span className="pp-eyebrow">Partner integration</span>
          <h2>{c.integrationTitle}</h2>
          <p>{c.integrationSubtitle}</p>
        </div>
        <div className="pp-integration-grid">
          <article>
            <h3>API-ready conversion</h3>
            <p>Send content metadata and receive tactile SVG, DotPad matrix, audio script, and learning-check data.</p>
            <code>{`POST /accessibility/science-conversion`}</code>
          </article>
          <article>
            <h3>Embeddable classroom panel</h3>
            <p>Show DotPad preview, audio guide, and quiz support inside the existing UFIT lesson screen.</p>
            <code>{`<DotLensPanel contentId="ufit-science-001" />`}</code>
          </article>
          <article>
            <h3>Teacher review workflow</h3>
            <p>Allow teachers or accessibility reviewers to approve outputs before classroom use.</p>
            <code>{`status: "poc_simulation"`}</code>
          </article>
        </div>
      </section>

      <section id="roadmap" className="pp-section pp-roadmap">
        <div className="pp-section-head">
          <span className="pp-eyebrow">Rollout plan</span>
          <h2>{c.roadmapTitle}</h2>
        </div>
        <div className="pp-roadmap-list">
          {roadmap.map(([phase, ko, en]) => (
            <article key={phase}>
              <span>{phase}</span>
              <strong>{lang === 'ko' ? ko : en}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="pp-final">
        <span className="pp-eyebrow">Next partner review</span>
        <h2>{c.finalTitle}</h2>
        <p>{c.finalSubtitle}</p>
        <strong>{c.finalCta}</strong>
      </section>
    </main>
  )
}
