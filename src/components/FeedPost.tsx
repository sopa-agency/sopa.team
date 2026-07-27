import { Avatar } from './ui'
import { shortAgo, sourceLabel, type FeedEntry, type FeedMedia } from '../feed'

/* O card de post da timeline. Vive aqui porque duas páginas o usam: a /feed
 * (timeline coletiva) e o /perfil (timeline de uma pessoa só, em duas colunas). */

/** Uma célula de mídia. Vídeo é arquivo direto (ipfs/farcaster), toca nativo. */
function Cell({ item, ratio }: { item: FeedMedia; ratio: string }) {
  // `width` explícito é o que impede a caixa de encolher: com aspect-ratio +
  // max-height, o navegador deriva a largura da altura limitada e sobra fundo
  // do lado. Com a largura fixa, quem cede é a altura e o cover recorta.
  const box: React.CSSProperties = {
    width: '100%', aspectRatio: ratio, maxHeight: '70vh',
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

const URL_RE = /(https?:\/\/[^\s<>"']+)/g

/**
 * Transforma URL em link montando ELEMENTOS React — o texto vem do Hive e do
 * Farcaster, então nunca passa por dangerouslySetInnerHTML.
 */
function Linkify({ text }: { text: string }) {
  const parts = text.split(URL_RE)
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return part
        // pontuação final costuma ser da frase, não da URL
        const m = /[.,;:!?)\]]+$/.exec(part)
        const href = m ? part.slice(0, -m[0].length) : part
        return (
          <span key={i}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: 'var(--ink-strong)', textDecoration: 'underline', textUnderlineOffset: 2, overflowWrap: 'anywhere' }}
            >
              {href}
            </a>
            {m ? m[0] : null}
          </span>
        )
      })}
    </>
  )
}

export function FeedPostCard({ entry }: { entry: FeedEntry }) {
  const p = entry.person
  return (
    <article style={{ border: '1px solid var(--line)', background: 'var(--panel)', padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
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
        {/* origem + horário são UM alvo só, e apontam pra fora (o autor, ao
            lado, aponta pra dentro do site) */}
        {entry.url ? (
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`abrir em ${entry.platform === 'hive' ? 'skatehive' : 'warpcast'} · ${new Date(entry.postedAt).toLocaleString('pt-BR')}`}
            className="src-link"
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 10.5, color: 'var(--muted)', whiteSpace: 'nowrap',
              textDecoration: 'none', padding: '3px 6px', margin: '-3px -6px -3px auto',
            }}
          >
            <span>{sourceLabel(entry)}</span>
            <span>{shortAgo(entry.postedAt)} ↗</span>
          </a>
        ) : (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7, fontSize: 10.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            <span>{sourceLabel(entry)}</span>
            <span>{shortAgo(entry.postedAt)}</span>
          </div>
        )}
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
          <Linkify text={entry.text} />
        </p>
      )}

      <Media items={entry.inline} />
      <Embeds items={entry.embeds} />
    </article>
  )
}

/** Bloco TUI de estado (carregando / vazio / erro), usado pelas duas páginas. */
export function FeedNotice({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--line)', background: 'var(--panel)', padding: '28px 14px', textAlign: 'center' }}>
      <div style={{ fontSize: 12.5, color: 'var(--ink)' }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 6 }}>{sub}</div>}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  )
}
