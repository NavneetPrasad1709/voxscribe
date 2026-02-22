import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Zap, Shield, FileText, Mic2 } from 'lucide-react'
import Navbar from '../components/Navbar'

gsap.registerPlugin(ScrollTrigger)

const FEATS = [
  { n: '01', icon: <Zap size={20} strokeWidth={1.5} />, title: 'Instant', body: 'Groq Whisper transcribes in under 2 seconds — the fastest AI transcription on the planet.' },
  { n: '02', icon: <Shield size={20} strokeWidth={1.5} />, title: 'Private', body: 'Sessions never leave your device. 100% local storage. Zero cloud. Zero compromise.' },
  { n: '03', icon: <FileText size={20} strokeWidth={1.5} />, title: 'Exportable', body: 'One click to a clean .txt file with metadata. Drop it anywhere, instantly.' },
  { n: '04', icon: <Mic2 size={20} strokeWidth={1.5} />, title: 'Precise', body: 'Handles 97+ languages, accents, and technical vocabulary with studio-grade accuracy.' },
]

const STATS = [
  { v: '<2s',  l: 'Transcription time' },
  { v: '99%',  l: 'Word accuracy' },
  { v: '97+',  l: 'Languages' },
]

export default function LandingPage() {
  const { isSignedIn } = useAuth()
  const dest = isSignedIn ? '/studio' : '/sign-up'

  const eyeRef    = useRef<HTMLDivElement>(null)
  const line1Ref  = useRef<HTMLDivElement>(null)
  const line2Ref  = useRef<HTMLDivElement>(null)
  const line3Ref  = useRef<HTMLDivElement>(null)
  const subRef    = useRef<HTMLParagraphElement>(null)
  const ctaRef    = useRef<HTMLDivElement>(null)
  const statsRef  = useRef<HTMLDivElement>(null)
  const featsRef  = useRef<HTMLDivElement>(null)
  const howRef    = useRef<HTMLDivElement>(null)
  const ctaSecRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.fromTo(eyeRef.current,  { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo(line1Ref.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, '-=0.4')
      .fromTo(line2Ref.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, '-=0.72')
      .fromTo(line3Ref.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, '-=0.72')
      .fromTo(subRef.current,   { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
      .fromTo(ctaRef.current,   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
      .fromTo(statsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.35')

    // Feature cards scroll
    if (featsRef.current) {
      const cards = featsRef.current.querySelectorAll('.feat-card')
      gsap.fromTo(cards, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: featsRef.current, start: 'top 78%' },
      })
    }
    // How-it-works steps
    if (howRef.current) {
      const steps = howRef.current.querySelectorAll('.how-step')
      gsap.fromTo(steps, { x: -30, opacity: 0 }, {
        x: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: howRef.current, start: 'top 80%' },
      })
    }
    // CTA section
    gsap.fromTo(ctaSecRef.current, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: ctaSecRef.current, start: 'top 82%' },
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div style={{ background: 'var(--c0)', minHeight: '100vh' }}>
      <Navbar />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 1.5rem 6rem',
        overflow: 'hidden',
      }}>
        {/* Background canvas */}
        <div className="hero-canvas">
          <div className="bloom-gold" />
          <div className="hero-dots" />
          <div className="hero-rule" />
          {/* Diagonal decorative lines */}
          <div style={{
            position: 'absolute', top: 0, left: '-10%', right: '-10%', bottom: 0,
            background: 'repeating-linear-gradient(105deg, transparent 0px, transparent 120px, var(--wire0) 120px, var(--wire0) 121px)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Eyebrow */}
        <div ref={eyeRef} style={{ opacity: 0, marginBottom: '2.5rem', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '0.35rem 1rem',
            background: 'var(--violet-dim)',
            border: '1px solid rgba(232,184,75,0.2)',
            borderRadius: '2px',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--jade)' }} />
            <span className="type-label" style={{ color: 'var(--violet)' }}>
              Groq × Whisper large-v3 - by- Navneet Prasad
            </span>
          </div>
        </div>

        {/* ── MEGA TITLE — the Wix Studio moment ── */}
        <div style={{ position: 'relative', marginBottom: '2rem', overflow: 'hidden' }}>
          {/* Line 1 — filled */}
          <div ref={line1Ref} style={{ opacity: 0, overflow: 'hidden' }}>
            <div className="type-mega" style={{ color: 'var(--ink1)', lineHeight: 0.88 }}>
              Real-Time Voice
            </div>
          </div>
          {/* Line 2 — outline style (Wix Studio signature) */}
          <div ref={line2Ref} style={{ opacity: 0, overflow: 'hidden' }}>
            <div className="type-mega text-outline" style={{ lineHeight: 0.88 }}>
              Transcription
            </div>
          </div>
          {/* Line 3 — gold gradient */}
          <div ref={line3Ref} style={{ opacity: 0, overflow: 'hidden' }}>
            <div className="type-mega text-violet" style={{ lineHeight: 0.95 }}>
              Powered by AI.
            </div>
          </div>
        </div>

        {/* Sub */}
        <p
          ref={subRef}
          style={{
            opacity: 0,
            fontFamily: 'Inter, sans-serif', fontSize: '1.08rem',
            color: 'var(--ink2)', lineHeight: 1.82,
            maxWidth: 460, marginBottom: '2.75rem', position: 'relative',
          }}
        >
          Speak naturally. Stop. Watch studio-grade transcriptions appear in under two seconds — beautiful, precise, and always ready to export.
        </p>

        {/* CTA */}
        <div ref={ctaRef} style={{
          opacity: 0, position: 'relative',
          display: 'flex', flexWrap: 'wrap', gap: '0.85rem', justifyContent: 'center',
          marginBottom: '5rem',
        }}>
          <Link to={dest} className="btn-gold">
            Start recording free <ArrowRight size={15} />
          </Link>
          {!isSignedIn && (
            <Link to="/sign-in" className="btn-wire">Sign in</Link>
          )}
        </div>

        {/* Stats */}
        <div ref={statsRef} style={{
          opacity: 0, position: 'relative',
          display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center',
        }}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-box">
              <div className="type-giant text-violet" style={{ fontSize: 'clamp(2rem,5vw,3rem)', lineHeight: 1 }}>
                {s.v}
              </div>
              <div className="type-label" style={{ color: 'var(--ink3)', marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section style={{ padding: '7rem 1.5rem', maxWidth: 1160, margin: '0 auto' }}>
        {/* Section header — asymmetric Wix-style */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div>
            <p className="type-label" style={{ color: 'var(--violet)', marginBottom: '0.75rem' }}>Why VoxScribe</p>
            <h2 className="type-display" style={{ color: 'var(--ink1)' }}>
              Built for the way<br />
              <em style={{ fontStyle: 'italic', color: 'var(--ink2)' }}>you actually work.</em>
            </h2>
          </div>
          <p style={{ fontFamily: 'Inter', fontSize: '0.9rem', color: 'var(--ink3)', maxWidth: 280, lineHeight: 1.75 }}>
            No subscriptions. No cloud lock-in. Just pure transcription power at your fingertips.
          </p>
        </div>

        <div ref={featsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', background: 'var(--wire1)', border: '1px solid var(--wire1)' }}>
          {FEATS.map((f, i) => (
            <div key={i} className="feat-card" style={{ opacity: 0 }}>
              <span className="feat-num">{f.n}</span>
              <div style={{
                width: 44, height: 44,
                background: 'var(--violet-dim)',
                border: '1px solid rgba(232,184,75,0.18)',
                borderRadius: '2px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--violet)', marginBottom: '1.25rem',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '1.25rem', color: 'var(--ink1)', marginBottom: '0.7rem', fontWeight: 400 }}>
                {f.title}
              </h3>
              <p style={{ fontFamily: 'Inter', fontSize: '0.88rem', color: 'var(--ink2)', lineHeight: 1.75 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS — editorial numbered list
      ══════════════════════════════════════════ */}
      <section style={{ padding: '5rem 1.5rem 7rem', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="type-label" style={{ color: 'var(--violet)', marginBottom: '0.75rem' }}>The process</p>
          <h2 className="type-display" style={{ color: 'var(--ink1)' }}>Three steps to clarity.</h2>
        </div>

        <div ref={howRef} style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { n: '01', t: 'Press record',   d: 'Tap the violet button and allow microphone access once. That\'s it.' },
            { n: '02', t: 'Speak freely',   d: 'Talk at natural pace. The waveform pulses as it listens to every word.' },
            { n: '03', t: 'Read & export',  d: 'Your full transcript appears the moment you stop. Download or copy in one tap.' },
          ].map((step, i) => (
            <div key={i} className="how-step" style={{
              display: 'flex', alignItems: 'flex-start', gap: '2rem',
              padding: '2rem 0',
              borderBottom: i < 2 ? '1px solid var(--wire1)' : 'none',
              opacity: 0,
            }}>
              {/* Big number */}
              <div style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 'clamp(3rem, 7vw, 5rem)',
                lineHeight: 1,
                color: i === 0 ? 'var(--violet)' : 'var(--wire2)',
                flexShrink: 0, minWidth: 80,
                transition: 'color 0.3s ease',
              }}>
                {step.n}
              </div>
              <div>
                <h3 className="type-title" style={{ color: 'var(--ink1)', marginBottom: '0.5rem' }}>{step.t}</h3>
                <p style={{ fontFamily: 'Inter', fontSize: '0.92rem', color: 'var(--ink2)', lineHeight: 1.78 }}>{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════ */}
      <section style={{ padding: '0 1.5rem 8rem' }}>
        <div ref={ctaSecRef} style={{
          maxWidth: 900,
          margin: '0 auto',
          background: 'var(--c1)',
          border: '1px solid var(--wire1)',
          borderTop: '3px solid var(--violet)',
          padding: 'clamp(3rem, 7vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          gap: '2rem',
          opacity: 0,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative big text in BG */}
          <div style={{
            position: 'absolute', right: '-2rem', top: '50%', transform: 'translateY(-50%)',
            fontFamily: '"Space Grotesk",sans-serif', fontSize: 'clamp(6rem,14vw,11rem)',
            color: 'var(--wire0)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
          }}>VOX</div>

          <div>
            <p className="type-label" style={{ color: 'var(--violet)', marginBottom: '1rem' }}>Get started</p>
            <h2 className="type-display" style={{ color: 'var(--ink1)', maxWidth: 420 }}>
              Ready to hear yourself clearly?
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Link to={dest} className="btn-gold">
              Open Studio <ArrowRight size={15} />
            </Link>
            <p style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: 'var(--ink3)' }}>
              Free forever · No credit card needed
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER — Navneet signature
      ══════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid var(--wire1)' }}>
        <div style={{
          maxWidth: 1160, margin: '0 auto',
          padding: '1.5rem 2rem',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
        }}>
          <span className="type-display" style={{ fontSize: '1.5rem', color: 'var(--ink3)' }}>VoxScribe</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <span className="type-label" style={{ color: 'var(--ink4)' }}>© {new Date().getFullYear()} VoxScribe</span>
            <span className="type-mono" style={{ color: 'var(--violet)', letterSpacing: '0.16em' }}>
              Crafted with 💖 by Navneet
            </span>
          </div>
        </div>
        {/* Navneet violet strip */}
        <div className="navneet-strip">
          <span className="type-mono" style={{ color: 'var(--violet)', fontSize: '0.6rem', letterSpacing: '0.25em' }}>
            NAVNEET · VOXSCRIBE · {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  )
}
