import { useRef, useEffect } from 'react'

interface Props { isActive: boolean; audioLevel?: number }

export default function Waveform({ isActive, audioLevel = 0 }: Props) {
  const cvs  = useRef<HTMLCanvasElement>(null)
  const fra  = useRef<number>(0)
  const tick = useRef(0)
  const actR = useRef(isActive)
  const lvlR = useRef(audioLevel)

  useEffect(() => { actR.current = isActive }, [isActive])
  useEffect(() => { lvlR.current = audioLevel }, [audioLevel])

  useEffect(() => {
    const c = cvs.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const dpr = devicePixelRatio || 1

    const resize = () => {
      c.width  = c.offsetWidth * dpr
      c.height = c.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(c)

    const BARS = 40

    const draw = () => {
      const W = c.offsetWidth, H = c.offsetHeight
      ctx.clearRect(0, 0, W, H)

      const bw = W / (BARS * 2 + 1)
      const gap = bw

      const dark = document.documentElement.getAttribute('data-theme') !== 'light'
      const [rC, gC, bC] = dark ? [232,184,75] : [156,106,10]

      for (let i = 0; i < BARS; i++) {
        const x = gap + i * (bw + gap)
        let sc = 0.06

        if (actR.current) {
          const t = tick.current
          sc = 0.18
            + Math.sin(t * 0.042 + i * 0.58) * 0.32
            + Math.sin(t * 0.028 + i * 0.91) * 0.16
            + Math.sin(t * 0.066 + i * 0.38) * 0.10
            + lvlR.current * 0.26
          sc = Math.max(0.05, Math.min(1, sc))
        }

        const bh = H * sc
        const y  = (H - bh) / 2
        const al = actR.current ? 0.75 + sc * 0.25 : 0.14

        const g = ctx.createLinearGradient(0, y, 0, y + bh)
        g.addColorStop(0,   `rgba(${rC},${gC},${bC},${al * 0.55})`)
        g.addColorStop(0.5, `rgba(${rC},${gC},${bC},${al})`)
        g.addColorStop(1,   `rgba(${rC},${gC},${bC},${al * 0.55})`)
        ctx.fillStyle = g

        ctx.beginPath()
        ctx.roundRect(x, y, bw, bh, Math.min(bw / 2, 2))
        ctx.fill()
      }
      tick.current++
      fra.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(fra.current); ro.disconnect() }
  }, [])

  return <canvas ref={cvs} style={{ width: '100%', height: '100%', display: 'block' }} />
}
