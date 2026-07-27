import type { ReactNode } from 'react'
import { NAV, PEOPLE } from '../data'
import { Avatar } from './ui'
import type { Route } from '../data'
import { navigate, useRouteDelegate, href } from '../router'
import { useTheme, cycleTheme, themeLabel } from '../theme'

/**
 * The half-moon in the footer meta of every page. Clicking it cycles the theme
 * — this is the theme control that stays reachable on mobile, where the sidebar
 * sysbox is hidden.
 */
export function ThemeDot() {
  const theme = useTheme()
  return (
    <button
      type="button"
      className="theme-dot"
      onClick={cycleTheme}
      title={`tema: ${themeLabel(theme)} — clique pra trocar`}
      aria-label={`trocar tema (atual: ${themeLabel(theme)})`}
    >
      ◐
    </button>
  )
}

function Chrome({ path, meta, bottom }: { path: string; meta: ReactNode; bottom?: boolean }) {
  return (
    <div className={'chrome ' + (bottom ? 'bottom' : 'top')}>
      <div className="brand">
        {!bottom && <span className="dot" />}
        {!bottom && <span className="brand-name">SOPA</span>}
        {bottom ? (
          <span className="brand-path">{path}</span>
        ) : (
          <span className="brand-path">
            <span className="brand-sub">— studio.tui · </span>
            {path}
          </span>
        )}
      </div>
      <div className="meta">{meta}</div>
    </div>
  )
}

/** Diretório em ordem alfabética — a de PEOPLE é curatorial (ordem do arquivo
 *  de overrides), que não ajuda quem procura um nome na lista. */
const ROSTER = [...PEOPLE].sort((a, b) => a.handle.localeCompare(b.handle, 'pt-BR'))

function Sidebar({
  active,
  leaf,
  status,
}: {
  active: Route
  leaf?: { parent: Route; label: string }
  status?: ReactNode
}) {
  const theme = useTheme()
  return (
    <div className="sidebar">
      <div className="root">
        ▾ <b>sopa/</b>
      </div>
      <div className="tree">
        {NAV.map((n) => {
          if (leaf && leaf.parent === n.route) {
            return (
              <div key={n.route}>
                <div className="child">
                  ▾ {n.label} {n.count && <span className="count">{n.count}</span>}
                </div>
                {/* dentro de um perfil o galho abre o diretório inteiro, em ordem
                    alfabética — dá pra pular de pessoa em pessoa sem voltar */}
                {n.route === 'pessoas'
                  ? ROSTER.map((p) => {
                      const slug = p.handle.slice(1)
                      return (
                        <a
                          key={p.handle}
                          className={'leaf' + (leaf.label === p.handle ? ' on' : '')}
                          data-route="perfil"
                          data-param={slug}
                          href={href('perfil', slug)}
                        >
                          <Avatar src={p.avatarUrl} initials={p.initials} size={17} />
                          {slug}
                        </a>
                      )
                    })
                  : <div className="leaf on">· {leaf.label}</div>}
              </div>
            )
          }
          return (
            <a
              key={n.route}
              className={active === n.route ? 'active' : undefined}
              data-route={n.route}
              href={href(n.route)}
            >
              ▸ {n.label} {n.count && <span className="count">{n.count}</span>}
            </a>
          )
        })}
      </div>
      <div className="sysbox">
        <div>PT/EN ⇄</div>
        <button type="button" className="theme-line" onClick={cycleTheme}>
          ◑ tema: {themeLabel(theme)}
        </button>
      </div>
      {status && <div className="status">{status}</div>}
    </div>
  )
}

export function Frame({
  active,
  path,
  footerLabel,
  footerMeta,
  rail,
  railWide,
  leaf,
  sidebarStatus,
  bare,
  children,
}: {
  active: Route
  path: string
  footerLabel: string
  footerMeta: ReactNode
  rail?: ReactNode
  railWide?: boolean
  leaf?: { parent: Route; label: string }
  sidebarStatus?: ReactNode
  bare?: boolean
  children: ReactNode
}) {
  const onClick = useRouteDelegate()
  const topMeta =
    active === 'home' ? (
      <>
        <span>
          <span className="on">●</span> {PEOPLE.length} no coletivo
        </span>
        <span>PT/EN</span>
        <span>◐</span>
      </>
    ) : null

  return (
    <div className="shell-scroll" onClick={onClick}>
      <div className="shell">
        <Chrome path={path} meta={topMeta} />
        <div className={'layout' + (rail ? (railWide ? ' rail-wide' : ' has-rail') : '')}>
          <Sidebar active={active} leaf={leaf} status={sidebarStatus} />
          {bare ? <div style={{ minWidth: 0 }}>{children}</div> : <div className="main">{children}</div>}
          {rail && <div className="rail">{rail}</div>}
        </div>
        <Chrome path={footerLabel} meta={footerMeta} bottom />
      </div>
    </div>
  )
}

export { navigate }
