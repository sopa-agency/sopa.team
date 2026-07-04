import { useState } from 'react'
import { Frame, ThemeDot } from '../components/Frame'
import { Panel, Hatch, Avatar } from '../components/ui'
import { FEED, FEED_SOURCES } from '../data'
import type { FeedItem, SocialPost } from '../data'

type Filter = 'todos' | 'farcaster' | 'x' | 'instagram' | 'hive'
const FILTERS: Filter[] = ['todos', 'farcaster', 'x', 'instagram', 'hive']

function matches(item: FeedItem, f: Filter): boolean {
  if (f === 'todos') return true
  if (f === 'hive') return item.kind === 'blog'
  return item.kind === 'social' && item.source === f
}

function SocialCard({ p }: { p: SocialPost }) {
  return (
    <div style={{ border: '1px solid rgba(var(--accent-rgb), .13)', background: 'var(--panel)', padding: '16px 16px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, flex: '1 1 auto', minWidth: 0 }}>
          <Avatar src={p.person.avatarUrl} initials={p.person.initials} size={36} />
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: 12.5, color: 'var(--ink)', fontWeight: 700 }}>{p.person.handle}</span>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 3 }}>
              {p.channel && <span style={{ color: 'var(--body)' }}>{p.channel} </span>}
              {p.channel && <span style={{ color: 'var(--faint)' }}>· </span>}
              <span style={{ color: 'var(--faint)' }}>{p.time}</span>
            </div>
          </div>
        </div>
        <span style={{ border: '1px solid var(--line-strong)', color: 'var(--ink-strong)', fontSize: 9.5, padding: '2px 8px', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>
          {p.source}
        </span>
      </div>
      {p.media && <Hatch ratio={p.media.ratio} label={p.media.label} style={{ marginBottom: 11 }} />}
      <div className="display" style={{ fontSize: p.media ? 13.5 : 14.5, lineHeight: 1.55, color: 'var(--ink-body)' }}>
        {p.text}
      </div>
      <div style={{ display: 'flex', gap: 18, fontSize: 10.5, color: 'var(--muted)', marginTop: 13 }}>
        {p.stats.map((s) => (
          <span key={s}>{s}</span>
        ))}
        <span style={{ marginLeft: 'auto', color: 'var(--faint)' }}>↗</span>
      </div>
    </div>
  )
}

function BlogCard({ item }: { item: Extract<FeedItem, { kind: 'blog' }> }) {
  // only the one written post navigates; the others are teasers, not links
  const live = !!item.post
  return (
    <div
      {...(live ? { 'data-route': 'post' } : {})}
      style={{ border: '1px solid rgba(var(--accent-rgb), .16)', background: 'var(--panel)', cursor: live ? 'pointer' : 'default' }}
    >
      <div style={{ padding: '14px 16px 15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
          <span style={{ border: '1px solid var(--line-strong)', color: 'var(--ink-strong)', fontSize: 9.5, padding: '2px 8px', letterSpacing: '.08em' }}>
            hive · blog
          </span>
          <span style={{ fontSize: 10, color: 'var(--faint)' }}>{item.time}</span>
        </div>
        <div className="display" style={{ fontWeight: 800, fontSize: 19, lineHeight: 1.2, letterSpacing: '-.01em', color: 'var(--ink)' }}>
          {item.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, fontSize: 10.5, color: 'var(--muted)' }}>
          <span>
            {item.author} <span style={{ color: 'var(--faint)' }}>· {item.read}</span>
          </span>
          <span style={{ color: live ? 'var(--ink-strong)' : 'var(--faint)' }}>{live ? 'ler completo →' : 'em breve'}</span>
        </div>
      </div>
      <Hatch ratio="16/9" label={item.cover} large style={{ borderTop: '1px solid rgba(var(--accent-rgb), .12)', border: 'none' }} />
    </div>
  )
}

export function Feed() {
  const [filter, setFilter] = useState<Filter>('todos')
  const shown = FEED.filter((it) => matches(it, filter))

  const rail = (
    <>
      <Panel tag="[ fontes ]" tight>
        <div style={{ fontSize: 11.5, lineHeight: 1.95, color: 'var(--body)' }}>
          {FEED_SOURCES.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{k}</span>
              <span style={{ color: 'var(--faint)' }}>{v}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel tag="[ no coletivo agora ]" tight>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11.5, color: 'var(--body)' }}>
          {[
            ['@willdias', 'criativo'],
            ['@xvlad', 'dev · ai · web3'],
            ['@louzoshi', 'dev · comunidade'],
            ['@joaoparmagnani', 'social media'],
          ].map(([h, r]) => (
            <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--yellow)', display: 'inline-block' }} />
              {h} <span style={{ color: 'var(--faint)' }}>· {r}</span>
            </div>
          ))}
          <div style={{ color: 'var(--faint)', fontSize: 10.5, marginTop: 2 }}>+7 online</div>
        </div>
      </Panel>
      <Panel tag="[ conectar fontes ]" tight accent>
        <div className="display" style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)', lineHeight: 1.15 }}>
          Teus posts no feed, sozinhos.
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 7, lineHeight: 1.5 }}>
          liga farcaster, x, instagram e hive — a gente puxa e mantém atualizado.
        </div>
        <div data-route="contato" className="btn-yellow" style={{ fontSize: 11.5, padding: '8px 12px', textAlign: 'center', marginTop: 11, cursor: 'pointer' }}>
          conectar contas →
        </div>
      </Panel>
    </>
  )

  return (
    <Frame
      active="feed"
      path="~/feed"
      rail={rail}
      footerLabel="sopa://feed — timeline agregada"
      footerMeta={
        <>
          <span>142 posts</span>
          <span>4 fontes</span>
          <span>PT/EN</span>
          <ThemeDot />
        </>
      }
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--faint)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            // feed — timeline do coletivo
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>
            posts dos membros agregados de <span style={{ color: 'var(--ink-strong)' }}>farcaster</span>,{' '}
            <span style={{ color: 'var(--ink-strong)' }}>x</span>, <span style={{ color: 'var(--ink-strong)' }}>instagram</span> e blogs
            na <span style={{ color: 'var(--ink-strong)' }}>hive</span> — clica num bloco de blog pra ler completo.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
          {FILTERS.map((f) => {
            const on = f === filter
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={'pill' + (on ? ' on' : '')}
                style={{ fontSize: 10.5, padding: '4px 11px', cursor: 'pointer', font: 'inherit', color: on ? undefined : 'var(--muted)', borderColor: on ? undefined : 'var(--line)' }}
              >
                {f}
              </button>
            )
          })}
          {filter !== 'todos' && (
            <span style={{ fontSize: 10.5, color: 'var(--faint)', marginLeft: 2 }}>
              {shown.length} de {FEED.length}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
          {shown.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--faint)', padding: '24px 0' }}>nenhum post nessa fonte ainda.</div>
          ) : (
            shown.map((item, i) =>
              item.kind === 'blog' ? <BlogCard key={i} item={item} /> : <SocialCard key={i} p={item} />,
            )
          )}
        </div>
      </div>
    </Frame>
  )
}
