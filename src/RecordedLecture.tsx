import { useMemo, useRef, useState } from 'react'
import {
  Accessibility,
  AudioLines,
  BookOpenCheck,
  Captions,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  FileText,
  Headphones,
  Languages,
  Library,
  ListChecks,
  MonitorPlay,
  Pause,
  Play,
  RotateCcw,
  ScanLine,
  Send,
  Sparkles,
  Video,
} from 'lucide-react'
import { lectureMarkers, lecturePacks, videoAnalysisSteps } from './recordedData'
import type { LearningEventType } from './lib/tracking'
import DotPadConnect from './components/DotPadConnect'
import type { DotPadController } from './lib/dotpad/useDotPad'
import { buildRecordedMatrix, countRaised, matrixToDots } from './lib/dotpad/sceneMatrix'

type LectureTab = 'blind' | 'deaf' | 'quiz'

type Props = {
  sessionId: string
  onTrack: (
    eventType: LearningEventType,
    demoStep: number,
    payload?: Record<string, unknown>,
  ) => void
  dotPad: DotPadController
}

const totalSeconds = 258

export default function RecordedLecture({ sessionId, onTrack, dotPad }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<7 | 8>(7)
  const [activeMarker, setActiveMarker] = useState(2)
  const [activeTab, setActiveTab] = useState<LectureTab>('blind')
  const [isPlaying, setIsPlaying] = useState(false)
  const [sentToDotPad, setSentToDotPad] = useState(false)
  const [audioReplay, setAudioReplay] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null)
  const [savedPack, setSavedPack] = useState(false)

  const marker = lectureMarkers[activeMarker]
  const progress = Math.min((marker.seconds / totalSeconds) * 100, 100)

  const selectMarker = (index: number) => {
    const nextMarker = lectureMarkers[index]
    setActiveMarker(index)
    setSentToDotPad(false)
    setQuizAnswer(null)

    if (videoRef.current) {
      videoRef.current.currentTime = nextMarker.seconds
    }

    onTrack('video_marker_selected', 7, {
      session_id: sessionId,
      lecture_id: 'plant-structure-recorded',
      marker_id: nextMarker.id,
      marker_title: nextMarker.title,
      video_seconds: nextMarker.seconds,
      tactile_scene: nextMarker.tactileTitle,
    })
  }

  const toggleVideo = async () => {
    const nextPlaying = !isPlaying
    setIsPlaying(nextPlaying)

    if (videoRef.current) {
      if (nextPlaying) {
        await videoRef.current.play().catch(() => setIsPlaying(false))
      } else {
        videoRef.current.pause()
      }
    }

    onTrack('video_playback_toggled', 7, {
      lecture_id: 'plant-structure-recorded',
      playing: nextPlaying,
      video_seconds: marker.seconds,
    })
  }

  const selectTab = (tab: LectureTab) => {
    setActiveTab(tab)
    onTrack('lecture_tab_viewed', 7, {
      lecture_id: 'plant-structure-recorded',
      accessibility_tab: tab,
      marker_id: marker.id,
    })
  }

  const sendScene = () => {
    const sceneMatrix = buildRecordedMatrix(activeMarker)
    const delivered = dotPad.sendMatrix(sceneMatrix)
    setSentToDotPad(true)
    onTrack('lecture_scene_generated', 7, {
      lecture_id: 'plant-structure-recorded',
      marker_id: marker.id,
      marker_title: marker.title,
      video_seconds: marker.seconds,
      tactile_title: marker.tactileTitle,
      matrix: { columns: 60, rows: 40, pins: 2400 },
      raised_pins: countRaised(sceneMatrix),
      delivered_to_hardware: delivered,
      device_name: delivered ? dotPad.deviceName : null,
      transport: delivered ? dotPad.transport : 'preview_only',
      audio_description: marker.description,
    })
  }

  const replayAudio = () => {
    setAudioReplay(true)
    window.setTimeout(() => setAudioReplay(false), 900)
    onTrack('audio_played', 7, {
      lecture_id: 'plant-structure-recorded',
      marker_id: marker.id,
      description: marker.description,
      source: 'recorded_lecture',
    })
  }

  const nextTactileScene = () => {
    const nextIndex = (activeMarker + 1) % lectureMarkers.length
    selectMarker(nextIndex)
  }

  const answerQuiz = (index: number) => {
    setQuizAnswer(index)
    onTrack('lecture_quiz_answered', 7, {
      lecture_id: 'plant-structure-recorded',
      marker_id: 'quiz-moment',
      video_seconds: 180,
      question: 'Which part of the plant absorbs water from the soil?',
      options: ['Leaf', 'Flower', 'Root', 'Stem'],
      selected_index: index,
      correct_index: 2,
      is_correct: index === 2,
    })
  }

  const saveLecturePack = () => {
    setSavedPack(true)
    setPhase(8)
    onTrack('lecture_pack_saved', 8, {
      lecture_id: 'plant-structure-recorded',
      title: 'Plant Structure Video Lesson',
      original_ufit_title: 'Plant Structure - Grade 5 Science',
      subject: 'Science',
      grade: 'Grade 5',
      duration_seconds: totalSeconds,
      tactile_scenes: 4,
      quiz_moments: 1,
      captions_ready: true,
      dotpad_ready: true,
      teacher_review_status: 'In Review',
      student_accessibility_modes: ['blind_low_vision', 'deaf_hard_of_hearing'],
    })
  }

  return (
    <div className="recorded-mode">
      <section className="recorded-story">
        <div className="recorded-story-icon"><MonitorPlay size={21} /></div>
        <div>
          <span>TACTILE WORLD EDUCATION · RECORDED LECTURE MODE</span>
          <h1>The same accessibility engine can support both live classrooms and recorded online lectures.</h1>
        </div>
        <div className="story-translations">
          <p>동일한 접근성 엔진을 통해 현장 수업뿐 아니라 영상 기반 인터넷 강의도 통합교육 콘텐츠로 확장할 수 있습니다.</p>
          <p>O mesmo motor de acessibilidade pode apoiar tanto aulas presenciais quanto videoaulas gravadas.</p>
        </div>
      </section>

      <section className="recorded-stepbar" aria-label="Recorded lecture steps">
        <button className={phase === 7 ? 'active' : 'done'} onClick={() => setPhase(7)}>
          <span>{phase === 8 ? <Check size={13} /> : '7'}</span>
          <div><small>STEP 7</small><strong>Recorded Lecture Mode</strong></div>
        </button>
        <div className="recorded-step-line"><i className={phase === 8 ? 'done' : ''} /></div>
        <button className={phase === 8 ? 'active' : ''} onClick={() => setPhase(8)}>
          <span>8</span>
          <div><small>STEP 8</small><strong>Tactile World - Education Lecture Pack</strong></div>
        </button>
        <div className="recorded-flow-copy">
          VIDEO <ChevronRight size={12} /> SCENE ANALYSIS <ChevronRight size={12} />
          TACTILE + CAPTIONS <ChevronRight size={12} /> QUIZ <ChevronRight size={12} /> LECTURE PACK
        </div>
      </section>

      <section className="recorded-grid">
        <RecordedPlayer
          videoRef={videoRef}
          markerIndex={activeMarker}
          isPlaying={isPlaying}
          progress={progress}
          onToggleVideo={toggleVideo}
          onMarker={selectMarker}
        />
        <VideoAnalysis activeMarker={activeMarker} />
        <LectureOutputs
          activeTab={activeTab}
          markerIndex={activeMarker}
          audioReplay={audioReplay}
          sentToDotPad={sentToDotPad}
          dotPad={dotPad}
          quizAnswer={quizAnswer}
          onTab={selectTab}
          onReplay={replayAudio}
          onSend={sendScene}
          onNext={nextTactileScene}
          onQuizAnswer={answerQuiz}
          onReturnQuiz={() => {
            selectMarker(3)
            setActiveTab('quiz')
          }}
          onReviewTactile={() => {
            selectMarker(2)
            setActiveTab('blind')
          }}
        />
      </section>

      <EducationLibrary
        phase={phase}
        saved={savedPack}
        onSave={saveLecturePack}
      />
    </div>
  )
}

