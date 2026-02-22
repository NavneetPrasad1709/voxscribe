import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { Download, Trash2, Copy, Check, ChevronLeft, ChevronRight, Mic, Menu, X } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import Navbar from '../components/Navbar'
import RecordButton from '../components/RecordButton'
import Waveform from '../components/Waveform'
import SessionCard from '../components/SessionCard'
import { useTranscription } from '../hooks/useTranscription'

export default function StudioPage() {
  const { user } = useUser()
  const tx = useTranscription()
  const [copied, setCopied] = useState(false)
  const [sideOpen, setSideOpen] = useState(true)
  const [mobOpen, setMobOpen] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(topRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3 })
    tl.fromTo(barRef.current, { opacity: 0, y: 16  }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
  }, [])

  const copy = async () => {
    if (!tx.activeSession) return
    await navigator.clipboard.writeText(tx.activeSession.fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const words = tx.activeSession?.fullText.trim().split(/\s+/).filter(Boolean).length ?? 0
  const statusLabel = {
    idle:       tx.sessions.length === 0 ? 'Ready to record' : 'Ready',
    recording:  'Listening…',
    processing: 'Transcribing…',
    error:      tx.errorMsg || 'Something went wrong',
  }[tx.state]

  return (
    <div style={{ background: 'var(--c0)', minHeight: '100vh' }}>
      <Navbar />

      <div className="studio-wrap">

        {/* ── SIDEBAR ── */}
        <div className={`studio-side ${sideOpen ? '' : 'shut'} ${mobOpen ? 'open' : ''}`}>
          <div style={{ width: 264, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Sidebar header */}
            <div style={{ padding: '1.1rem 1rem 0.9rem', borderBottom: '1px solid var(--wire1)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p className="type-label" style={{ color: 'var(--violet)' }}>Sessions</p>
                  <p className="type-mono" style={{ color: 'var(--ink3)', marginTop: 2 }}>
                    {user?.firstName ? `${user.firstName}'s` : 'Your'} recordings · {tx.sessions.length}
                  </p>
                </div>
                {/* Mobile close */}
                <button className="btn-sq" onClick={() => setMobOpen(false)}
                  style={{ display: 'none' }} id="mob-side-close">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.7rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {tx.sessions.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '0.8rem', opacity: 0.55 }}>
                  <div style={{ width: 44, height: 44, background: 'var(--c4)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mic size={18} color="var(--ink3)" />
                  </div>
                  <p className="type-mono" style={{ color: 'var(--ink3)', textAlign: 'center', lineHeight: 1.5 }}>No recordings yet.<br />Hit record below.</p>
                </div>
              ) : (
                tx.sessions.map((s, i) => (
                  <SessionCard key={s.id} session={s}
                    isActive={tx.activeSession?.id === s.id}
                    onSelect={() => { tx.setActiveSession(s); setMobOpen(false) }}
                    onDownload={() => tx.downloadTranscript(s)}
                    onDelete={() => tx.deleteSession(s.id)}
                    index={i}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobOpen && (
            <motion.div onClick={() => setMobOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            />
          )}
        </AnimatePresence>

        {/* ── MAIN ── */}
        <div className="studio-body">

          {/* Top bar */}
          <div ref={topRef} style={{
            opacity: 0,
            height: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 1.75rem',
            borderBottom: '1px solid var(--wire1)',
            flexShrink: 0, gap: '1rem',
          }}>
            {/* Left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
              {/* Desktop sidebar toggle */}
              <button className="btn-sq desktop-tog" onClick={() => setSideOpen(p => !p)} title="Toggle sidebar">
                {sideOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>
              {/* Mobile sidebar toggle */}
              <button className="btn-sq mob-tog" onClick={() => setMobOpen(true)} title="Sessions">
                <Menu size={14} />
              </button>

              <div style={{ minWidth: 0 }}>
                <h1 style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '1.05rem', fontWeight: 700,
                  color: 'var(--ink1)', lineHeight: 1.1,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {tx.activeSession ? tx.activeSession.title : 'Studio'}
                </h1>
                <p className="type-mono" style={{ color: 'var(--ink3)', marginTop: 1 }}>
                  {tx.activeSession ? `${words} words` : 'Voice transcription workspace'}
                </p>
              </div>
            </div>

            {/* Right actions */}
            <AnimatePresence>
              {tx.activeSession && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
                >
                  {[
                    { icon: copied ? <Check size={13}/> : <Copy size={13}/>, fn: copy, title: copied ? 'Copied!' : 'Copy', activeC: copied ? 'var(--jade)' : undefined },
                    { icon: <Download size={13}/>, fn: () => tx.downloadTranscript(tx.activeSession!), title: 'Download' },
                    { icon: <Trash2 size={13}/>,   fn: () => tx.deleteSession(tx.activeSession!.id),  title: 'Delete', danger: true },
                  ].map(({ icon, fn, title, activeC, danger }) => (
                    <button key={title} className="btn-sq" onClick={fn} title={title}
                      style={activeC ? { color: activeC, borderColor: activeC } : danger ? { color: 'var(--ruby)' } : {}}>
                      {icon}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Transcript scroll */}
          <div className="studio-scroll">
            <AnimatePresence mode="wait">
              {tx.activeSession ? (
                <motion.div key={tx.activeSession.id}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.38, ease: [0.25,0.46,0.45,0.94] }}
                >
                  {/* Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.25rem' }}>
                    {[
                      new Date(tx.activeSession.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      `${words} words`,
                      `${Math.round(tx.activeSession.totalDuration / 1000)}s`,
                    ].map(l => <span key={l} className="chip">{l}</span>)}
                  </div>
                  {/* Title */}
                  <h2 style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 400, color: 'var(--ink1)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                    {tx.activeSession.title}
                  </h2>
                  <p className="transcript-text">{tx.activeSession.fullText}</p>
                </motion.div>
              ) : (
                <motion.div key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '50vh', textAlign: 'center', gap: '1.25rem' }}
                >
                  {/* Big decorative Bebas text */}
                  <div style={{
                    fontFamily: '"Space Grotesk",sans-serif', fontSize: 'clamp(5rem,15vw,10rem)',
                    color: 'var(--wire1)', lineHeight: 1,
                    userSelect: 'none', pointerEvents: 'none',
                  }}>
                    SPEAK
                  </div>
                  <p className="type-title" style={{ color: 'var(--ink3)', fontSize: '1.1rem' }}>
                    Nothing recorded yet
                  </p>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: 'var(--ink4)', maxWidth: 280, lineHeight: 1.7 }}>
                    Press the violet button below and start speaking. Your transcript appears instantly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RECORDING BAR ── */}
          <div ref={barRef} className="studio-bar" style={{ opacity: 0 }}>
            <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              {/* Waveform */}
              <div className={`wave-wrap ${tx.state === 'recording' ? 'live' : ''}`}>
                <Waveform isActive={tx.state === 'recording'} audioLevel={tx.audioLevel} />
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem' }}>

                {/* Timer */}
                <div style={{ width: 90, textAlign: 'right' }}>
                  <AnimatePresence mode="wait">
                    {tx.state === 'recording' && (
                      <motion.div key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                        <div className="dot-live" />
                        <span className="type-mono" style={{ color: 'var(--ink1)', fontWeight: 500, fontSize: '0.8rem' }}>
                          {tx.elapsedFormatted}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Big violet button */}
                <RecordButton state={tx.state} onStart={tx.startRecording} onStop={tx.stopRecording} />

                {/* Status */}
                <div style={{ width: 90 }}>
                  <AnimatePresence mode="wait">
                    <motion.div key={tx.state}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {tx.state === 'processing' ? (
                        <div style={{ display: 'flex', gap: 5 }}>
                          {[1,2,3].map(i => (
                            <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--violet)' }} className={`d${i}`} />
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: tx.state === 'error' ? 'var(--ruby)' : 'var(--ink3)', lineHeight: 1.4 }}>
                          {statusLabel}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Hint */}
              <p className="type-mono" style={{ textAlign: 'center', color: 'var(--ink4)', fontSize: '0.62rem', letterSpacing: '0.18em', opacity: tx.state === 'idle' ? 1 : 0, transition: 'opacity 0.3s' }}>
                TAP THE BUTTON TO BEGIN · CRAFTED BY NAVNEET
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive toggle visibility */}
      <style>{`
        @media (min-width: 769px) { .mob-tog { display: none !important; } }
        @media (max-width: 768px) { .desktop-tog { display: none !important; } .studio-side.open { transform: translateX(0) !important; box-shadow: var(--sh3); } }
      `}</style>
    </div>
  )
}
