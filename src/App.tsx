import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  AudioLines,
  BookOpen,
  Captions,
  Check,
  ChevronRight,
  CircleDot,
  Cloud,
  CloudOff,
  CloudRain,
  Database,
  Eye,
  FileText,
  Flower2,
  Headphones,
  Image as ImageIcon,
  Library,
  MonitorPlay,
  Orbit,
  Pause,
  Play,
  Radio,
  RefreshCw,
  ScanLine,
  Sparkles,
  Sun,
  Type,
  Volume2,
  Waves,
} from 'lucide-react'
import { demoSteps, lessons, type Lesson, type LessonId } from './data'
import { useSupabaseTracking, type SyncState } from './hooks/useSupabaseTracking'
import RecordedLecture from './RecordedLecture'
import DotPadConnect from './components/DotPadConnect'
import { useDotPad, type DotPadController } from './lib/dotpad/useDotPad'
import { buildLiveMatrix, countRaised, matrixToDots } from './lib/dotpad/sceneMatrix'

type ExperienceMode = 'live' | 'recorded'

const pipeline = [
  { label: 'Image recognition', detail: 'Scene + objects', Icon: ImageIcon },
  { label: 'Text extraction', detail: 'Portuguese OCR', Icon: Type },
  { label: 'Quiz analysis', detail: 'Intent + answers', Icon: ScanLine },
  { label: 'Tactile generation', detail: '60 × 40 matrix', Icon: CircleDot },
  { label: 'Caption generation', detail: 'Live PT-BR', Icon: Captions },
]

