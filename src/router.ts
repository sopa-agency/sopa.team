import { useSyncExternalStore, useCallback } from 'react'
import type { Route } from './data'

const VALID: Route[] = ['home', 'pessoas', 'perfil', 'feed', 'projetos', 'capacidades', 'contato', 'post']

export type Location = { route: Route; param?: string }

let cachedHash: string | null = null
let cachedLoc: Location = { route: 'home' }

function parse(): Location {
  const hash = window.location.hash
  if (hash === cachedHash) return cachedLoc // stable snapshot for useSyncExternalStore
  const raw = hash.replace(/^#\/?/, '')
  const [seg, param] = raw.split('/')
  const route = (VALID.includes(seg as Route) ? seg : 'home') as Route
  cachedHash = hash
  cachedLoc = { route, param: param || undefined }
  return cachedLoc
}

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export function useLocation(): Location {
  return useSyncExternalStore(subscribe, parse, parse)
}

export function navigate(route: Route, param?: string) {
  const hash = '#/' + route + (param ? '/' + param : '')
  if (window.location.hash === hash) return
  window.location.hash = hash
  window.scrollTo(0, 0)
}

/** Returns an onClick that intercepts clicks on [data-route] descendants. */
export function useRouteDelegate() {
  return useCallback((e: React.MouseEvent) => {
    const el = (e.target as HTMLElement)?.closest?.('[data-route]') as HTMLElement | null
    if (!el) return
    e.preventDefault()
    const route = el.getAttribute('data-route') as Route | null
    const param = el.getAttribute('data-param') || undefined
    if (route) navigate(route, param)
  }, [])
}
