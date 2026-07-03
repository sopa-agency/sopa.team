import { useEffect, useRef, useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'

/**
 * Minimal single-select facet dropdown (no deps). Selecting the active option
 * again — or "limpar" — clears it. Closes on outside click / Escape.
 */
export function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string | null
  options: string[]
  onChange: (v: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const active = value != null
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        className={'pill' + (active ? ' on' : '')}
        onClick={() => setOpen((o) => !o)}
        style={{ padding: '3px 9px', cursor: 'pointer', font: 'inherit', fontSize: 11, color: active ? undefined : 'var(--muted)' }}
      >
        {active ? value : label} ▿
      </button>
      {open && (
        <div className="dropdown-menu" role="listbox">
          {active && (
            <div
              className="dropdown-item"
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
              style={{ color: 'var(--faint)' }}
            >
              × limpar
            </div>
          )}
          {options.map((o) => (
            <div
              key={o}
              className="dropdown-item"
              role="option"
              aria-selected={o === value}
              onClick={() => {
                onChange(o === value ? null : o)
                setOpen(false)
              }}
              style={{ color: o === value ? 'var(--ink-strong)' : 'var(--ink)' }}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Panel({
  tag,
  children,
  tight,
  accent,
  style,
}: {
  tag: string
  children: ReactNode
  tight?: boolean
  accent?: boolean
  style?: CSSProperties
}) {
  return (
    <div className={'panel' + (tight ? ' tight' : '') + (accent ? ' accent' : '')} style={style}>
      <span className="tag">{tag}</span>
      {children}
    </div>
  )
}

/** hatched image placeholder */
export function Hatch({
  ratio,
  label,
  style,
  large,
}: {
  ratio: string
  label?: string
  style?: CSSProperties
  large?: boolean
}) {
  return (
    <div
      className={'ph ' + (large ? 'hatch-lg' : 'hatch')}
      style={{ aspectRatio: ratio, border: '1px solid var(--line-soft)', ...style }}
    >
      {label && <span style={{ fontSize: 10.5, color: 'var(--faint)' }}>{label}</span>}
    </div>
  )
}

export function KeyVals({ rows }: { rows: [string, string | number][] }) {
  return (
    <div style={{ fontSize: 11.5, lineHeight: 1.95, color: 'var(--body)' }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{k}</span>
          <span style={{ color: 'var(--faint)' }}>{v}</span>
        </div>
      ))}
    </div>
  )
}