function App() {
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>('live')
  const [lessonId, setLessonId] = useState<LessonId>('plant')
  const [activeStep, setActiveStep] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [activeFunction, setActiveFunction] = useState(0)
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID())
  const [recordedSessionId] = useState(() => crypto.randomUUID())
  const quizStartedAt = useRef<number | null>(null)
  const initializedSessions = useRef(new Set<string>())
  const dotPad = useDotPad()
  const {
    isConfigured,
    syncState,
    pendingCount,
    syncedCount,
    lastError,
    track,
    retry,
  } = useSupabaseTracking()

  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0]

  useEffect(() => {
    if (initializedSessions.current.has(sessionId)) return
    initializedSessions.current.add(sessionId)

    void track({
      sessionId,
      lessonId: lesson.id,
      eventType: 'session_started',
      demoStep: 1,
      payload: {
        browser_locale: navigator.language,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        lesson_title: lesson.title,
      },
    })
  }, [lesson.id, lesson.title, sessionId, track])

  const changeLesson = (id: LessonId) => {
    const nextLesson = lessons.find((item) => item.id === id) ?? lessons[0]
    const nextSessionId = crypto.randomUUID()

    setLessonId(id)
    setSessionId(nextSessionId)
    setActiveStep(1)
    setSelectedAnswer(null)
    setIsPlaying(false)
    quizStartedAt.current = null

    void track({
      sessionId: nextSessionId,
      lessonId: nextLesson.id,
      eventType: 'lesson_selected',
      demoStep: 1,
      payload: {
        lesson_title: nextLesson.title,
        previous_lesson_id: lesson.id,
      },
    })
  }

  const changeExperienceMode = (mode: ExperienceMode) => {
    setExperienceMode(mode)

    if (mode === 'recorded') {
      void track({
        sessionId: recordedSessionId,
        lessonId: 'plant',
        eventType: 'recorded_mode_opened',
        demoStep: 7,
        payload: {
          lecture_id: 'plant-structure-recorded',
          title: 'Plant Structure - Grade 5 Science',
          source_file: 'Inclusive Education Strategies in Brazil.mp4',
          accessibility_engine: 'Dot Lens',
        },
      })
    }
  }

  const trackRecordedEvent = (
    eventType: Parameters<typeof track>[0]['eventType'],
    demoStep: number,
    payload: Record<string, unknown> = {},
  ) => {
    void track({
      sessionId: recordedSessionId,
      lessonId: 'plant',
      eventType,
      demoStep,
      payload,
    })
  }

  const selectStep = (step: number) => {
    setActiveStep(step)
    if (step !== 5) setSelectedAnswer(null)
    if (step === 5) quizStartedAt.current = Date.now()

    const eventByStep = {
      1: {
        eventType: 'lesson_shown' as const,
        payload: {
          title: lesson.title,
          board_prompt: lesson.boardPrompt,
          grade: lesson.grade,
        },
      },
      2: {
        eventType: 'recognition_completed' as const,
        payload: {
          confidence: Number.parseFloat(lesson.detected.confidence),
          detected_objects: lesson.detected.objects,
          text_blocks: lesson.detected.textBlocks,
          quiz_items: 1,
          processing_ms: 34,
          model_name: 'dot-lens-multimodal-poc',
        },
      },
      3: {
        eventType: 'tactile_generated' as const,
        payload: {
          locale: 'en',
          generation_ms: 118,
          matrix: { columns: 60, rows: 40, pins: 2400 },
          tactile_labels: lesson.tactileLabels,
          audio_description: lesson.voiceDescription,
        },
      },
      4: {
        eventType: 'captions_enabled' as const,
        payload: {
          locale: 'pt-BR',
          generation_ms: 72,
          caption: lesson.caption,
          summary: lesson.summary,
        },
      },
      5: {
        eventType: 'quiz_started' as const,
        payload: {
          locale: 'pt-BR',
          generation_ms: 46,
          question: lesson.quiz.question,
          options: lesson.quiz.options,
          correct_index: lesson.quiz.answer,
        },
      },
      6: {
        eventType: 'library_saved' as const,
        payload: {
          title: lesson.library.asset,
          version: lesson.library.version,
          grade: lesson.grade,
          locale: 'pt-BR',
          tactile_pages: lesson.library.pages,
          tags: lesson.library.tags,
          source_lesson: lesson.title,
          package_contents: ['tactile_graphic', 'audio_description', 'captions', 'summary', 'quiz'],
        },
      },
    }

    const event = eventByStep[step as keyof typeof eventByStep]
    void track({
      sessionId,
      lessonId: lesson.id,
      eventType: event.eventType,
      demoStep: step,
      payload: event.payload,
    })
  }

  const toggleAudio = () => {
    const nextPlaying = !isPlaying
    setIsPlaying(nextPlaying)

    if (nextPlaying) {
      void track({
        sessionId,
        lessonId: lesson.id,
        eventType: 'audio_played',
        demoStep: Math.max(activeStep, 3),
        payload: {
          description: lesson.voiceDescription,
          language: 'en',
        },
      })
    }
  }

  const selectFunction = (index: number) => {
    setActiveFunction(index)
    void track({
      sessionId,
      lessonId: lesson.id,
      eventType: 'function_key_pressed',
      demoStep: Math.max(activeStep, 3),
      payload: {
        function_key: `F${index + 1}`,
        action: ['explore', 'labels', 'repeat', 'quiz'][index],
      },
    })
  }

  const sendLiveScene = () => {
    const matrix = buildLiveMatrix(lesson.id, true)
    const delivered = dotPad.sendMatrix(matrix)
    void track({
      sessionId,
      lessonId: lesson.id,
      eventType: 'tactile_generated',
      demoStep: Math.max(activeStep, 3),
      payload: {
        locale: 'en',
        matrix: { columns: 60, rows: 40, pins: 2400 },
        raised_pins: countRaised(matrix),
        delivered_to_hardware: delivered,
        device_name: delivered ? dotPad.deviceName : null,
        transport: delivered ? dotPad.transport : 'preview_only',
      },
    })
  }

  const selectQuizAnswer = (index: number) => {
    setSelectedAnswer(index)
    void track({
      sessionId,
      lessonId: lesson.id,
      eventType: 'quiz_answered',
      demoStep: 5,
      payload: {
        question: lesson.quiz.question,
        options: lesson.quiz.options,
        selected_index: index,
        correct_index: lesson.quiz.answer,
        is_correct: index === lesson.quiz.answer,
        response_ms: quizStartedAt.current ? Date.now() - quizStartedAt.current : null,
      },
    })
  }

  return (
    <main className="app-shell" style={{ '--accent': lesson.accent, '--accent-soft': lesson.accentSoft } as React.CSSProperties}>
      <header className="topbar">
        <div className="brand-lockup">
          <DotMark />
          <div>
            <div className="brand-title">Dot Lens</div>
            <div className="brand-subtitle">for UFIT Science Accessibility</div>
          </div>
        </div>

        <div className="mode-toggle" role="tablist" aria-label="Accessibility experience mode">
          <button
            className={experienceMode === 'live' ? 'active' : ''}
            onClick={() => changeExperienceMode('live')}
            role="tab"
            aria-selected={experienceMode === 'live'}
          >
            <Radio size={14} /> Live Classroom
          </button>
          <button
            className={experienceMode === 'recorded' ? 'active' : ''}
            onClick={() => changeExperienceMode('recorded')}
            role="tab"
            aria-selected={experienceMode === 'recorded'}
          >
            <MonitorPlay size={14} /> Recorded Lecture
          </button>
        </div>

        <div className="top-actions">
          <SupabaseStatus
            configured={isConfigured}
            state={syncState}
            pendingCount={pendingCount}
            syncedCount={syncedCount}
            error={lastError}
            onRetry={() => void retry()}
          />
        </div>
      </header>

      {experienceMode === 'live' ? (
        <>
          <section className="opbar" aria-label="Lesson and demo controls">
            <div className="opbar-lesson" role="tablist" aria-label="Science lessons">
              {lessons.map((item) => (
                <button
                  key={item.id}
                  className={item.id === lessonId ? 'lesson-tab active' : 'lesson-tab'}
                  onClick={() => changeLesson(item.id)}
                  role="tab"
                  aria-selected={item.id === lessonId}
                >
                  <span>{item.index}</span>
                  {item.title}
                </button>
              ))}
            </div>

            <div className="opbar-steps" role="tablist" aria-label="Demo steps">
              {demoSteps.map((step) => (
                <button
                  key={step.number}
                  className={`step-chip ${activeStep === step.number ? 'active' : ''} ${activeStep > step.number ? 'done' : ''}`}
                  onClick={() => selectStep(step.number)}
                  aria-current={activeStep === step.number ? 'step' : undefined}
                  title={step.label}
                >
                  <span className="step-dot">
                    {activeStep > step.number ? <Check size={12} strokeWidth={3} /> : step.number}
                  </span>
                  <span className="step-chip-label">{step.short}</span>
                </button>
              ))}
            </div>

            <button
              className="next-step"
              onClick={() => selectStep(activeStep === 6 ? 1 : activeStep + 1)}
            >
              {activeStep === 6 ? 'Restart' : 'Next'}
              <ChevronRight size={15} />
            </button>
          </section>

          <PipelineStrip activeStep={activeStep} lesson={lesson} />
          <div className="workspace">
            <aside className="source-pane">
              <BoardPanel lesson={lesson} />
            </aside>
            <div className="focal-scroll">
              <FocalCanvas
                step={activeStep}
                lesson={lesson}
                isPlaying={isPlaying}
                onTogglePlaying={toggleAudio}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={selectQuizAnswer}
                activeFunction={activeFunction}
                onFunction={selectFunction}
                dotPad={dotPad}
                onSendScene={sendLiveScene}
              />
            </div>
          </div>
        </>
      ) : (
        <RecordedLecture
          sessionId={recordedSessionId}
          onTrack={trackRecordedEvent}
          dotPad={dotPad}
        />
      )}

      <footer className="footer-note">
        <span>
          Prototype environment · Mock AI recognition and DotPad SDK output ·
          {' '}{isConfigured ? `${syncedCount} events synced to Supabase` : `${pendingCount} events queued locally`}
        </span>
        <span>UFIT × Dot Inc. · Science without barriers</span>
      </footer>
    </main>
  )
}

