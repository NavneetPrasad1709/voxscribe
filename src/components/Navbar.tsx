import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth, UserButton } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { Menu, X } from 'lucide-react'
import { useTheme } from '../lib/ThemeContext'

export default function Navbar() {
  const { isSignedIn } = useAuth()
  const { toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const ref = useRef<HTMLElement>(null)
  const [filled, setFilled] = useState(false)
  const [mob, setMob] = useState(false)

  useEffect(() => {
    gsap.fromTo(ref.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power4.out', delay: 0.1 }
    )
    const fn = () => setFilled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const isStudio = location.pathname === '/studio'

  return (
    <>
      <nav ref={ref} className={`nav-root ${filled ? 'filled' : ''}`} style={{ opacity: 0 }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Mark */}
          <div style={{
            width: 34, height: 34,
            background: 'var(--violet)',
            borderRadius: '2px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="6" width="2.2" height="4" rx="1.1" fill="#0b0b0e" />
              <rect x="4.6" y="3.5" width="2.2" height="9" rx="1.1" fill="#0b0b0e" />
              <rect x="8.2" y="5" width="2.2" height="6" rx="1.1" fill="#0b0b0e" />
              <rect x="11.8" y="4" width="2.2" height="8" rx="1.1" fill="#0b0b0e" />
            </svg>
          </div>
          <div>
            <div style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '1rem', fontWeight: 700,
              color: 'var(--ink1)', lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}>VoxScribe</div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.55rem', color: 'var(--violet)',
              letterSpacing: '0.18em', textTransform: 'uppercase',
            }}>by Navneet</div>
          </div>
        </Link>

        {/* ── Desktop right ── */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme toggle */}
          <button className="theme-pill" onClick={toggle} aria-label="Toggle theme">
            <span className="t-icon t-moon">🌙</span>
            <span className="t-icon t-sun">☀️</span>
          </button>

          {isSignedIn ? (
            <>
              {!isStudio && (
                <button onClick={() => navigate('/studio')} className="btn-wire" style={{ padding: '0.5rem 1.2rem', fontSize: '0.72rem' }}>
                  Studio
                </button>
              )}
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link to="/sign-in" className="btn-wire" style={{ padding: '0.5rem 1.2rem', fontSize: '0.72rem' }}>Sign in</Link>
              <Link to="/sign-up" className="btn-gold" style={{ padding: '0.6rem 1.4rem', fontSize: '0.72rem' }}>Get started</Link>
            </>
          )}
        </div>

        {/* ── Mobile right ── */}
        <div className="flex sm:hidden items-center gap-2">
          <button className="theme-pill" onClick={toggle} aria-label="Toggle theme">
            <span className="t-icon t-moon">🌙</span>
            <span className="t-icon t-sun">☀️</span>
          </button>
          <button className="btn-sq" onClick={() => setMob(p => !p)} aria-label="Menu">
            {mob ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mob && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 190,
              background: 'var(--c1)', borderBottom: '1px solid var(--wire1)',
              padding: '1rem 1.25rem 1.5rem',
              display: 'flex', flexDirection: 'column', gap: '0.6rem',
            }}
          >
            {isSignedIn ? (
              <Link to="/studio" className="btn-gold" style={{ justifyContent: 'center' }} onClick={() => setMob(false)}>Studio</Link>
            ) : (
              <>
                <Link to="/sign-in" className="btn-wire" style={{ justifyContent: 'center' }} onClick={() => setMob(false)}>Sign in</Link>
                <Link to="/sign-up" className="btn-gold" style={{ justifyContent: 'center' }} onClick={() => setMob(false)}>Get started</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
