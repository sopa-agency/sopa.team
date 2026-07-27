import { Frame, ThemeDot } from '../components/Frame'
import { Panel } from '../components/ui'
import { PEOPLE } from '../data'
import { FeedPostCard, FeedNotice } from '../components/FeedPost'
import { useFeed, type FeedFilter } from '../feed'

/* Timeline coletiva: o que a crew posta no Hive e no Farcaster, em ordem.
 * A moldura é terminal, o conteúdo do post é social — sem hachura sobre foto e
 * sem borda ASCII em volta de imagem. Ver docs/feed-ui.md. */

const FILTERS: FeedFilter[] = ['tudo', 'hive', 'farcaster']

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
      {/* sem sticky: a barra cobria o topo do primeiro post e competia com o
          chrome, que já é fixo e carrega a rota */}
      <div style={{
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
        {feed.status === 'loading' && <FeedNotice title="carregando a timeline…" />}

        {feed.status === 'error' && (
          <FeedNotice
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
          <FeedNotice title="ninguém postou nisso ainda." sub="tente sem o filtro de rede" />
        )}

        {feed.entries.map((e) => <FeedPostCard key={e.id} entry={e} />)}

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
