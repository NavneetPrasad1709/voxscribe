import { SignUp } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../lib/ThemeContext'

export default function SignUpPage() {
  const { toggle } = useTheme()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--c0)', display: 'flex', flexDirection: 'column' }}>
      {/* Mini nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 2rem', borderBottom: '1px solid var(--wire0)' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 30, height: 30, background: 'var(--violet)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="6" width="2.2" height="4" rx="1.1" fill="#0b0b0e" />
              <rect x="4.6" y="3.5" width="2.2" height="9" rx="1.1" fill="#0b0b0e" />
              <rect x="8.2" y="5" width="2.2" height="6" rx="1.1" fill="#0b0b0e" />
              <rect x="11.8" y="4" width="2.2" height="8" rx="1.1" fill="#0b0b0e" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '0.9rem', color: 'var(--ink1)', lineHeight: 1 }}>VoxScribe</div>
            <div className="type-mono" style={{ color: 'var(--violet)', fontSize: '0.5rem', letterSpacing: '0.18em' }}>by Navneet</div>
          </div>
        </Link>
        <button className="theme-pill" onClick={toggle} aria-label="Toggle theme">
          <span className="t-icon t-moon">🌙</span>
          <span className="t-icon t-sun">☀️</span>
        </button>
      </div>

      {/* Bloom */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="bloom-gold" style={{ opacity: 0.25, top: -300 }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="type-display" style={{ color: 'var(--ink1)', fontSize: 'clamp(1.8rem,5vw,2.8rem)', marginBottom: '0.5rem' }}>
              Start for free
            </h1>
            <p style={{ fontFamily: 'Inter', fontSize: '0.88rem', color: 'var(--ink2)' }}>Create your VoxScribe account</p>
          </div>
          <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/studio" />
        </motion.div>
      </div>

      {/* Navneet strip */}
      <div className="navneet-strip">
        <span className="type-mono" style={{ color: 'var(--violet)', fontSize: '0.58rem', letterSpacing: '0.25em' }}>
          NAVNEET · VOXSCRIBE
        </span>
      </div>
    </div>
  )
}
