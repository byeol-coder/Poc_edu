import { isSupabaseConfigured, supabase } from './supabase'

export type LearningEventType =
  | 'session_started'
  | 'lesson_selected'
  | 'lesson_shown'
  | 'recognition_completed'
  | 'tactile_generated'
  | 'captions_enabled'
  | 'quiz_started'
  | 'quiz_answered'
  | 'library_saved'
  | 'audio_played'
  | 'function_key_pressed'
  | 'recorded_mode_opened'
  | 'video_marker_selected'
  | 'video_playback_toggled'
  | 'lecture_scene_generated'
  | 'lecture_tab_viewed'
  | 'lecture_quiz_answered'
  | 'lecture_pack_saved'

export type LearningEvent = {
  clientEventId: string
  sessionId: string
  lessonId: string
  eventType: LearningEventType
  demoStep: number
  payload: Record<string, unknown>
  occurredAt: string
}

export type SyncResult = {
  synced: number
  pending: number
  state: 'synced' | 'setup_required' | 'error'
  message?: string
}

const QUEUE_KEY = 'dot-lens-ufit:supabase-event-queue'
let flushLock: Promise<SyncResult> | null = null

const readQueue = (): LearningEvent[] => {
  try {
    const stored = window.localStorage.getItem(QUEUE_KEY)
    return stored ? (JSON.parse(stored) as LearningEvent[]) : []
  } catch {
    return []
  }
}

const writeQueue = (queue: LearningEvent[]) => {
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-250)))
}

export const getPendingEventCount = () =>
  typeof window === 'undefined' ? 0 : readQueue().length

export const createLearningEvent = (
  input: Omit<LearningEvent, 'clientEventId' | 'occurredAt'>,
): LearningEvent => ({
  ...input,
  clientEventId: crypto.randomUUID(),
  occurredAt: new Date().toISOString(),
})

const performFlush = async (): Promise<SyncResult> => {
  const queue = readQueue()

  if (!isSupabaseConfigured || !supabase) {
    return {
      synced: 0,
      pending: queue.length,
      state: 'setup_required',
      message: 'Add the Supabase publishable key to enable cloud sync.',
    }
  }

  let synced = 0
  let firstError = ''

  for (const event of queue) {
    const { error } = await supabase.rpc('record_dot_lens_event', {
      p_client_event_id: event.clientEventId,
      p_session_id: event.sessionId,
      p_lesson_id: event.lessonId,
      p_event_type: event.eventType,
      p_demo_step: event.demoStep,
      p_payload: event.payload,
      p_occurred_at: event.occurredAt,
    })

    if (error) {
      firstError = error.message
      break
    }

    synced += 1
  }

  if (synced > 0) {
    writeQueue(queue.slice(synced))
  }

  const pending = queue.length - synced

  return {
    synced,
    pending,
    state: pending === 0 ? 'synced' : 'error',
    message: firstError || undefined,
  }
}

export const flushLearningEvents = async () => {
  if (flushLock) return flushLock

  flushLock = performFlush().finally(() => {
    flushLock = null
  })

  return flushLock
}

export const queueLearningEvent = async (event: LearningEvent) => {
  const queue = readQueue()

  if (!queue.some((queued) => queued.clientEventId === event.clientEventId)) {
    queue.push(event)
    writeQueue(queue)
  }

  return flushLearningEvents()
}
