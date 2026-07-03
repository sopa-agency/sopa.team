import { useSyncExternalStore, useCallback } from 'react'
import type { Route } from './data'

const VALID: Route[] = ['home', 'pessoas', 'perfil', 'feed', 'projetos', 'capacidades', 'contato', 'post']

export type Location = { route: Route; param?: string }

let cachedPath: string | null = null
let cachedLoc: Location = { route: 'home' }

function parse(): Location {
  const path = window.location.pathname
  if (path === cachedPath) return cachedLoc // stable snapshot for useSyncExternalStore
  const [seg, param] = path.replace(/^\/+|\/+$/g, '').split('/')
  const route = (VALID.includes(seg as Route) ? seg : 'home') as Route
  cachedPath = path
  cachedLoc = { route, param: param || undefined }
  return cachedLoc
}

// pushState/replaceState don't emit events, so navigate() dispatches this
const NAV_EVENT = 'sopa:navigate'

function subscribe(cb: () => void) {
  window.addEventListener('popstate', cb) // browser back/forward
  window.addEventListener(NAV_EVENT, cb) // programmatic navigate()
  return () => {
    window.removeEventListener('popstate', cb)
    window.removeEventListener(NAV_EVENT, cb)
  }
}

export function useLocation(): Location {
  return useSyncExternalStore(subscribe, parse, parse)
}

/** Canonical path for a route: home is the root, others are /segment[/param]. */
export function href(route: Route, param?: string): string {
  if (route === 'home') return '/'
  return '/' + route + (param ? '/' + param : '')
}

export function navigate(route: Route, param?: string) {
  const path = href(route, param)
  if (window.location.pathname === path) return
  window.history.pushState(null, '', path)
  window.dispatchEvent(new Event(NAV_EVENT))
  window.scrollTo(0, 0)
}

/** Returns an onClick that intercepts clicks on [data-route] descendants. */
export function useRouteDelegate() {
  return useCallback((e: React.MouseEvent) => {
    // let modified clicks (open-in-new-tab, etc.) behave natively
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    const el = (e.target as HTMLElement)?.closest?.('[data-route]') as HTMLElement | null
    if (!el) return
    e.preventDefault()
    const route = el.getAttribute('data-route') as Route | null
    const param = el.getAttribute('data-param') || undefined
    if (route) navigate(route, param)
  }, [])
}
