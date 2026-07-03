import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'amarelo' | 'matrix'

const ORDER: Theme[] = ['light', 'amarelo', 'matrix']
const KEY = 'sopa-theme'
const LABEL: Record<Theme, string> = { light: 'light', amarelo: 'amarelo', matrix: 'matrix' }

function read(): Theme {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'amarelo' || v === 'matrix') return v
  } catch {
    /* localStorage unavailable (SSR, privacy mode) — fall back to light */
  }
  return 'light'
}

let current: Theme = read()

function apply(t: Theme) {
  // light is the default declared on :root; drop the attribute so it wins cleanly
  if (t === 'light') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = t
}

// apply persisted choice before first paint
apply(current)

const listeners = new Set<() => void>()

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Subscribe to theme changes from non-React code (e.g. the canvas sim). */
export function subscribeTheme(cb: () => void) {
  return subscribe(cb)
}

export function getTheme(): Theme {
  return current
}

export function themeLabel(t: Theme = current): string {
  return LABEL[t]
}

export function cycleTheme() {
  current = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]
  apply(current)
  try {
    localStorage.setItem(KEY, current)
  } catch {
    /* ignore persistence failure */
  }
  listeners.forEach((cb) => cb())
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, getTheme)
}