function RecordedPlayer({
  videoRef,
  markerIndex,
  isPlaying,
  progress,
  onToggleVideo,
  onMarker,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>
  markerIndex: number
  isPlaying: boolean
  progress: number
  onToggleVideo: () => void
  onMarker: (index: number) => void
}) {
  const marker = lectureMarkers[markerIndex]

  return (
    <section className="recorded-panel lecture-player-panel">
      <RecordedTitle
        number="07A"
        eyebrow="UFIT VIDEO SOURCE"
        title="UFIT Recorded Science Lecture"
        icon={<Video size={18} />}
      />

      <div className="lecture-video-frame">
        <video
          ref={videoRef}
          src="/inclusive-education-brazil.mp4"
          preload="metadata"
          onEnded={() => undefined}
          aria-label="Inclusive Education Strategies in Brazil recorded lecture"
        />
        <div className="video-dim" />
        <div className="video-topbar">
          <span>UFIT · CIÊNCIAS</span>
          <span className="recorded-badge"><i /> RECORDED</span>
        </div>
        <div className="video-science-overlay">
          <PlantLectureScene focus={marker.type} />
          <span>DOT LENS SCIENCE SCENE · {marker.title.toUpperCase()}</span>
        </div>
        <button className="video-play-main" onClick={onToggleVideo} aria-label={isPlaying ? 'Pause recorded lecture' : 'Play recorded lecture'}>
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
        <div className="video-caption-overlay">
          Hoje vamos aprender como a raiz, o caule, as folhas e as flores ajudam a planta a viver.
        </div>
      </div>

      <div className="lecture-meta">
        <div>
          <span>GRADE 5 SCIENCE · RECORDED MODULE</span>
          <h2>Plant Structure - Grade 5 Science</h2>
        </div>
        <div className="lecture-duration"><Clock3 size={13} /> 04:18</div>
      </div>

      <div className="video-timeline">
        <div className="timeline-time">
          <strong>{marker.time}</strong><span>/ 04:18</span>
          <small>Current scene · {marker.title}</small>
        </div>
        <div className="timeline-track">
          <div className="timeline-fill" style={{ width: `${progress}%` }} />
          <div className="timeline-playhead" style={{ left: `${progress}%` }} />
          {lectureMarkers.map((item, index) => (
            <button
              key={item.id}
              className={`timeline-marker ${item.type} ${markerIndex === index ? 'active' : ''}`}
              style={{ left: `${(item.seconds / totalSeconds) * 100}%` }}
              onClick={() => onMarker(index)}
              aria-label={`${item.time} ${item.title}`}
            >
              <i />
              <span>{item.time}<strong>{item.title}</strong></span>
            </button>
          ))}
        </div>
      </div>

      <div className="lecture-source-note">
        <MonitorPlay size={13} />
        <span>Video source: Inclusive Education Strategies in Brazil</span>
        <strong>Authorized PoC media · Mock analysis</strong>
      </div>
    </section>
  )
}