function SupabaseStatus({
  configured,
  state,
  pendingCount,
  syncedCount,
  error,
  onRetry,
}: {
  configured: boolean
  state: SyncState
  pendingCount: number
  syncedCount: number
  error: string
  onRetry: () => void
}) {
  const label =
    state === 'setup_required'
      ? 'Supabase setup'
      : state === 'syncing'
        ? 'Syncing data'
        : state === 'error'
          ? 'Sync retry'
          : state === 'synced'
            ? 'Data synced'
            : 'Supabase ready'

  const Icon =
    state === 'setup_required'
      ? CloudOff
      : state === 'syncing'
        ? RefreshCw
        : state === 'error'
          ? CloudOff
          : state === 'synced'
            ? Cloud
            : Database

  return (
    <button
      className={`supabase-pill ${state}`}
      onClick={onRetry}
      title={error || (configured ? `${syncedCount} events synced` : 'Publishable key required')}
      type="button"
    >
      <Icon size={12} className={state === 'syncing' ? 'spin' : ''} />
      <span>{label}</span>
      {pendingCount > 0 && <strong>{pendingCount}</strong>}
    </button>
  )
}

function DotMark() {
  return (
    <div className="dot-mark" aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => <span key={index} />)}
    </div>
  )
}

function PanelTitle({
  number,
  eyebrow,
  title,
  icon,
}: {
  number: string
  eyebrow: string
  title: string
  icon: React.ReactNode
}) {
  return (
    <div className="panel-title">
      <div className="panel-number">{number}</div>
      <div className="panel-title-copy">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <div className="panel-icon">{icon}</div>
    </div>
  )
}

