import { useState, useRef, useCallback, useEffect } from 'react'

export interface TranscriptSegment {
  id: string
  text: string
  timestamp: number // ms since recording start
  duration: number
}

export interface Session {
  id: string
  title: string
  date: string
  segments: TranscriptSegment[]
  fullText: string
  totalDuration: number
}

export type RecordingState = 'idle' | 'recording' | 'processing' | 'error'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

function loadSessions(): Session[] {
  try {
    return JSON.parse(localStorage.getItem('voxscribe_sessions') || '[]')
  } catch {
    return []
  }
}

function saveSessions(sessions: Session[]) {
  localStorage.setItem('voxscribe_sessions', JSON.stringify(sessions))
}

export function useTranscription() {
  const [state, setState] = useState<RecordingState>('idle')
  const [sessions, setSessions] = useState<Session[]>(loadSessions)
  const [activeSession, setActiveSession] = useState<Session | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animFrameRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Tick elapsed time
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  const measureAudio = useCallback(() => {
    if (!analyserRef.current) return
    const data = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(data)
    const avg = data.reduce((a, b) => a + b, 0) / data.length
    setAudioLevel(avg / 128)
    animFrameRef.current = requestAnimationFrame(measureAudio)
  }, [])

  const startRecording = useCallback(async () => {
    setErrorMsg('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Audio analysis
      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      })
      mediaRecorderRef.current = recorder
      chunksRef.current = []
      startTimeRef.current = Date.now()

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.start(250)
      setState('recording')
      setElapsed(0)

      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)

      measureAudio()
    } catch (err: any) {
      setErrorMsg(err.message || 'Microphone access denied')
      setState('error')
    }
  }, [measureAudio])

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === 'inactive') return

    setState('processing')
    if (timerRef.current) clearInterval(timerRef.current)
    cancelAnimationFrame(animFrameRef.current)
    setAudioLevel(0)

    const duration = Date.now() - startTimeRef.current

    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve()
      recorder.stop()
    })

    streamRef.current?.getTracks().forEach((t) => t.stop())

    const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })

    try {
      let text = ''

      if (!GROQ_API_KEY) {
        // Demo mode: generate placeholder text
        await new Promise((r) => setTimeout(r, 1500))
        text = `[Demo mode — add VITE_GROQ_API_KEY to enable real transcription]\n\nThis is a sample transcript that would appear after recording. VoxScribe uses Groq's Whisper API to transcribe your voice with studio-level accuracy in real-time. The text appears here instantly after you stop recording.`
      } else {
        const formData = new FormData()
        formData.append('file', audioBlob, 'audio.webm')
        formData.append('model', 'whisper-large-v3')
        formData.append('response_format', 'json')

        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
          body: formData,
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          throw new Error(errData?.error?.message || `API Error ${response.status}`)
        }

        const data = await response.json()
        text = data.text || ''
      }

      if (!text.trim()) {
        setState('idle')
        return
      }

      const session: Session = {
        id: crypto.randomUUID(),
        title: `Session — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        date: new Date().toISOString(),
        segments: [{
          id: crypto.randomUUID(),
          text: text.trim(),
          timestamp: 0,
          duration,
        }],
        fullText: text.trim(),
        totalDuration: duration,
      }

      setSessions((prev) => {
        const updated = [session, ...prev]
        saveSessions(updated)
        return updated
      })
      setActiveSession(session)
      setState('idle')
    } catch (err: any) {
      setErrorMsg(err.message || 'Transcription failed')
      setState('error')
    }
  }, [])

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id)
      saveSessions(updated)
      return updated
    })
    setActiveSession((prev) => (prev?.id === id ? null : prev))
  }, [])

  const downloadTranscript = useCallback((session: Session) => {
    const content = [
      `VoxScribe Transcript`,
      `─────────────────────────────────`,
      `Title: ${session.title}`,
      `Date:  ${new Date(session.date).toLocaleString()}`,
      `Duration: ${Math.round(session.totalDuration / 1000)}s`,
      ``,
      `TRANSCRIPT`,
      `─────────────────────────────────`,
      session.fullText,
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `voxscribe-${session.id.slice(0, 8)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const formatElapsed = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return {
    state,
    sessions,
    activeSession,
    setActiveSession,
    audioLevel,
    elapsed,
    elapsedFormatted: formatElapsed(elapsed),
    errorMsg,
    startRecording,
    stopRecording,
    deleteSession,
    downloadTranscript,
  }
}
