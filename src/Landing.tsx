import { useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Blocks,
  Captions,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Code2,
  Database,
  Ear,
  Eye,
  GraduationCap,
  Hand,
  Layers,
  MonitorPlay,
  Network,
  ScanLine,
  Users,
  Volume2,
} from 'lucide-react'
import { Simulation } from './App'

type Lang = 'en' | 'ko'

const copy = {
  en: {
    nav: { problem: 'Problem', solution: 'Solution', flow: 'Classroom flow', sim: 'Simulation', partner: 'Partner', cta: 'Explore simulation' },
    hero: {
      badge: 'UFIT Science Accessibility · PoC',
      title1: 'Make UFIT science lessons ',
      titleAccent: 'understandable by touch',
      title2: ', for every student.',
      sub: 'Dot Lens adds an accessibility layer on top of UFIT digital science content — turning images, diagrams and quizzes into DotPad tactile graphics, audio descriptions and captions, without replacing the lesson the teacher already uses.',
      primary: 'Explore PoC simulation',
      secondary: 'Partner integration plan',
      note: 'A layer on top of UFIT — not a replacement platform.',
      chips: ['Integration-ready', 'Classroom-ready', 'Pilot-ready', 'UFIT platform layer'],
      screenTag: 'UFIT science lesson',
      lensLabel: 'Dot Lens accessibility layer',
      outs: [
        { icon: <CircleDot size={16} />, label: 'Tactile' },
        { icon: <Volume2 size={16} />, label: 'Audio' },
        { icon: <Captions size={16} />, label: 'Captions' },
      ],
      floatTitle: 'Same lesson, shared',
      floatText: 'Sighted, blind and deaf students stay on one classroom screen.',
    },
    problem: {
      eyebrow: 'The problem',
      title: 'In Brazilian inclusive classrooms, science visuals are the bottleneck',
      lead: 'Science meaning lives in diagrams, structures and processes. Teachers want to keep using their existing UFIT digital content — but a blind student cannot reach that meaning through plain alt text, and there is rarely time to prepare a separate tactile version mid-lesson.',
      cards: [
        { icon: <Eye size={20} />, title: 'Visuals carry the concept', text: 'Plant structure, cells, ecosystems and the water cycle are taught through images, not sentences. Text alone loses position, structure and relationships.' },
        { icon: <GraduationCap size={20} />, title: 'Teachers keep their material', text: 'Teachers will not abandon the digital science content they already trust. Any accessibility step has to fit inside the lesson they are already running.' },
        { icon: <Users size={20} />, title: 'One class, mixed needs', text: 'Blind, deaf and sighted students share the same room and the same lesson. They need parallel ways to reach the same concept at the same time.' },
      ],
    },
    solution: {
      eyebrow: 'The solution',
      title: 'An accessibility layer on the UFIT screen — not a separate app',
      lead: 'Dot Lens does not convert the original image pixel-for-pixel. It extracts the structure that matters for learning and rebuilds it as lines, regions and steps that a student can read by hand on a DotPad, paired with audio and text.',
      flow: [
        { icon: <ScanLine size={18} />, title: 'Image · diagram · quiz', text: 'UFIT lesson content the teacher already shows.' },
        { icon: <Layers size={18} />, title: 'Tactile graphic', text: 'Key structure rebuilt for touch, not a raw image copy.' },
        { icon: <CircleDot size={18} />, title: 'DotPad output', text: '60 × 40 refreshable pins, the same scene on screen and device.' },
        { icon: <Volume2 size={18} />, title: 'Audio + text', text: 'Spoken description and captions in Portuguese.' },
        { icon: <Hand size={18} />, title: 'Participation', text: 'Student explores, answers, and joins the discussion.' },
      ],
    },
    flow: {
      eyebrow: 'Classroom flow',
      title: 'How a teacher uses it during a live lesson',
      lead: 'Five steps that fit inside an ordinary science class. The teacher stays in control of pacing the whole time.',
      steps: [
        { role: 'Teacher', title: 'Open the UFIT science lesson', text: 'The teacher starts the lesson exactly as today, on the existing UFIT digital content.' },
        { role: 'Dot Lens', title: 'Detect the image, diagram or quiz', text: 'Dot Lens recognizes the visual on screen and the Portuguese text around it.' },
        { role: 'System', title: 'Generate the tactile version and explanation', text: 'A tactile graphic, audio description and caption are produced for the detected content.' },
        { role: 'Student', title: 'Explore through the DotPad', text: 'The blind student reads the structure by hand and listens to the description.' },
        { role: 'Teacher', title: 'Check understanding and continue', text: 'A short accessible quiz confirms the concept, then the class moves on together.' },
      ],
    },
    sim: {
      eyebrow: 'PoC simulation',
      title: 'A working classroom demo, not a slideshow',
      lead: 'This is the live PoC. AI recognition is a clearly labelled mock, but the DotPad output uses the real DotPad SDK over Web Bluetooth, and every interaction is recorded as learning data.',
      panelLabel: 'Dot Lens — UFIT science simulation',
      panelNote: 'Mock AI recognition · real DotPad SDK output · session data recorded',
      compareTitle: 'What each learner receives from one lesson image',
      compare: [
        { icon: <MonitorPlay size={14} />, cap: 'Original UFIT content', text: 'The science image, diagram or quiz the class sees on the board.' },
        { icon: <CircleDot size={14} />, cap: 'DotPad tactile output', text: 'The same structure as raised pins the student can read by hand.' },
        { icon: <Volume2 size={14} />, cap: 'Audio + text guide', text: 'A spoken description plus Portuguese caption and summary.' },
        { icon: <Check size={14} />, cap: 'Student response', text: 'An accessible quiz answer that confirms understanding.' },
      ],
      sampleTitle: 'Sample science content in the demo',
      samples: ['Plant structure', 'Solar system', 'Water cycle', 'Cell (planned)', 'Ecosystem (planned)', 'Science quiz'],
    },
    value: {
      eyebrow: 'Accessibility value',
      title: 'One lesson, four points of view',
      lead: 'The same science concept reaches every participant in the way that works for them.',
      cards: [
        { icon: <CircleDot size={20} />, title: 'Blind / low-vision student', items: ['Tactile graphic on the DotPad', 'Audio description of structure', 'Reads the concept independently'] },
        { icon: <Ear size={20} />, title: 'Deaf / hard-of-hearing student', items: ['Caption and text-first explanation', 'Visual summary of key terms', 'Follows the lesson without audio'] },
        { icon: <GraduationCap size={20} />, title: 'Teacher', items: ['Keeps the existing UFIT lesson flow', 'No separate materials to prepare', 'Checks understanding in seconds'] },
        { icon: <Blocks size={20} />, title: 'UFIT as the platform', items: ['An accessibility layer, not a fork', 'Reusable across the science catalog', 'New value for inclusive education buyers'] },
      ],
    },
    partner: {
      eyebrow: 'Partner integration',
      title: 'Designed to attach to the UFIT platform',
      lead: 'This screen is an integration-ready PoC simulation, not a finished integration. Three connection paths let UFIT start small and expand.',
      lanes: [
        { icon: <Code2 size={20} />, tag: 'API', title: 'Recognition + generation API', text: 'UFIT sends a lesson image and text; Dot Lens returns a tactile scene, audio description and caption package.', code: 'POST /v1/accessible-scene' },
        { icon: <Network size={20} />, tag: 'Embed', title: 'Embedded accessibility panel', text: 'A panel that drops into the existing UFIT lesson view, so teachers never leave the platform they know.', code: '<dot-lens-panel lesson="…">' },
        { icon: <Database size={20} />, tag: 'Pipeline', title: 'Content pipeline', text: 'Batch-process a unit of UFIT science content into a reusable tactile library mapped to the curriculum.', code: 'unit → tactile library' },
      ],
      expandTitle: 'Where it grows after the first PoC',
      expand: [
        { n: '01', title: 'Per-unit tactile library', text: 'Move from a few sample lessons to a curriculum-mapped library of reusable tactile packages.' },
        { n: '02', title: 'Teacher dashboard', text: 'A view for teachers to preview, adjust and assign accessible versions before class.' },
        { n: '03', title: 'Student learning logs', text: 'Non-personal interaction data on tactile exploration, audio use and quiz responses.' },
        { n: '04', title: 'Reports', text: 'Aggregated accessibility coverage and engagement reports for schools and UFIT.' },
      ],
    },
    roadmap: {
      eyebrow: 'Pilot roadmap',
      title: 'A realistic path to a September PoC launch',
      lead: 'Scoped to validate tactile quality, teacher workflow and student understanding on real UFIT content.',
      phases: [
        { phase: 'Phase 1', title: 'Content mapping', text: 'Select 5–10 UFIT science lessons and map their key visuals.' },
        { phase: 'Phase 2', title: 'Tactile conversion sample', text: 'Produce and review tactile + audio + caption packages.' },
        { phase: 'Phase 3', title: 'Classroom simulation', text: 'Run the full flow end-to-end on real DotPad hardware.' },
        { phase: 'Phase 4', title: 'Teacher / student feedback', text: 'Collect usability and understanding data from a small group.' },
        { phase: 'Phase 5', title: 'Brazil pilot launch', text: 'Launch the PoC pilot with UFIT in September.' },
      ],
    },
    final: {
      title: 'Ready to extend UFIT science content into an accessible learning experience',
      sub: 'The next step is to validate tactile quality, the teacher review flow and student understanding on a sample of 5–10 real UFIT lessons.',
      primary: 'Explore PoC simulation',
      secondary: 'Partner integration plan',
      footerLeft: 'UFIT × Dot Inc. · Science without barriers',
      footerRight: 'Prototype · Partner review ready',
    },
  },
  ko: {
    nav: { problem: '문제', solution: '해결 방식', flow: '수업 흐름', sim: '시뮬레이션', partner: '파트너', cta: '시뮬레이션 보기' },
    hero: {
      badge: 'UFIT 과학 접근성 · PoC',
      title1: 'UFIT 과학 수업을 ',
      titleAccent: '손끝으로 이해할 수 있게',
      title2: ', 모든 학생에게.',
      sub: 'Dot Lens는 UFIT 디지털 과학 콘텐츠 위에 접근성 레이어를 더합니다. 교사가 쓰던 수업을 대체하지 않고, 이미지·도표·퀴즈를 DotPad 촉각 그래픽, 음성 설명, 자막으로 확장합니다.',
      primary: 'PoC 시뮬레이션 보기',
      secondary: '파트너 연동 방식',
      note: 'UFIT을 대체하는 플랫폼이 아니라, 그 위에 얹는 레이어입니다.',
      chips: ['Integration-ready', 'Classroom-ready', 'Pilot-ready', 'UFIT Platform Layer'],
      screenTag: 'UFIT 과학 수업',
      lensLabel: 'Dot Lens 접근성 레이어',
      outs: [
        { icon: <CircleDot size={16} />, label: '촉각' },
        { icon: <Volume2 size={16} />, label: '음성' },
        { icon: <Captions size={16} />, label: '자막' },
      ],
      floatTitle: '같은 수업, 함께',
      floatText: '비장애·시각장애·청각장애 학생이 하나의 수업 화면을 공유합니다.',
    },
    problem: {
      eyebrow: '문제',
      title: '브라질 통합교육 수업에서 시각 자료가 병목이 됩니다',
      lead: '과학의 핵심 의미는 도표·구조·과정 같은 그림 안에 있습니다. 교사는 기존 UFIT 디지털 콘텐츠를 그대로 쓰고 싶어 하지만, 시각장애 학생은 단순 대체 텍스트로 그 의미에 닿을 수 없고, 수업 중 별도 촉각 자료를 만들 시간도 없습니다.',
      cards: [
        { icon: <Eye size={20} />, title: '개념은 그림이 담는다', text: '식물 구조, 세포, 생태계, 물의 순환은 문장이 아니라 그림으로 가르칩니다. 텍스트만으로는 위치·구조·관계가 사라집니다.' },
        { icon: <GraduationCap size={20} />, title: '교사는 기존 자료를 유지한다', text: '교사는 이미 신뢰하는 디지털 과학 콘텐츠를 버리지 않습니다. 모든 접근성 단계는 진행 중인 수업 안에 들어와야 합니다.' },
        { icon: <Users size={20} />, title: '한 교실, 서로 다른 필요', text: '시각장애·청각장애·비장애 학생이 같은 교실, 같은 수업을 공유합니다. 같은 개념에 동시에 닿는 병렬 경로가 필요합니다.' },
      ],
    },
    solution: {
      eyebrow: '해결 방식',
      title: '별도 앱이 아니라 UFIT 화면 위의 접근성 레이어',
      lead: 'Dot Lens는 원본 이미지를 픽셀 그대로 변환하지 않습니다. 학습에 필요한 구조만 추출해 손으로 읽을 수 있는 선·면·단계로 재설계하고, 음성·텍스트와 함께 DotPad로 제공합니다.',
      flow: [
        { icon: <ScanLine size={18} />, title: '이미지 · 도표 · 퀴즈', text: '교사가 이미 보여주는 UFIT 수업 콘텐츠.' },
        { icon: <Layers size={18} />, title: '촉각 그래픽', text: '이미지 복사가 아니라 촉각용으로 재구성된 핵심 구조.' },
        { icon: <CircleDot size={18} />, title: 'DotPad 출력', text: '60 × 40 가변 핀, 화면과 기기에 동일한 장면.' },
        { icon: <Volume2 size={18} />, title: '음성 + 텍스트', text: '포르투갈어 음성 설명과 자막.' },
        { icon: <Hand size={18} />, title: '수업 참여', text: '학생이 탐색하고, 답하고, 토론에 참여.' },
      ],
    },
    flow: {
      eyebrow: '수업 흐름',
      title: '교사가 실시간 수업에서 사용하는 순서',
      lead: '평범한 과학 수업 안에 들어가는 다섯 단계입니다. 진행 속도는 처음부터 끝까지 교사가 통제합니다.',
      steps: [
        { role: '교사', title: 'UFIT 과학 수업 열기', text: '기존 UFIT 디지털 콘텐츠로 평소와 똑같이 수업을 시작합니다.' },
        { role: 'Dot Lens', title: '이미지 · 도표 · 퀴즈 감지', text: '화면의 시각 자료와 주변 포르투갈어 텍스트를 인식합니다.' },
        { role: '시스템', title: '촉각 버전과 설명 생성', text: '감지된 콘텐츠에 대한 촉각 그래픽·음성 설명·자막을 만듭니다.' },
        { role: '학생', title: 'DotPad로 탐색', text: '시각장애 학생이 손으로 구조를 읽고 설명을 듣습니다.' },
        { role: '교사', title: '이해 확인 후 진행', text: '짧은 접근성 퀴즈로 개념을 확인하고 수업을 함께 이어갑니다.' },
      ],
    },
    sim: {
      eyebrow: 'PoC 시뮬레이션',
      title: '슬라이드가 아니라 작동하는 수업 데모',
      lead: '실제 PoC입니다. AI 인식은 명확히 표시된 목업이지만, DotPad 출력은 실제 DotPad SDK를 Web Bluetooth로 사용하고, 모든 상호작용은 학습 데이터로 기록됩니다.',
      panelLabel: 'Dot Lens — UFIT 과학 시뮬레이션',
      panelNote: 'AI 인식은 목업 · DotPad 출력은 실제 SDK · 세션 데이터 기록',
      compareTitle: '하나의 수업 이미지에서 학생별로 받는 것',
      compare: [
        { icon: <MonitorPlay size={14} />, cap: '원본 UFIT 콘텐츠', text: '교실 화면에 보이는 과학 이미지·도표·퀴즈.' },
        { icon: <CircleDot size={14} />, cap: 'DotPad 촉각 출력', text: '손으로 읽는 동일 구조의 돌출 핀.' },
        { icon: <Volume2 size={14} />, cap: '음성 + 텍스트 안내', text: '음성 설명과 포르투갈어 자막·요약.' },
        { icon: <Check size={14} />, cap: '학생 응답', text: '이해를 확인하는 접근성 퀴즈 응답.' },
      ],
      sampleTitle: '데모에 포함된 과학 콘텐츠 예시',
      samples: ['식물 구조', '태양계', '물의 순환', '세포 (예정)', '생태계 (예정)', '과학 퀴즈'],
    },
    value: {
      eyebrow: '접근성 가치',
      title: '하나의 수업, 네 가지 관점',
      lead: '같은 과학 개념이 각자에게 맞는 방식으로 모든 참여자에게 전달됩니다.',
      cards: [
        { icon: <CircleDot size={20} />, title: '시각장애 / 저시력 학생', items: ['DotPad 촉각 그래픽', '구조에 대한 음성 설명', '스스로 개념을 읽음'] },
        { icon: <Ear size={20} />, title: '청각장애 / 난청 학생', items: ['자막·텍스트 중심 설명', '핵심 용어 시각 요약', '음성 없이 수업을 따라감'] },
        { icon: <GraduationCap size={20} />, title: '교사', items: ['기존 UFIT 수업 흐름 유지', '별도 자료 준비 불필요', '몇 초 만에 이해 확인'] },
        { icon: <Blocks size={20} />, title: '플랫폼으로서의 UFIT', items: ['포크가 아니라 접근성 레이어', '과학 카탈로그 전반에 재사용', '통합교육 구매자에게 새로운 가치'] },
      ],
    },
    partner: {
      eyebrow: '파트너 연동',
      title: 'UFIT 플랫폼에 붙이도록 설계되었습니다',
      lead: '이 화면은 완료된 연동이 아니라 Integration-ready PoC 시뮬레이션입니다. 세 가지 연결 경로로 UFIT은 작게 시작해 확장할 수 있습니다.',
      lanes: [
        { icon: <Code2 size={20} />, tag: 'API', title: '인식 + 생성 API', text: 'UFIT이 수업 이미지와 텍스트를 보내면, Dot Lens가 촉각 장면·음성 설명·자막 패키지를 반환합니다.', code: 'POST /v1/accessible-scene' },
        { icon: <Network size={20} />, tag: 'Embed', title: '임베드 접근성 패널', text: '기존 UFIT 수업 화면에 끼워 넣는 패널로, 교사는 익숙한 플랫폼을 떠나지 않습니다.', code: '<dot-lens-panel lesson="…">' },
        { icon: <Database size={20} />, tag: 'Pipeline', title: '콘텐츠 파이프라인', text: 'UFIT 과학 콘텐츠 단원을 일괄 처리해 교육과정에 매핑된 재사용 촉각 라이브러리로 만듭니다.', code: 'unit → tactile library' },
      ],
      expandTitle: '첫 PoC 이후 확장 방향',
      expand: [
        { n: '01', title: '단원별 촉각 라이브러리', text: '샘플 몇 개에서 교육과정에 매핑된 재사용 촉각 패키지 라이브러리로 확장.' },
        { n: '02', title: '교사 대시보드', text: '수업 전 접근성 버전을 미리 보고, 조정하고, 배정하는 교사용 화면.' },
        { n: '03', title: '학생 학습 로그', text: '촉각 탐색·음성 사용·퀴즈 응답에 대한 비개인 상호작용 데이터.' },
        { n: '04', title: '리포트', text: '학교와 UFIT을 위한 접근성 커버리지·참여 집계 리포트.' },
      ],
    },
    roadmap: {
      eyebrow: '파일럿 로드맵',
      title: '9월 PoC 런칭을 향한 현실적인 경로',
      lead: '실제 UFIT 콘텐츠에서 촉각 품질·교사 워크플로·학생 이해를 검증하도록 범위를 잡았습니다.',
      phases: [
        { phase: 'Phase 1', title: '콘텐츠 매핑', text: 'UFIT 과학 수업 5~10개를 선정하고 핵심 시각 자료를 매핑.' },
        { phase: 'Phase 2', title: '촉각 변환 샘플', text: '촉각 + 음성 + 자막 패키지를 제작하고 검토.' },
        { phase: 'Phase 3', title: '수업 시뮬레이션', text: '실제 DotPad 하드웨어로 전체 흐름을 처음부터 끝까지 실행.' },
        { phase: 'Phase 4', title: '교사 / 학생 피드백', text: '소규모 그룹에서 사용성·이해 데이터를 수집.' },
        { phase: 'Phase 5', title: '브라질 파일럿 런칭', text: '9월 UFIT과 함께 PoC 파일럿을 시작.' },
      ],
    },
    final: {
      title: 'UFIT 과학 콘텐츠를 접근 가능한 학습 경험으로 확장할 준비가 되어 있습니다',
      sub: '다음 단계는 실제 UFIT 수업 5~10개 샘플에서 촉각 품질, 교사 검토 흐름, 학생 이해를 함께 검증하는 것입니다.',
      primary: 'PoC 시뮬레이션 보기',
      secondary: '파트너 연동 방식',
      footerLeft: 'UFIT × Dot Inc. · 장벽 없는 과학',
      footerRight: '프로토타입 · 파트너 검토 준비 완료',
    },
  },
} as const

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Landing() {
  const [lang, setLang] = useState<Lang>('en')
  const t = copy[lang]

  return (
    <div className="dl-page" lang={lang}>
      <nav className="dl-nav" aria-label="Primary">
        <div className="dl-container dl-nav-inner">
          <a className="dl-brand" href="#top" onClick={(e) => { e.preventDefault(); scrollTo('top') }}>
            <span className="dl-mark" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i} />)}</span>
            <span>
              <span className="dl-brand-name">Dot Lens</span>
              <span className="dl-brand-sub">{lang === 'en' ? 'for UFIT science accessibility' : 'UFIT 과학 접근성'}</span>
            </span>
          </a>

          <div className="dl-nav-links">
            <a href="#problem" onClick={(e) => { e.preventDefault(); scrollTo('problem') }}>{t.nav.problem}</a>
            <a href="#solution" onClick={(e) => { e.preventDefault(); scrollTo('solution') }}>{t.nav.solution}</a>
            <a href="#flow" onClick={(e) => { e.preventDefault(); scrollTo('flow') }}>{t.nav.flow}</a>
            <a href="#simulation" onClick={(e) => { e.preventDefault(); scrollTo('simulation') }}>{t.nav.sim}</a>
            <a href="#partner" onClick={(e) => { e.preventDefault(); scrollTo('partner') }}>{t.nav.partner}</a>
          </div>

          <div className="dl-nav-right">
            <div className="dl-lang" role="group" aria-label="Language">
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>EN</button>
              <button className={lang === 'ko' ? 'active' : ''} onClick={() => setLang('ko')} aria-pressed={lang === 'ko'}>KO</button>
            </div>
            <button className="ds-btn ds-btn--primary ds-btn--sm" onClick={() => scrollTo('simulation')}>
              {t.nav.cta}<ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="dl-hero" id="top">
        <div className="dl-container dl-hero-grid">
          <div>
            <span className="ds-badge">{t.hero.badge}</span>
            <h1>
              {t.hero.title1}<span className="accent">{t.hero.titleAccent}</span>{t.hero.title2}
            </h1>
            <p className="dl-hero-sub">{t.hero.sub}</p>
            <div className="dl-hero-cta">
              <button className="ds-btn ds-btn--primary" onClick={() => scrollTo('simulation')}>
                {t.hero.primary}<ArrowRight size={18} />
              </button>
              <button className="ds-btn ds-btn--secondary" onClick={() => scrollTo('partner')}>
                {t.hero.secondary}
              </button>
            </div>
            <p className="dl-hero-note"><Layers size={15} color="var(--ds-primary-700)" />{t.hero.note}</p>
            <div className="dl-hero-chips">
              {t.hero.chips.map((c) => <span key={c} className="ds-badge ds-badge--neutral">{c}</span>)}
            </div>
          </div>

          {/* Signature: accessibility layer over the UFIT lesson */}
          <div className="dl-layerstack" aria-hidden="true">
            <div className="dl-screen">
              <div className="dl-screen-bar">
                <i /><i /><i />
                <small>{t.hero.screenTag}</small>
              </div>
              <div className="dl-screen-body">
                <div className="dl-ufit-row">
                  <span className="dl-ufit-logo">UFIT <span>educação</span></span>
                  <span className="dl-ufit-tag">Ciências · Unidade 02</span>
                </div>
                <div className="dl-ufit-figure">
                  <PlantGlyph />
                </div>
                <div className="dl-lens-layer">
                  <span className="dl-lens-layer-top"><Layers size={13} />{t.hero.lensLabel}</span>
                  <div className="dl-lens-outs">
                    {t.hero.outs.map((o) => (
                      <div className="dl-lens-out" key={o.label}>
                        <span className="ds-icon-chip" style={{ width: 30, height: 30 }}>{o.icon}</span>
                        <span>{o.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="dl-float-card">
              <div className="row">
                <span className="ds-icon-chip ds-icon-chip--lavender" style={{ width: 30, height: 30 }}><Users size={16} /></span>
                <strong>{t.hero.floatTitle}</strong>
              </div>
              <p>{t.hero.floatText}</p>
            </div>
          </div>
        </div>
      </header>

      {/* PROBLEM */}
      <section className="ds-section" id="problem">
        <div className="dl-container">
          <div className="ds-section-head">
            <span className="ds-eyebrow">{t.problem.eyebrow}</span>
            <h2 className="ds-h2">{t.problem.title}</h2>
            <p className="ds-lead">{t.problem.lead}</p>
          </div>
          <div className="dl-grid-3">
            {t.problem.cards.map((c) => (
              <article className="ds-card" key={c.title}>
                <span className="ds-icon-chip">{c.icon}</span>
                <h3 className="ds-card-title" style={{ marginTop: 14 }}>{c.title}</h3>
                <p className="ds-card-text">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="ds-section ds-section--wash" id="solution">
        <div className="dl-container">
          <div className="ds-section-head">
            <span className="ds-eyebrow">{t.solution.eyebrow}</span>
            <h2 className="ds-h2">{t.solution.title}</h2>
            <p className="ds-lead">{t.solution.lead}</p>
          </div>
          <div className="dl-flowline">
            {t.solution.flow.map((f, i) => (
              <Fragmenty key={f.title} last={i === t.solution.flow.length - 1}>
                <div className="dl-flownode">
                  <span className="ds-icon-chip">{f.icon}</span>
                  <h4>{f.title}</h4>
                  <p>{f.text}</p>
                </div>
              </Fragmenty>
            ))}
          </div>
        </div>
      </section>

      {/* CLASSROOM FLOW */}
      <section className="ds-section" id="flow">
        <div className="dl-container">
          <div className="ds-section-head">
            <span className="ds-eyebrow">{t.flow.eyebrow}</span>
            <h2 className="ds-h2">{t.flow.title}</h2>
            <p className="ds-lead">{t.flow.lead}</p>
          </div>
          <div className="dl-grid-3">
            {t.flow.steps.map((s, i) => (
              <article className="ds-step-card" key={s.title}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="ds-step-num">{i + 1}</span>
                  <span className="ds-step-role">{s.role}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* POC SIMULATION (embeds the working simulation) */}
      <section className="ds-section ds-section--subtle" id="simulation">
        <div className="dl-container">
          <div className="ds-section-head">
            <span className="ds-eyebrow">{t.sim.eyebrow}</span>
            <h2 className="ds-h2">{t.sim.title}</h2>
            <p className="ds-lead">{t.sim.lead}</p>
          </div>

          <div className="ds-sim-panel">
            <div className="ds-sim-head">
              <span className="label"><MonitorPlay size={18} color="var(--ds-primary-700)" />{t.sim.panelLabel}</span>
              <span className="note">{t.sim.panelNote}</span>
            </div>
            <div className="ds-sim-body">
              <p className="ds-eyebrow" style={{ marginBottom: 12 }}>{t.sim.compareTitle}</p>
              <div className="dl-compare">
                {t.sim.compare.map((c) => (
                  <div className="dl-compare-tile" key={c.cap}>
                    <span className="cap">{c.icon}{c.cap}</span>
                    <p>{c.text}</p>
                  </div>
                ))}
              </div>
              <Simulation lang={lang} />
              <div style={{ marginTop: 18 }}>
                <p className="ds-eyebrow" style={{ marginBottom: 10 }}>{t.sim.sampleTitle}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {t.sim.samples.map((s) => <span key={s} className="ds-badge ds-badge--neutral">{s}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACCESSIBILITY VALUE */}
      <section className="ds-section" id="value">
        <div className="dl-container">
          <div className="ds-section-head">
            <span className="ds-eyebrow">{t.value.eyebrow}</span>
            <h2 className="ds-h2">{t.value.title}</h2>
            <p className="ds-lead">{t.value.lead}</p>
          </div>
          <div className="dl-grid-4">
            {t.value.cards.map((c) => (
              <article className="dl-aud-card" key={c.title}>
                <span className="ds-icon-chip">{c.icon}</span>
                <h3 className="ds-card-title">{c.title}</h3>
                <ul>
                  {c.items.map((it) => (
                    <li key={it}><CheckCircle2 size={15} />{it}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNER INTEGRATION */}
      <section className="ds-section ds-section--wash" id="partner">
        <div className="dl-container">
          <div className="ds-section-head">
            <span className="ds-eyebrow">{t.partner.eyebrow}</span>
            <h2 className="ds-h2">{t.partner.title}</h2>
            <p className="ds-lead">{t.partner.lead}</p>
          </div>
          <div className="dl-grid-3">
            {t.partner.lanes.map((l) => (
              <article className="dl-int-card" key={l.tag}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="ds-icon-chip">{l.icon}</span>
                  <span className="ds-badge">{l.tag}</span>
                </div>
                <h3 className="ds-card-title" style={{ marginTop: 4 }}>{l.title}</h3>
                <p className="ds-card-text">{l.text}</p>
                <code>{l.code}</code>
              </article>
            ))}
          </div>

          <h3 className="ds-card-title" style={{ marginTop: 36 }}>{t.partner.expandTitle}</h3>
          <div className="dl-expand">
            {t.partner.expand.map((e) => (
              <div className="dl-expand-row" key={e.n}>
                <span className="n">{e.n}</span>
                <div>
                  <strong>{e.title}</strong>
                  <p>{e.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILOT ROADMAP */}
      <section className="ds-section" id="roadmap">
        <div className="dl-container">
          <div className="ds-section-head">
            <span className="ds-eyebrow">{t.roadmap.eyebrow}</span>
            <h2 className="ds-h2">{t.roadmap.title}</h2>
            <p className="ds-lead">{t.roadmap.lead}</p>
          </div>
          <div className="dl-road">
            {t.roadmap.phases.map((p, i) => (
              <div className={`dl-road-step ${i === t.roadmap.phases.length - 1 ? 'target' : ''}`} key={p.phase}>
                <span className="dl-road-dot">{i === t.roadmap.phases.length - 1 ? <Check size={15} strokeWidth={3} /> : i + 1}</span>
                <div className="dl-road-body">
                  <span className="dl-road-phase">{p.phase}</span>
                  <h4>{p.title}</h4>
                  <p>{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="ds-section dl-final">
        <div className="dl-container">
          <div className="dl-final-card">
            <span className="ds-badge ds-badge--lavender">Partner PoC review ready</span>
            <h2 style={{ marginTop: 16 }}>{t.final.title}</h2>
            <p>{t.final.sub}</p>
            <div className="dl-hero-cta">
              <button className="ds-btn ds-btn--primary" onClick={() => scrollTo('simulation')}>
                {t.final.primary}<ArrowRight size={18} />
              </button>
              <button className="ds-btn ds-btn--secondary" onClick={() => scrollTo('partner')}>
                {t.final.secondary}
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="dl-footer">
        <div className="dl-container dl-footer-inner">
          <span>{t.final.footerLeft}</span>
          <span>{t.final.footerRight}</span>
        </div>
      </footer>
    </div>
  )
}

/* Small helper that renders a flow node followed by an arrow (except last). */
function Fragmenty({ children, last }: { children: ReactNode; last: boolean }) {
  return (
    <>
      {children}
      {!last && <div className="dl-flowarrow" aria-hidden="true"><ChevronRight size={20} /></div>}
    </>
  )
}

/* Simple plant glyph for the hero mockup (decorative). */
function PlantGlyph() {
  return (
    <svg width="150" height="96" viewBox="0 0 150 96" fill="none" aria-hidden="true">
      <line x1="75" y1="34" x2="75" y2="78" stroke="var(--ds-primary-700)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M75 50 C62 44 54 50 50 60" stroke="var(--ds-primary)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M75 58 C88 52 96 58 100 68" stroke="var(--ds-primary)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="75" cy="28" r="9" fill="none" stroke="var(--ds-lavender)" strokeWidth="2.4" />
      <path d="M75 78 C70 84 64 86 58 88 M75 78 C80 84 86 86 92 88" stroke="var(--ds-ink-faint)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="40" y1="78" x2="110" y2="78" stroke="var(--ds-line-strong)" strokeWidth="1.5" strokeDasharray="4 4" />
    </svg>
  )
}