function BoardPanel({ lesson }: { lesson: Lesson }) {
  return (
    <section className="panel board-panel">
      <PanelTitle
        number="01"
        eyebrow="SOURCE CLASSROOM"
        title="UFIT Smart Board"
        icon={<Eye size={18} />}
      />
      <div className="smartboard-frame">
        <div className="board-topline">
          <div className="ufit-logo">UFIT <span>educação</span></div>
          <div className="board-course"><BookOpen size={13} /> Ciências · {lesson.grade}</div>
          <div className="board-time">09:42</div>
        </div>
        <div className="board-content">
          <div className="board-copy">
            <span className="board-eyebrow">{lesson.boardEyebrow}</span>
            <h3>{lesson.subtitle}</h3>
            <p>{lesson.boardPrompt}</p>
            <div className="teacher-note">
              <span className="teacher-avatar">MC</span>
              <span><small>Prof. Marina Costa</small>Observe o diagrama</span>
            </div>
          </div>
          <div className="science-visual">
            <LessonVisual lesson={lesson} />
          </div>
        </div>
        <div className="board-footer">
          <span><Play size={12} fill="currentColor" /> {lesson.duration}</span>
          <div className="page-dots"><i /><i className="active" /><i /></div>
          <span>Atividade 2 de 4</span>
        </div>
        <div className="lens-corners" aria-hidden="true"><i /><i /><i /><i /></div>
      </div>
      <div className="source-meta">
        <span><Activity size={13} /> HDMI classroom feed</span>
        <span className="source-ready"><i /> Source detected</span>
        <strong>1920 × 1080</strong>
      </div>
    </section>
  )
}

function LessonVisual({ lesson }: { lesson: Lesson }) {
  if (lesson.id === 'solar') return <SolarVisual />
  if (lesson.id === 'water') return <WaterVisual />
  return <PlantVisual />
}

function PlantVisual() {
  return (
    <svg viewBox="0 0 380 260" role="img" aria-label="Plant structure diagram">
      <defs>
        <linearGradient id="plantBg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f2fbf6" />
          <stop offset="1" stopColor="#dff4e8" />
        </linearGradient>
        <linearGradient id="leafFill" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#63d59a" />
          <stop offset="1" stopColor="#239a67" />
        </linearGradient>
      </defs>
      <rect width="380" height="260" rx="22" fill="url(#plantBg)" />
      <circle cx="58" cy="48" r="22" fill="#fff2b3" />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1="58" y1="17" x2="58" y2="8" stroke="#e5b93f" strokeWidth="3" transform={`rotate(${i * 45} 58 48)`} />
      ))}
      <path d="M0 194 C74 175 126 202 190 190 C260 176 326 183 380 171 V260 H0Z" fill="#8a624d" />
      <path d="M0 190 C70 171 132 198 194 186 C258 173 323 179 380 168" fill="none" stroke="#b27a58" strokeWidth="10" />
      <path d="M194 194 C192 159 194 123 191 86" stroke="#3c9d66" strokeWidth="9" strokeLinecap="round" />
      <path d="M192 144 C162 111 133 104 111 117 C131 149 160 159 192 144Z" fill="url(#leafFill)" />
      <path d="M193 125 C224 91 255 88 278 104 C254 137 225 145 193 125Z" fill="url(#leafFill)" />
      <path d="M193 188 C176 208 170 229 163 247 M192 189 C207 211 219 229 225 250 M190 194 C184 215 185 234 186 254 M183 207 L148 228 M211 219 L245 235" stroke="#e4c39d" strokeWidth="4" strokeLinecap="round" fill="none" />
      <g transform="translate(191 72)">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse key={angle} rx="15" ry="30" fill="#f66f7f" transform={`rotate(${angle}) translate(0 -21)`} />
        ))}
        <circle r="16" fill="#ffd45f" />
      </g>
      <g className="svg-label">
        <line x1="217" y1="53" x2="310" y2="40" />
        <rect x="308" y="25" width="58" height="28" rx="8" />
        <text x="337" y="43">FLOR</text>
        <line x1="265" y1="116" x2="326" y2="111" />
        <rect x="314" y="96" width="54" height="28" rx="8" />
        <text x="341" y="114">FOLHA</text>
        <line x1="185" y1="151" x2="104" y2="161" />
        <rect x="41" y="147" width="70" height="28" rx="8" />
        <text x="76" y="165">CAULE</text>
        <line x1="176" y1="225" x2="91" y2="229" />
        <rect x="28" y="215" width="70" height="28" rx="8" />
        <text x="63" y="233">RAÍZES</text>
      </g>
    </svg>
  )
}

