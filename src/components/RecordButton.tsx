import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square } from 'lucide-react'

interface Props {
  state: 'idle' | 'recording' | 'processing' | 'error'
  onStart: () => void
  onStop: () => void
}

function Spinner() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="spin">
      <circle cx="15" cy="15" r="12" stroke="var(--wire2)" strokeWidth="2.5" />
      <path d="M15 3 A12 12 0 0 1 27 15" stroke="var(--ink2)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

const iconVar = {
  initial: { opacity: 0, scale: 0.4, rotate: -15 },
  animate: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring' as const, stiffness: 420, damping: 20 } },
  exit:    { opacity: 0, scale: 0.4, rotate: 15, transition: { duration: 0.15 } },
}

export default function RecordButton({ state, onStart, onStop }: Props) {
  const rec  = state === 'recording'
  const busy = state === 'processing'
  const onClick = () => { if (!busy) rec ? onStop() : onStart() }

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Pulse rings when recording */}
      <AnimatePresence>
        {rec && (
          <>
            {[0, 0.65].map((delay, i) => (
              <motion.div key={i}
                style={{
                  position: 'absolute', inset: 0,
                  borderRadius: '50%',
                  border: '2px solid var(--ruby)',
                }}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.3, opacity: 0 }}
                transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut', delay }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.button
        onClick={onClick}
        disabled={busy}
        className={`rec-btn ${rec ? 'rec-active' : busy ? 'rec-busy' : 'rec-idle'}`}
        whileHover={busy ? {} : { scale: 1.08 }}
        whileTap={busy ? {} : { scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 440, damping: 22 }}
        aria-label={rec ? 'Stop' : 'Start recording'}
      >
        <AnimatePresence mode="wait">
          {busy ? (
            <motion.div key="spin" {...iconVar}><Spinner /></motion.div>
          ) : rec ? (
            <motion.div key="stop" {...iconVar}>
              <Square size={28} fill="white" color="white" strokeWidth={0} style={{ borderRadius: 3 }} />
            </motion.div>
          ) : (
            <motion.div key="mic" {...iconVar}>
              <Mic size={30} color="#0b0b0e" strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