function VideoAnalysis({ activeMarker }: { activeMarker: number }) {
  return (
    <section className="recorded-panel video-analysis-panel">
      <RecordedTitle
        number="07B"
        eyebrow="MULTIMODAL VIDEO PIPELINE"
        title="Dot Lens Video Analysis"
        icon={<ScanLine size={18} />}
      />

      <div className="video-ai-card">
        <div className="video-ai-orb"><Sparkles size={22} /><i /></div>
        <div>
          <span>DOT LENS VIDEO MODEL · MOCK</span>
          <strong>Timeline-aware analysis complete</strong>
        </div>
        <small>98.2%</small>
      </div>

      <div className="video-analysis-list">
        {videoAnalysisSteps.map((step, index) => (
          <div key={step.label} className={`video-analysis-row ${index <= activeMarker + 2 ? 'complete' : ''}`}>
            <span>{index <= activeMarker + 2 ? <Check size={13} /> : index + 1}</span>
            <div><strong>{step.label}</strong><small>{step.result}</small></div>
            <i />
          </div>
        ))}
      </div>

      <div className="scene-intelligence">
        <div className="scene-intelligence-head">
          <span><CircleDot size={14} /> Scene intelligence</span>
          <strong>{lectureMarkers[activeMarker].time}</strong>
        </div>
        <div className="scene-wave">
          {[38, 55, 76, 44, 88, 61, 91, 53, 72, 96, 64, 82, 47, 89, 59, 76].map((height, index) => (
            <i key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="scene-tags">
          <span>plant</span><span>root</span><span>soil</span><span>teacher speech</span>
        </div>
      </div>

      <div className="video-privacy">
        <Accessibility size={13} />
        <span>Accessibility metadata only</span>
        <strong>No student personal data stored</strong>
      </div>
    </section>
  )
}

function LectureOutputs({
  activeTab,
  markerIndex,
  audioReplay,
  sentToDotPad,
  dotPad,
  quizAnswer,
  onTab,
  onReplay,
  onSend,
  onNext,
  onQuizAnswer,
  onReturnQuiz,
  onReviewTactile,
}: {
  activeTab: LectureTab
  markerIndex: number
  audioReplay: boolean
  sentToDotPad: boolean
  dotPad: DotPadController
  quizAnswer: number | null
  onTab: (tab: LectureTab) => void
  onReplay: () => void
  onSend: () => void
  onNext: () => void
  onQuizAnswer: (index: number) => void
  onReturnQuiz: () => void
  onReviewTactile: () => void
}) {
  const marker = lectureMarkers[markerIndex]

  return (
    <section className="recorded-panel lecture-outputs-panel">
      <RecordedTitle
        number="07C"
        eyebrow="TIMELINE-SYNCHRONIZED EXPERIENCE"
        title="Accessible Lecture Outputs"
        icon={<Accessibility size={18} />}
      />

      <div className="lecture-output-tabs" role="tablist" aria-label="Accessible lecture output tabs">
        <button className={activeTab === 'blind' ? 'active' : ''} onClick={() => onTab('blind')} role="tab">
          <CircleDot size={13} /> Blind / Low Vision
        </button>
        <button className={activeTab === 'deaf' ? 'active' : ''} onClick={() => onTab('deaf')} role="tab">
          <Captions size={13} /> Deaf / Hard of Hearing
        </button>
        <button className={activeTab === 'quiz' ? 'active' : ''} onClick={() => onTab('quiz')} role="tab">
          <ListChecks size={13} /> Lecture Quiz
        </button>
      </div>

      {activeTab === 'blind' && (
        <div className="lecture-tab-content blind-lecture-tab">
          <div className="lecture-dotpad-column">
            <RecordedDotPad markerIndex={markerIndex} sent={sentToDotPad} />
            <div className="scene-sync-label">
              <i /><span>{marker.time} VIDEO SCENE</span><ChevronRight size={12} /><strong>DOTPAD 60 × 40</strong>
            </div>
          </div>
          <div className="lecture-access-copy">
            <div className="tactile-scene-title">
              <span>SCENE {markerIndex + 1} OF 4</span>
              <h3>{marker.tactileTitle}</h3>
            </div>
            <div className={`lecture-audio-description ${audioReplay ? 'playing' : ''}`}>
              <div><Headphones size={14} /><span>Audio description</span><small>EN · 0:14</small></div>
              <p>{marker.description}</p>
              <div className="mini-audio-wave">
                {[42, 71, 53, 88, 61, 77, 48, 93, 58, 82, 66, 46].map((height, index) => (
                  <i key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
            <div className="exploration-steps">
              <span>TACTILE EXPLORATION PATH</span>
              <ol>
                <li><i>1</i>Find the stem in the center.</li>
                <li><i>2</i>Move downward to the root.</li>
                <li><i>3</i>Follow the root branches outward.</li>
              </ol>
            </div>
            <DotPadConnect dotPad={dotPad} />
            <div className="lecture-action-buttons">
              <button onClick={onReplay}><RotateCcw size={12} /> Replay audio description</button>
              <button className={sentToDotPad ? 'success' : 'primary'} onClick={onSend}>
                {sentToDotPad ? <Check size={12} /> : <Send size={12} />}
                {sentToDotPad
                  ? dotPad.status === 'connected'
                    ? 'Scene sent to DotPad'
                    : 'Scene rendered (preview)'
                  : dotPad.status === 'connected'
                    ? 'Send scene to DotPad'
                    : 'Render scene (connect to send)'}
              </button>
              <button onClick={onNext}>Next tactile scene <ChevronRight size={12} /></button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deaf' && (
        <div className="lecture-tab-content deaf-lecture-tab">
          <div className="caption-readiness">
            <span><Captions size={14} /> PT-BR caption-ready</span>
            <span><Languages size={14} /> Libras-ready · Interpreter Support Mode</span>
          </div>
          <div className="recorded-caption-card">
            <div><AudioLines size={14} /><span>VIDEO CAPTION · {marker.time}</span><i>PT-BR</i></div>
            <p>“Hoje vamos aprender como a raiz, o caule, as folhas e as flores ajudam a planta a viver.”</p>
            <div className="caption-progress"><i /></div>
          </div>
          <div className="recorded-summary-grid">
            <div>
              <span><FileText size={13} /> KEY SUMMARY</span>
              <p><strong>Key point:</strong> Roots absorb water from the soil. Leaves help the plant make food using sunlight.</p>
            </div>
            <div>
              <span><Sparkles size={13} /> IMPORTANT CONCEPTS</span>
              <div className="term-cards">
                <button>RAIZ<small>root</small></button>
                <button>CAULE<small>stem</small></button>
                <button>FOLHAS<small>leaves</small></button>
                <button>FOTOSSÍNTESE<small>photosynthesis</small></button>
              </div>
            </div>
          </div>
          <div className="interpreter-note">
            <Accessibility size={14} />
            <span>Interpreter cue prepared for the selected science scene.</span>
            <strong>Scene vocabulary synced</strong>
          </div>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="lecture-tab-content lecture-quiz-tab">
          <div className="quiz-video-context">
            <span>QUIZ MOMENT · 03:00</span>
            <strong>Which part of the plant absorbs water from the soil?</strong>
            <p>Converted from the UFIT lecture into an accessible text, audio, and tactile-supported question.</p>
          </div>
          <div className="lecture-quiz-options">
            {['Leaf', 'Flower', 'Root', 'Stem'].map((option, index) => {
              const selected = quizAnswer === index
              const correct = selected && index === 2
              return (
                <button
                  key={option}
                  className={`${correct ? 'correct' : ''} ${selected && !correct ? 'wrong' : ''}`}
                  onClick={() => onQuizAnswer(index)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>{option}
                  {correct && <Check size={13} />}
                </button>
              )
            })}
          </div>
          {quizAnswer !== null && (
            <div className={quizAnswer === 2 ? 'lecture-feedback correct' : 'lecture-feedback wrong'}>
              {quizAnswer === 2
                ? 'Correct. The root absorbs water from the soil.'
                : 'Try again. Explore the tactile root scene once more.'}
            </div>
          )}
          <div className="quiz-review-actions">
            <button onClick={onReturnQuiz}><Clock3 size={12} /> Return to 03:00 on timeline</button>
            <button onClick={onReviewTactile}><CircleDot size={12} /> Review tactile scene before answering</button>
          </div>
        </div>
      )}
    </section>
  )
}

function EducationLibrary({
  phase,
  saved,
  onSave,
}: {
  phase: 7 | 8
  saved: boolean
  onSave: () => void
}) {
  return (
    <section className={`education-library ${phase === 8 ? 'active-phase' : ''}`}>
      <div className="education-library-head">
        <div className="education-icon"><Library size={20} /></div>
        <div>
          <span>STEP 8 · REUSABLE ACCESSIBLE ONLINE LEARNING</span>
          <h2>Tactile World - Education Lecture Packs</h2>
        </div>
        <p>Recorded UFIT lessons become reviewable packages containing synchronized tactile scenes, captions, summaries, and quizzes.</p>
        <button className={saved ? 'saved' : ''} onClick={onSave}>
          {saved ? <Check size={14} /> : <BookOpenCheck size={14} />}
          {saved ? 'Plant lecture pack saved' : 'Save current lecture pack'}
        </button>
      </div>

      <div className="education-pack-grid">
        {lecturePacks.map((pack, index) => (
          <article key={pack.id} className={`education-pack-card ${pack.tone} ${index === 0 && saved ? 'just-saved' : ''}`}>
            <div className="pack-visual">
              {index === 0 ? <PlantLectureScene focus="tactile" /> : index === 1 ? <MiniSolar /> : <MiniWater />}
              <span>{index === 0 ? 'BIOLOGY' : index === 1 ? 'ASTRONOMY' : 'EARTH SCIENCE'}</span>
            </div>
            <div className="pack-content">
              <div className="pack-title-row">
                <div><small>UFIT RECORDED LECTURE</small><h3>{pack.title}</h3></div>
                <span className={`pack-status ${pack.status.toLowerCase().replace(' ', '-')}`}>{index === 0 && saved ? 'Saved' : pack.status}</span>
              </div>
              <div className="pack-specs">
                <span><strong>Science</strong>Subject</span>
                <span><strong>{pack.grade}</strong>Grade level</span>
                <span><strong>{pack.duration}</strong>Video duration</span>
                <span><strong>{pack.scenes}</strong>Tactile scenes</span>
                <span><strong>{pack.quizzes}</strong>Quiz moments</span>
              </div>
              <div className="pack-readiness">
                <span><Check size={10} /> PT-BR captions ready</span>
                <span><Check size={10} /> DotPad-ready</span>
                <span><Check size={10} /> Summaries</span>
                <span><Check size={10} /> Student accessibility modes</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function RecordedTitle({
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
    <div className="recorded-panel-title">
      <span>{number}</span>
      <div><small>{eyebrow}</small><h2>{title}</h2></div>
      <i>{icon}</i>
    </div>
  )
}

function RecordedDotPad({ markerIndex, sent }: { markerIndex: number; sent: boolean }) {
  const dots = useMemo(
    () => matrixToDots(buildRecordedMatrix(markerIndex)),
    [markerIndex],
  )

  return (
    <div className={`recorded-dotpad ${sent ? 'sent' : ''}`}>
      <div className="recorded-dotpad-head"><span>DOTPAD</span><small>60 × 40 · SCENE SYNC</small><i /></div>
      <svg viewBox="0 0 300 200" aria-label="Recorded lecture tactile scene DotPad preview">
        <rect width="300" height="200" rx="7" fill="#101722" />
        {dots.map((dot) => (
          <circle
            key={`${dot.x}-${dot.y}`}
            cx={dot.x * 5 + 2.5}
            cy={dot.y * 5 + 2.5}
            r={dot.raised ? 1.55 : .58}
            fill={dot.raised ? '#31c88a' : '#314050'}
            opacity={dot.raised ? 1 : .46}
          />
        ))}
      </svg>
      <div className="recorded-dotpad-keys"><span>PREV</span><span>EXPLORE</span><span>LABELS</span><span>NEXT</span></div>
    </div>
  )
}

function PlantLectureScene({ focus }: { focus: string }) {
  const rootFocus = focus === 'tactile' || focus === 'quiz'
  return (
    <svg viewBox="0 0 260 170" role="img" aria-label="Plant structure lecture scene">
      <rect width="260" height="170" rx="14" fill="#eff9f3" />
      <circle cx="40" cy="32" r="16" fill="#ffdb63" />
      <path d="M0 126 C58 112 103 133 151 122 C195 112 225 120 260 113 V170 H0Z" fill="#8a624d" />
      <path d="M134 124 C133 92 134 67 132 45" stroke="#359965" strokeWidth="7" strokeLinecap="round" opacity={rootFocus ? .45 : 1} />
      <path d="M133 88 C111 65 91 64 76 74 C91 96 111 101 133 88Z" fill="#4bbd7d" opacity={rootFocus ? .45 : 1} />
      <path d="M133 74 C154 53 176 52 192 62 C175 84 153 88 133 74Z" fill="#4bbd7d" opacity={rootFocus ? .45 : 1} />
      <g transform="translate(132 38)" opacity={rootFocus ? .45 : 1}>
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse key={angle} rx="9" ry="18" fill="#f17383" transform={`rotate(${angle}) translate(0 -13)`} />
        ))}
        <circle r="10" fill="#ffd45f" />
      </g>
      <path d="M133 122 C120 139 115 152 111 167 M133 123 C145 139 153 152 158 168 M132 123 L132 169 M119 141 L98 155 M150 146 L171 159" stroke={rootFocus ? '#ffcf5a' : '#e8c69e'} strokeWidth={rootFocus ? 5 : 3} strokeLinecap="round" fill="none" />
      {rootFocus && <rect x="85" y="128" width="98" height="36" rx="10" fill="none" stroke="#ffcf5a" strokeWidth="2" strokeDasharray="5 4" />}
    </svg>
  )
}

function MiniSolar() {
  return (
    <svg viewBox="0 0 180 110">
      <rect width="180" height="110" rx="12" fill="#171d3b" />
      <circle cx="28" cy="55" r="18" fill="#ffbf45" />
      {[36, 58, 82, 108, 136].map((radius) => <ellipse key={radius} cx="30" cy="55" rx={radius} ry={radius / 2.8} fill="none" stroke="#7888bd" strokeWidth="1" />)}
      <circle cx="112" cy="38" r="5" fill="#4d9fe3" />
      <circle cx="144" cy="70" r="8" fill="#d1a06b" />
    </svg>
  )
}

function MiniWater() {
  return (
    <svg viewBox="0 0 180 110">
      <rect width="180" height="110" rx="12" fill="#e7f7ff" />
      <circle cx="30" cy="25" r="13" fill="#ffd85c" />
      <path d="M72 84 L122 34 L169 84Z" fill="#78938d" />
      <path d="M0 82 C33 73 56 90 87 80 C120 71 146 86 180 77 V110 H0Z" fill="#3ca9df" />
      <g fill="#fff"><circle cx="98" cy="24" r="12" /><circle cx="113" cy="21" r="15" /><circle cx="128" cy="27" r="11" /></g>
      {[104, 116, 128].map((x) => <line key={x} x1={x} y1="38" x2={x - 5} y2="55" stroke="#3ca9df" strokeWidth="2" />)}
    </svg>
  )
}
