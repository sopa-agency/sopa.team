import { Frame, ThemeDot } from '../components/Frame'
import { Panel, Avatar } from '../components/ui'
import { PEOPLE } from '../data'
import {
  useFeed, shortAgo, sourceLabel,
  type FeedEntry, type FeedFilter, type FeedMedia,
} from '../feed'

/* Timeline coletiva: o que a crew posta no Hive e no Farcaster, em ordem.
 * A moldura é terminal, o conteúdo do post é social — sem hachura sobre foto e
 * sem borda ASCII em volta de imagem. Ver docs/feed-ui.md. */

const FILTERS: FeedFilter[] = ['tudo', 'hive', 'farcaster']

/** Uma célula de mídia. Vídeo é arquivo direto (ipfs/farcaster), toca nativo. */
function Cell({ item, ratio }: { item: FeedMedia; ratio: string }) {
  const box: React.CSSProperties = {
    aspectRatio: ratio, maxHeight: '70vh',
    background: 'var(--panel-alt)', overflow: 'hidden', position: 'relative',
  }
  const fill: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
  if (item.type === 'video') {
    return (
      <div style={box}>
        <video src={item.url} controls preload="metadata" playsInline style={{ ...fill, background: '#000' }} />
      </div>
    )
  }
  return (
    <div style={box}>
      <img src={item.url} alt="" loading="lazy" style={fill} onError={(e) => { e.currentTarget.style.display = 'none' }} />
    </div>
  )
}

/** Arranjo por quantidade. Proporção fixa pra não ter salto de layout. */
function Media({ items }: { items: FeedMedia[] }) {
  if (items.length === 0) return null
  const grid: React.CSSProperties = {
    display: 'grid', gap: 1, background: 'var(--line)',
    border: '1px solid var(--line)', marginTop: 10,
  }
  if (items.length === 1) {
    return <div style={{ ...grid, gridTemplateColumns: '1fr' }}><Cell item={items[0]} ratio="4/5" /></div>
  }
  if (items.length === 2) {
    return (
      <div style={{ ...grid, gridTemplateColumns: '1fr 1fr' }}>
        {items.map((m, i) => <Cell key={i} item={m} ratio="1" />)}
      </div>
    )
  }
  if (items.length === 3) {
    return (
      <div style={{ ...grid, gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr' }}>
        <div style={{ gridRow: 'span 2' }}><Cell item={items[0]} ratio="auto" /></div>
        <Cell item={items[1]} ratio="1" />
        <Cell item={items[2]} ratio="1" />
      </div>
    )
  }
  const extra = items.length - 4
  return (
    <div style={{ ...grid, gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
      {items.slice(0, 4).map((m, i) => (
        <div key={i} style={{ position: 'relative' }}>
          <Cell item={m} ratio="1" />
          {i === 3 && extra > 0 && (
            <span style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700,
            }}>+{extra}</span>
          )}
        </div>
      ))}
    </div>
  )
}

/** Player de terceiro não vira <video>. Pendurar um iframe por post numa
 *  timeline é peso desproporcional, então vira link com selo. */
function Embeds({ items }: { items: FeedMedia[] }) {
  if (items.length === 0) return null
  return (
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((m, i) => {
        let host = 'vídeo'
        try { host = new URL(m.url).host.replace(/^www\./, '') } catch { /* fica o padrão */ }
        return (
          <a
            key={i} href={m.url} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none',
              border: '1px solid var(--line)', background: 'var(--hatch)', padding: '11px 12px',
              fontSize: 11.5, color: 'var(--ink)',
            }}
          >
            <span style={{ fontSize: 15, color: 'var(--ink-strong)' }}>▶</span>
            <span>{host}</span>
            <span style={{ marginLeft: 'auto', color: 'var(--faint)', fontSize: 10.5 }}>abrir ↗</span>
          </a>
        )
      })}
    </div>
  )
}