function SolarVisual() {
  const planets = [
    { x: 127, y: 130, r: 5, c: '#b7a692' },
    { x: 163, y: 84, r: 7, c: '#e3a65f' },
    { x: 215, y: 156, r: 8, c: '#3f91df' },
    { x: 270, y: 77, r: 6, c: '#d9664e' },
    { x: 318, y: 175, r: 14, c: '#dbb37e' },
  ]
  return (
    <svg viewBox="0 0 380 260" role="img" aria-label="Solar system orbit diagram">
      <defs>
        <radialGradient id="space" cx=".3" cy=".4">
          <stop stopColor="#253260" />
          <stop offset="1" stopColor="#10152d" />
        </radialGradient>
        <radialGradient id="sunFill">
          <stop stopColor="#fff3a6" />
          <stop offset=".55" stopColor="#ffc84c" />
          <stop offset="1" stopColor="#f28b35" />
        </radialGradient>
      </defs>
      <rect width="380" height="260" rx="22" fill="url(#space)" />
      {[
        [38, 41], [92, 27], [151, 43], [206, 22], [260, 35], [331, 28],
        [346, 88], [301, 115], [185, 205], [92, 219], [270, 225], [351, 213],
      ].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="#d8e0ff" opacity=".8" />)}
      <circle cx="55" cy="132" r="40" fill="#f39b38" opacity=".13" />
      <circle cx="55" cy="132" r="28" fill="url(#sunFill)" />
      {[68, 105, 145, 188, 235, 282].map((rx, i) => (
        <ellipse key={rx} cx="58" cy="132" rx={rx} ry={46 + i * 14} fill="none" stroke="#91a0d4" strokeWidth="1.2" opacity=".48" />
      ))}
      {planets.map((planet, i) => (
        <g key={planet.x}>
          {i === 2 && <circle cx={planet.x} cy={planet.y} r="14" fill="none" stroke="#75e0ff" strokeWidth="1.5" strokeDasharray="3 3" />}
          <circle cx={planet.x} cy={planet.y} r={planet.r} fill={planet.c} />
          {i === 4 && <ellipse cx={planet.x} cy={planet.y} rx="22" ry="5" fill="none" stroke="#d9c8aa" strokeWidth="3" transform={`rotate(-12 ${planet.x} ${planet.y})`} />}
        </g>
      ))}
      <g>
        <rect x="200" y="174" width="73" height="27" rx="8" fill="#fff" />
        <text x="236" y="192" fill="#1d2c55" textAnchor="middle" fontSize="10" fontWeight="800">TERRA · 3º</text>
        <line x1="216" y1="174" x2="215" y2="165" stroke="#fff" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

function WaterVisual() {
  return (
    <svg viewBox="0 0 380 260" role="img" aria-label="Water cycle diagram">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#dff4ff" />
          <stop offset="1" stopColor="#f4fbff" />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#49b9ec" />
          <stop offset="1" stopColor="#267fc0" />
        </linearGradient>
      </defs>
      <rect width="380" height="260" rx="22" fill="url(#sky)" />
      <circle cx="60" cy="53" r="25" fill="#ffd85c" />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1="60" y1="19" x2="60" y2="9" stroke="#f2bd2f" strokeWidth="3" transform={`rotate(${i * 45} 60 53)`} />
      ))}
      <path d="M175 200 L267 80 L356 200Z" fill="#75938c" />
      <path d="M231 126 L267 80 L303 128 L282 119 L269 136 L253 117Z" fill="#f9fcff" />
      <path d="M0 194 C52 183 94 204 143 193 C196 180 236 201 282 190 C322 181 350 190 380 185 V260 H0Z" fill="url(#sea)" />
      <path d="M0 203 C43 191 91 211 135 201 C180 191 225 211 274 199 C317 188 354 202 380 195" fill="none" stroke="#8bdcff" strokeWidth="3" />
      <g fill="#fff" stroke="#d6e8f1" strokeWidth="1">
        <circle cx="215" cy="62" r="23" />
        <circle cx="242" cy="54" r="28" />
        <circle cx="270" cy="65" r="21" />
        <rect x="206" y="63" width="75" height="20" rx="10" />
      </g>
      {[218, 238, 258, 275].map((x, i) => (
        <line key={x} x1={x} y1="88" x2={x - 8} y2={111 + (i % 2) * 7} stroke="#3fa9df" strokeWidth="3" strokeLinecap="round" />
      ))}
      <path d="M107 183 C88 153 94 126 116 104" fill="none" stroke="#2b94cf" strokeWidth="3" strokeDasharray="6 5" markerEnd="url(#arrow)" />
      <path d="M287 136 C320 153 324 174 306 192" fill="none" stroke="#2b94cf" strokeWidth="3" strokeDasharray="6 5" />
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10Z" fill="#2b94cf" />
        </marker>
      </defs>
      <g className="water-labels">
        <rect x="71" y="111" width="84" height="24" rx="7" />
        <text x="113" y="127">EVAPORAÇÃO</text>
        <rect x="206" y="21" width="88" height="24" rx="7" />
        <text x="250" y="37">CONDENSAÇÃO</text>
        <rect x="274" y="106" width="87" height="24" rx="7" />
        <text x="317" y="122">PRECIPITAÇÃO</text>
      </g>
    </svg>
  )
}

