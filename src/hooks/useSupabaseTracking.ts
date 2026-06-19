import { useCallback, useEffect, useState } from 'react'
import {
  createLearningEvent,
  flushLearningEvents,
  getPendingEventCount,
  queueLearningEvent,
  type LearningEventType,
} from '../lib/tracking'
import { isSupabaseConfigured } from '../lib/supabase'

export type SyncState = 'setup_required' | 'idle' | 'syncing' | 'synced' | 'error'

type TrackInput = {
  sessionId: string
  lessonId: string
  eventType: LearningEventType
  demoStep: number
  payload?: Record<string, unknown>
}

export function useSupabaseTracking() {
  const [syncState, setSyncState] = useState<SyncState>(
    isSupabaseConfigured ? 'idle' : 'setup_required',
  )
  const [pendingCount, setPendingCount] = useState(getPendingEventCount)
  const [lastError, setLastError] = useState('')
  const [syncedCount, setSyncedCount] = useState(0)

  const applyResult = useCallback((result: Awaited<ReturnType<typeof flushLearningEvents>>) => {
    setPendingCount(result.pending)
    setSyncedCount((count) => count + result.synced)
    setSyncState(result.state)
    setLastError(result.message ?? '')
  }, [])

  const retry = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setSyncState('setup_required')
      return
    }

    setSyncState('syncing')
    applyResult(await flushLearningEvents())
  }, [applyResult])

  const track = useCallback(async ({
    sessionId,
    lessonId,
    eventType,
    demoStep,
    payload = {},
  }: TrackInput) => {
    setPendingCount((count) => count + 1)

    if (isSupabaseConfigured) {
      setSyncState('syncing')
    }

    const result = await queueLearningEvent(
      createLearningEvent({
        sessionId,
        lessonId,
        eventType,
        demoStep,
        payload,
      }),
    )

    applyResult(result)
  }, [applyResult])

  useEffect(() => {
    void retry()
  }, [retry])

  return {
    isConfigured: isSupabaseConfigured,
    syncState,
    pendingCount,
    syncedCount,
    lastError,
    track,
    retry,
  }
}