function Post({ entry }: { entry: FeedEntry }) {
  const p = entry.person
  return (
    <article style={{ border: '1px solid var(--line)', background: 'var(--panel)', padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        {/* autor leva pra DENTRO do site; a origem leva pra fora */}
        <div
          {...(p ? { 'data-route': 'perfil', 'data-param': entry.author } : {})}
          style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, cursor: p ? 'pointer' : 'default' }}
        >
          <Avatar src={p?.avatarUrl} initials={p?.initials ?? entry.author.slice(0, 2).toUpperCase()} size={34} />
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>@{entry.author}</span>
            {p && (
              <span style={{ fontSize: 9.5, color: 'var(--ink-strong)', textTransform: 'uppercase', letterSpacing: '.05em', marginTop: 1 }}>
                {p.roles}
              </span>
            )}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 9, fontSize: 10.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
          <span>{sourceLabel(entry)}</span>
          {entry.url ? (
            <a href={entry.url} target="_blank" rel="noopener noreferrer" title={new Date(entry.postedAt).toLocaleString('pt-BR')} style={{ color: 'inherit', textDecoration: 'none' }}>
              {shortAgo(entry.postedAt)} ↗
            </a>
          ) : (
            <span>{shortAgo(entry.postedAt)}</span>
          )}
        </div>
      </div>

      {entry.kind === 'blog' && entry.text && (
        <div className="display" style={{ fontWeight: 800, fontSize: 17, color: 'var(--ink)', margin: '9px 0 0', letterSpacing: '-.01em' }}>
          {entry.text}
        </div>
      )}
      {entry.kind !== 'blog' && entry.text && (
        <p style={{
          margin: '9px 0 0', color: 'var(--ink-body)',
          whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
          // texto puro é um quarto do feed: sem mídia ele É o conteúdo, respira mais
          fontSize: entry.media.length === 0 ? 14 : 12.5,
          lineHeight: entry.media.length === 0 ? 1.7 : 1.62,
        }}>
          {entry.text}
        </p>
      )}

      <Media items={entry.inline} />
      <Embeds items={entry.embeds} />
    </article>
  )
}

function Notice({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--line)', background: 'var(--panel)', padding: '28px 14px', textAlign: 'center' }}>
      <div style={{ fontSize: 12.5, color: 'var(--ink)' }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 6 }}>{sub}</div>}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  )
}

export function Feed() {
  const feed = useFeed()

  const rail = (
    <>
      <Panel tag="[ quem posta ]" tight>
        <div style={{ fontSize: 11.5, lineHeight: 1.95, color: 'var(--body)' }}>
          {PEOPLE.slice(0, 8).map((p) => (
            <div key={p.handle} data-route="perfil" data-param={p.handle.slice(1)} style={{ cursor: 'pointer' }}>
              {p.handle}
            </div>
          ))}
        </div>
      </Panel>
      <Panel tag="[ de onde vem ]" tight>
        <div style={{ fontSize: 11.5, lineHeight: 1.8, color: 'var(--muted)' }}>
          o que a crew publica no Hive e no Farcaster, em ordem. post do Hive abre no skatehive.
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
      footerMeta={<><span>{feed.entries.length} carregados</span><span>PT/EN</span><ThemeDot /></>}
    >
      <div className="tl" style={{
        position: 'sticky', top: 0, zIndex: 5, background: 'var(--bg)',
        borderBottom: '1px solid var(--line)', padding: '11px 4px',
        display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap',
        maxWidth: 620, margin: '0 auto', width: '100%',
      }}>
        <span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.06em' }}>[ timeline ]</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => feed.setFilter(f)}
            className={'pill' + (feed.filter === f ? ' on' : '')}
            style={{ fontSize: 11, padding: '3px 10px', cursor: 'pointer', color: feed.filter === f ? undefined : 'var(--ink)' }}
          >
            {f}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--faint)' }}>
          {feed.entries.length} carregados
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 0', maxWidth: 620, margin: '0 auto', width: '100%' }}>
        {feed.status === 'loading' && <Notice title="carregando a timeline…" />}

        {feed.status === 'error' && (
          <Notice
            title="o feed não respondeu."
            sub={feed.error ?? undefined}
            action={
              <button type="button" onClick={() => feed.setFilter(feed.filter)} className="btn-ghost" style={{ fontSize: 11.5, padding: '7px 14px', cursor: 'pointer' }}>
                tentar de novo
              </button>
            }
          />
        )}

        {feed.status === 'ready' && feed.entries.length === 0 && (
          <Notice title="ninguém postou nisso ainda." sub="tente sem o filtro de rede" />
        )}

        {feed.entries.map((e) => <Post key={e.id} entry={e} />)}

        {feed.entries.length > 0 && feed.cursor && (
          <button
            type="button"
            onClick={feed.loadMore}
            disabled={feed.status === 'loading-more'}
            style={{
              width: '100%', font: 'inherit', fontSize: 12, padding: 13, cursor: 'pointer',
              background: 'none', color: 'var(--ink)', border: '1px solid var(--line)',
            }}
          >
            {feed.status === 'loading-more' ? '[ carregando… ]' : '[ carregar mais ▾ ]'}
          </button>
        )}

        {feed.entries.length > 0 && !feed.cursor && feed.status === 'ready' && (
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--faint)', padding: '10px 0' }}>
            — fim do buffer —
          </div>
        )}
      </div>
    </Frame>
  )
}