function PipelineStrip({ activeStep, lesson }: { activeStep: number; lesson: Lesson }) {
  const progressByStep = activeStep === 1 ? 0 : activeStep === 2 ? 3 : activeStep === 3 ? 4 : 5
  const isRunning = activeStep > 1

  return (
    <div className="pipeline-strip" aria-label="AI pipeline status">
      <span className={`pstrip-engine ${isRunning ? 'running' : ''}`}>
        <ScanLine size={12} />
        {isRunning ? 'RUNNING' : 'READY'}
      </span>
      <div className="pstrip-steps">
        {pipeline.map(({ label, Icon }, index) => {
          const isComplete = index < progressByStep
          const isCurrent = index === progressByStep && isRunning
          return (
            <div key={label} className={`pstrip-step ${isComplete ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
              {index > 0 && <div className="pstrip-connector" />}
              <div className="pstrip-node">
                {isComplete ? <Check size={10} strokeWidth={3.5} /> : <Icon size={11} />}
              </div>
              <span className="pstrip-label">{label}</span>
            </div>
          )
        })}
      </div>
      {isRunning && (
        <span className="pstrip-result">
          {lesson.detected.confidence} · {lesson.detected.objects.length} obj
        </span>
      )}
    </div>
  )
}

type FocalProps = {
  step: number
  lesson: Lesson
  isPlaying: boolean
  onTogglePlaying: () => void
  selectedAnswer: number | null
  onSelectAnswer: (index: number) => void
  activeFunction: number
  onFunction: (index: number) => void
  dotPad: DotPadController
  onSendScene: () => void
}

function FocalCanvas(props: FocalProps) {
  const [outputTab, setOutputTab] = useState<'blind' | 'deaf'>('blind')

  useEffect(() => {
    if (props.step === 3) setOutputTab('blind')
    if (props.step === 4) setOutputTab('deaf')
  }, [props.step])

  if (props.step === 1) return <SourceReadyCanvas lesson={props.lesson} />
  if (props.step === 2) return <PipelineDetailCanvas lesson={props.lesson} />
  if (props.step === 6) return <LibraryPanel lesson={props.lesson} highlighted={false} saved />

  return (
    <div className="focal-output">
      <div className="output-tabs" role="tablist" aria-label="Accessibility output mode">
        <button
          role="tab"
          aria-selected={outputTab === 'blind'}
          className={outputTab === 'blind' ? 'active' : ''}
          onClick={() => setOutputTab('blind')}
        >
          <CircleDot size={14} />
          DotPad · Blind / Low Vision
          <span className={props.dotPad.status === 'connected' ? 'tab-badge live' : 'tab-badge'}>
            {props.dotPad.status === 'connected' ? 'LIVE' : 'PREVIEW'}
          </span>
        </button>
        <button
          role="tab"
          aria-selected={outputTab === 'deaf'}
          className={outputTab === 'deaf' ? 'active' : ''}
          onClick={() => setOutputTab('deaf')}
        >
          <Captions size={14} />
          Captions · Deaf / HoH
          <span className={props.step >= 4 ? 'tab-badge live' : 'tab-badge'}>
            {props.step >= 4 ? 'ON' : 'STANDBY'}
          </span>
        </button>
      </div>
      {outputTab === 'blind' ? (
        <BlindCanvas
          lesson={props.lesson}
          activeStep={props.step}
          isPlaying={props.isPlaying}
          onTogglePlaying={props.onTogglePlaying}
          activeFunction={props.activeFunction}
          onFunction={props.onFunction}
          dotPad={props.dotPad}
          onSendScene={props.onSendScene}
        />
      ) : (
        <DeafCanvas
          lesson={props.lesson}
          activeStep={props.step}
          selectedAnswer={props.selectedAnswer}
          onSelectAnswer={props.onSelectAnswer}
        />
      )}
    </div>
  )
}

function SourceReadyCanvas({ lesson }: { lesson: Lesson }) {
  return (
    <div className="focal-ready">
      <div className="focal-ready-icon"><Sparkles size={28} /></div>
      <h3>Board source captured</h3>
      <p className="focal-ready-desc">{lesson.boardPrompt}</p>
      <p className="focal-ready-hint">Click <strong>Next →</strong> to run Dot Lens AI on this board.</p>
      <div className="focal-ready-features">
        {pipeline.map(({ label, Icon }) => (
          <div key={label} className="focal-feature">
            <Icon size={14} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PipelineDetailCanvas({ lesson }: { lesson: Lesson }) {
  return (
    <div className="focal-pipeline">
      <div className="ai-status">
        <div className="ai-orb">
          <ScanLine size={22} />
          <span />
        </div>
        <div>
          <small>DOT LENS MODEL</small>
          <strong>Multimodal analysis active</strong>
        </div>
        <span className="model-state active">RUNNING</span>
      </div>
      <div className="pipeline-flow">
        {pipeline.map(({ label, detail, Icon }, index) => {
          const isComplete = index < 3
          const isCurrent = index === 2
          return (
            <div key={label} className={`pipeline-row ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''}`}>
              <div className="pipeline-node">
                {isComplete ? <Check size={15} strokeWidth={3} /> : <Icon size={16} />}
              </div>
              <div className="pipeline-copy">
                <strong>{label}</strong>
                <span>{detail}</span>
              </div>
              <div className="pipeline-result">
                {index === 0 && `${lesson.detected.objects.length} objects`}
                {index === 1 && `${lesson.detected.textBlocks} blocks`}
                {index === 2 && '1 quiz'}
                {index > 2 && <span>—</span>}
              </div>
              {index < pipeline.length - 1 && <div className="flow-line"><span /></div>}
            </div>
          )
        })}
      </div>
      <div className="recognition-card">
        <div className="recognition-head">
          <span><ScanLine size={14} /> Recognition output</span>
          <strong>{lesson.detected.confidence}</strong>
        </div>
        <div className="detected-tags">
          {lesson.detected.objects.map((object) => (
            <span key={object}>{object}</span>
          ))}
        </div>
        <div className="signal-bars">
          {[72, 91, 84, 96, 77, 89, 94, 86, 98, 81, 93, 88].map((height, index) => (
            <i key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
      <div className="privacy-note">
        <Eye size={13} />
        <span>On-device processing</span>
        <strong>No student data retained</strong>
      </div>
    </div>
  )
}

type BlindCanvasProps = {
  lesson: Lesson
  activeStep: number
  isPlaying: boolean
  onTogglePlaying: () => void
  activeFunction: number
  onFunction: (index: number) => void
  dotPad: DotPadController
  onSendScene: () => void
}

function BlindCanvas(props: BlindCanvasProps) {
  return (
    <div className="blind-canvas">
      <div className="dotpad-stage">
        <DotPadPreview lesson={props.lesson} ready />
        <div className="dotpad-stage-actions">
          <DotPadConnect dotPad={props.dotPad} />
          <button
            type="button"
            className="dotpad-send-btn"
            disabled={props.dotPad.status !== 'connected'}
            onClick={props.onSendScene}
          >
            <CircleDot size={13} />
            {props.dotPad.status === 'connected' ? 'Send scene to DotPad' : 'Connect a DotPad to send'}
          </button>
        </div>
      </div>
      <div className="audio-column">
        <div className="audio-card">
          <div className="audio-head">
            <span><Headphones size={14} /> Audio description</span>
            <small>EN · 0:18</small>
          </div>
          <p>{props.lesson.voiceDescription}</p>
          <div className="audio-player">
            <button onClick={props.onTogglePlaying} aria-label="Play audio description">
              {props.isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
            </button>
            <div className="audio-wave">
              {[35, 62, 44, 76, 52, 88, 67, 48, 79, 58, 92, 63, 42, 72, 54].map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <Volume2 size={13} />
          </div>
        </div>
        <div className="function-keys">
          {['Explore', 'Labels', 'Repeat', 'Quiz'].map((label, index) => (
            <button
              key={label}
              className={props.activeFunction === index ? 'active' : ''}
              onClick={() => props.onFunction(index)}
            >
              <span>F{index + 1}</span>{label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function DeafCanvas({
  lesson,
  activeStep,
  selectedAnswer,
  onSelectAnswer,
}: {
  lesson: Lesson
  activeStep: number
  selectedAnswer: number | null
  onSelectAnswer: (index: number) => void
}) {
  return (
    <div className="deaf-canvas">
      <div className="caption-card">
        <div className="caption-meta">
          <span><AudioLines size={13} /> LIVE TRANSCRIPT</span>
          <small>00:42</small>
        </div>
        <p>
          <span>Prof. Marina</span> {lesson.caption}
        </p>
        <div className="caption-line">
          <i style={{ width: activeStep >= 4 ? '74%' : '8%' }} />
        </div>
      </div>
      <div className="summary-card">
        <div className="mini-card-title"><FileText size={13} /> Key summary</div>
        <ul>
          {lesson.summary.map((item, index) => (
            <li key={item}><span>{index + 1}</span>{item}</li>
          ))}
        </ul>
      </div>
      <QuizCard
        lesson={lesson}
        enabled={activeStep >= 5}
        highlighted={activeStep === 5}
        selected={selectedAnswer}
        onSelect={onSelectAnswer}
      />
    </div>
  )
}

function DotPadPreview({ lesson, ready }: { lesson: Lesson; ready: boolean }) {
  const dots = useMemo(
    () => matrixToDots(buildLiveMatrix(lesson.id, ready)),
    [lesson.id, ready],
  )

  return (
    <div className="dotpad-shell">
      <div className="dotpad-top">
        <span>DOTPAD</span>
        <small>60 × 40</small>
        <i />
      </div>
      <svg className="dot-matrix" viewBox="0 0 300 200" aria-label={`${lesson.title} DotPad 60 by 40 preview`}>
        <rect width="300" height="200" rx="7" fill="#101722" />
        {dots.map((dot) => (
          <circle
            key={`${dot.x}-${dot.y}`}
            cx={dot.x * 5 + 2.5}
            cy={dot.y * 5 + 2.5}
            r={dot.raised ? 1.55 : .58}
            fill={dot.raised ? lesson.accent : '#314050'}
            opacity={dot.raised ? 1 : .48}
          />
        ))}
      </svg>
      <div className="dotpad-bottom">
        <span>F1</span><span>F2</span><span>F3</span><span>F4</span>
      </div>
    </div>
  )
}

function QuizCard({
  lesson,
  enabled,
  highlighted,
  selected,
  onSelect,
}: {
  lesson: Lesson
  enabled: boolean
  highlighted: boolean
  selected: number | null
  onSelect: (index: number) => void
}) {
  return (
    <div className={`quiz-card ${highlighted ? 'inner-focus' : ''}`}>
      <div className="mini-card-title"><ScanLine size={13} /> Accessible quiz <span>1 / 3</span></div>
      <p>{enabled ? lesson.quiz.question : 'Quiz becomes available at Step 5.'}</p>
      <div className="quiz-options">
        {lesson.quiz.options.map((option, index) => {
          const isSelected = selected === index
          const isCorrect = isSelected && index === lesson.quiz.answer
          const isWrong = isSelected && index !== lesson.quiz.answer
          return (
            <button
              key={option}
              disabled={!enabled}
              onClick={() => onSelect(index)}
              className={`${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
            >
              <span>{String.fromCharCode(65 + index)}</span>{option}
              {isCorrect && <Check size={12} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LibraryPanel({
  lesson,
  highlighted,
  saved,
}: {
  lesson: Lesson
  highlighted: boolean
  saved: boolean
}) {
  const Icon = lesson.id === 'plant' ? Flower2 : lesson.id === 'solar' ? Orbit : CloudRain
  return (
    <section className={`library-section ${highlighted ? 'focus-panel' : ''}`}>
      <div className="library-header">
        <div className="library-title-icon"><Library size={20} /></div>
        <div>
          <span>SHARED ACCESSIBLE CONTENT REPOSITORY</span>
          <h2>Tactile World Science Library</h2>
        </div>
        <p>Every converted lesson becomes a reusable, searchable accessibility package for teachers and students.</p>
        <button className={saved ? 'saved' : ''}>
          {saved ? <Check size={14} /> : <BookOpen size={14} />}
          {saved ? 'Saved to library' : 'Browse 1,284 assets'}
        </button>
      </div>

      <div className="library-flow">
        <div className="library-stat">
          <strong>1,284</strong><span>Tactile graphics</span>
        </div>
        <div className="library-stat">
          <strong>312</strong><span>Science lessons</span>
        </div>
        <div className="library-stat">
          <strong>18</strong><span>Languages</span>
        </div>
        <div className="asset-card featured">
          <div className="asset-preview" style={{ background: lesson.accentSoft }}>
            <Icon size={32} color={lesson.accent} />
            <div className="mini-tactile-lines">
              {Array.from({ length: 18 }, (_, index) => <i key={index} className={index % 4 === 0 ? 'raised' : ''} />)}
            </div>
          </div>
          <div className="asset-copy">
            <span className="new-asset">{saved ? 'JUST SAVED' : 'CURRENT LESSON'}</span>
            <h3>{lesson.library.asset}</h3>
            <p>{lesson.grade} · {lesson.library.pages} tactile pages · Audio + captions + quiz</p>
            <div className="asset-tags">{lesson.library.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
          <div className="asset-version">
            <strong>{lesson.library.version}</strong>
            <span>{saved ? 'Synced now' : 'Draft package'}</span>
          </div>
        </div>
        <div className="asset-card compact">
          <div className="compact-icon"><Waves size={19} /></div>
          <div><span>COLLECTION</span><strong>Brazil Science Essentials</strong><small>42 accessible packages</small></div>
          <ChevronRight size={16} />
        </div>
        <div className="asset-card compact">
          <div className="compact-icon purple"><Sun size={19} /></div>
          <div><span>MOST USED</span><strong>Earth & Space</strong><small>98% teacher rating</small></div>
          <ChevronRight size={16} />
        </div>
      </div>
    </section>
  )
}

export default App
