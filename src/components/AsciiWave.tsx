import { useEffect, useRef } from 'react'
import { getTheme, subscribeTheme } from '../theme'
import type { Theme } from '../theme'

/**
 * Crest / trough colour pair per theme. Light uses `multiply` blend so it wants
 * dark strokes; the dark themes use `screen` blend so they want bright strokes
 * (matching the prototype variants).
 */
const PALETTE: Record<Theme, { crest: string; trough: string }> = {
  light: { crest: '150,120,0', trough: '110,95,40' },
  amarelo: { crest: '255,224,0', trough: '255,236,150' },
  matrix: { crest: '0,255,65', trough: '130,255,180' },
}

/**
 * Background ascii "water" mesh reacting to the mouse — a faithful port of the
 * prototype's initSmoke(): a shallow-water wave sim rendered as an ascii ramp.
 */
export function AsciiWave() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // read once, then live-swap on theme change without restarting the sim
    let pal = PALETTE[getTheme()]
    const unsubTheme = subscribeTheme(() => {
      pal = PALETTE[getTheme()]
    })

    const RAMP = '.,:;~=+*#%@'
    const CELL = 14
    let W = 0, H = 0, cols = 0, rows = 0
    let cur = new Float32Array(0)
    let prev = new Float32Array(0)
    let dpr = 1
    const mouse = { px: -999, py: -999 }

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = Math.max(1, W * dpr)
      canvas.height = Math.max(1, H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = '700 ' + CELL + 'px "Space Mono", ui-monospace, monospace'
      ctx.textBaseline = 'top'
      const nc = Math.ceil(W / CELL) + 1
      const nr = Math.ceil(H / CELL) + 1
      if (nc !== cols || nr !== rows) {
        cols = nc
        rows = nr
        cur = new Float32Array(cols * rows)
        prev = new Float32Array(cols * rows)
      }
    }
    resize()

    const splash = (mx: number, my: number, amp: number) => {
      const cx = mx / CELL, cy = my / CELL, r = 2
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++) {
          const gx = Math.round(cx + dx), gy = Math.round(cy + dy)
          if (gx < 1 || gy < 1 || gx >= cols - 1 || gy >= rows - 1) continue
          const d2 = dx * dx + dy * dy
          if (d2 > r * r) continue
          cur[gy * cols + gx] += amp * (1 - d2 / (r * r + 1))
        }
    }

    let lastSplash = 0
    const onMove = (e: MouseEvent) => {
      const sp = Math.hypot(e.clientX - mouse.px, e.clientY - mouse.py)
      mouse.px = e.clientX
      mouse.py = e.clientY
      const now = performance.now()
      if (now - lastSplash < 22) return
      lastSplash = now
      splash(e.clientX, e.clientY, Math.min(2.4, 0.7 + sp * 0.045))
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', resize)

    let raf = 0, tick = 0
    const step = () => {
      tick++
      if (tick % 2 === 0) {
        for (let y = 1; y < rows - 1; y++) {
          const row = y * cols
          for (let x = 1; x < cols - 1; x++) {
            const i = row + x
            const v = (cur[i - 1] + cur[i + 1] + cur[i - cols] + cur[i + cols]) / 2 - prev[i]
            prev[i] = v * 0.965
          }
        }
        const sw = cur
        cur = prev
        prev = sw
      }
      ctx.clearRect(0, 0, W, H)
      for (let y = 1; y < rows - 1; y++) {
        const row = y * cols
        for (let x = 1; x < cols - 1; x++) {
          const v = cur[row + x]
          const m = Math.abs(v)
          if (m < 0.03) continue
          const li = Math.floor(Math.min(0.999, m * 0.9) * RAMP.length)
          const a = Math.min(0.8, 0.16 + m * 0.6)
          ctx.fillStyle = v > 0
            ? 'rgba(' + pal.crest + ',' + a.toFixed(3) + ')'
            : 'rgba(' + pal.trough + ',' + (a * 0.75).toFixed(3) + ')'
          ctx.fillText(RAMP[li], x * CELL, y * CELL)
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      unsubTheme()
    }
  }, [])

  return <canvas id="sopa-smoke" ref={ref} />
}
