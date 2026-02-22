import { motion } from 'framer-motion'
import { Download, Trash2 } from 'lucide-react'
import { Session } from '../hooks/useTranscription'

interface Props {
  session: Session; isActive: boolean
  onSelect: () => void; onDownload: () => void; onDelete: () => void; index: number
}
function ago(d: string) {
  const s = Math.floor((Date.now() - +new Date(d)) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}
function dur(ms: number) {
  const s = Math.round(ms/1000)
  return s < 60 ? `${s}s` : `${Math.floor(s/60)}m${s%60}s`
}

export default function SessionCard({ session, isActive, onSelect, onDownload, onDelete, index }: Props) {
  const words = session.fullText.trim().split(/\s+/).filter(Boolean).length
  const pre   = session.fullText.slice(0, 85) + (session.fullText.length > 85 ? '…' : '')

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.38, ease: [0.25,0.46,0.45,0.94] }}
      onClick={onSelect}
      className={`sess-card group`}
      style={isActive ? {
        borderLeftColor: 'var(--violet)',
        background: 'color-mix(in srgb, var(--violet) 6%, var(--c2))',
        borderColor: 'rgba(232,184,75,0.22)',
      } : {}}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4, marginBottom: 6 }}>
        <p style={{ fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink1)', lineHeight: 1.3 }}>
          {session.title}
        </p>
        <div style={{ display: 'flex', gap: 2, opacity: 0, transition: 'opacity 0.15s' }} className="card-actions">
          {[
            { icon: <Download size={11} />, fn: onDownload, color: 'var(--violet)', title: 'Download' },
            { icon: <Trash2 size={11} />,   fn: onDelete,   color: 'var(--ruby)',  title: 'Delete' },
          ].map(({ icon, fn, color, title }) => (
            <button key={title} title={title}
              onClick={e => { e.stopPropagation(); fn() }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, color: 'var(--ink3)', borderRadius: 2, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = color)}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink3)')}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: 'var(--ink3)', lineHeight: 1.55, marginBottom: 8 }}>{pre}</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[ago(session.date), `${words}w`, dur(session.totalDuration)].map(l => (
          <span key={l} style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: '0.62rem', color: 'var(--ink4)' }}>{l}</span>
        ))}
      </div>
      <style>{`.sess-card:hover .card-actions { opacity: 1 !important; }`}</style>
    </motion.div>
  )
}
