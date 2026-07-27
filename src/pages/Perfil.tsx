import { Frame, ThemeDot } from '../components/Frame'
import { Panel, Avatar } from '../components/ui'
import { FeedPostCard, FeedNotice } from '../components/FeedPost'
import { useFeed } from '../feed'
import { PEOPLE } from '../data'
import { SKILL_LABELS } from '../people-overrides'

/** barra TUI de 24 células — preenchida + apagada */
const BAR = '█'.repeat(24)
const DIM = '·'.repeat(24)

const DEFAULT_HANDLE = '@xvlad'

/* O perfil mostra só o que a pessoa preencheu no portal (bio + skills) e o que
 * é curadoria nossa (roles, território). Links, serviços, projetos, posts e
 * mídia saíram junto com o mock — voltam quando existirem como cadastro de
 * verdade. Ver docs/cadastro-pessoas.md. */

export function Perfil({ handle }: { handle?: string }) {
  const person =
    PEOPLE.find((p) => p.handle.slice(1) === handle) ??
    PEOPLE.find((p) => p.handle === DEFAULT_HANDLE) ??
    PEOPLE[0]
  const slug = person.handle.slice(1)
  // o que ESTA pessoa publicou — filtrado no servidor, não sobre a janela já
  // carregada, senão a contagem mentiria
  const feed = useFeed({ author: slug, pageSize: 10 })
  // já vem ordenado desc e sem zeros do gerador; só cortamos a cauda
  const skills = Object.entries(person.skills).slice(0, 6)

  const rail = (
    <>
      <Panel tag="[ território ]" tight>
        <div style={{ fontSize: 12, color: 'var(--ink)' }}>{person.territory}</div>
        <div data-route="pessoas" style={{ fontSize: 10.5, color: 'var(--faint)', marginTop: 10, cursor: 'pointer' }}>
          ver quem mais atua aqui →
        </div>
      </Panel>
    </>
  )

  return (
    <Frame
      active="pessoas"
      path={`~/pessoas/${slug}`}
      rail={rail}
      leaf={{ parent: 'pessoas', label: person.handle }}
      footerLabel={`sopa://pessoas/${slug}`}
      footerMeta={
        <>
          <span>{person.territory}</span>
          <span>PT/EN</span>
          <ThemeDot />
        </>
      }
    >
      {/* perfil e skills dividem a primeira dobra — são as duas leituras da
          pessoa: quem é (bio) e o que faz (scores) */}
      {/* a classe fica SEMPRE: é ela que o seletor de margem do painel de baixo
          enxerga. Sem skills o modificador `solo` só troca pra uma coluna, em
          vez de a grade ficar com metade vazia. */}
      <div className={'perfil-top' + (skills.length > 0 ? '' : ' solo')}>
      <Panel tag="[ perfil ]" style={{ padding: '22px 18px 18px' }}>
        <div className="perfil-head" style={{ display: 'grid', gridTemplateColumns: '116px 1fr', gap: 18 }}>
          <Avatar src={person.avatarUrl} initials={person.initials} fill style={{ border: '1px solid rgba(var(--line-rgb), .22)' }} />
          <div>
            <div className="display" style={{ fontWeight: 900, fontSize: 34, letterSpacing: '-.02em', lineHeight: 0.95, color: 'var(--ink)' }}>
              {person.handle}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>
              <span style={{ color: 'var(--ink-strong)', textTransform: 'uppercase' }}>{person.roles}</span>
            </div>
            {/* bio vem do cadastro no portal; sem bio, o perfil não inventa uma */}
            <p style={{ fontSize: 12.5, lineHeight: 1.65, color: person.bio ? 'var(--body)' : 'var(--faint)', margin: '14px 0 0', maxWidth: '60ch' }}>
              {person.bio ?? 'Sem bio ainda — essa pessoa ainda não preencheu o cadastro.'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
              {person.roles.split(' · ').map((t) => (
                <span key={t} style={{ fontSize: 10, background: 'rgba(var(--accent-rgb), .12)', color: 'var(--ink-strong)', padding: '3px 8px' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* skills — scores do cadastro no portal (MemberSkills), top 6 */}
      {skills.length > 0 && (
        <Panel tag="[ skills ]">
          {skills.map(([key, score]) => (
            <div key={key} style={{ display: 'grid', gridTemplateColumns: '124px 1fr 34px', gap: 12, alignItems: 'center', padding: '5px 0' }}>
              <span style={{ fontSize: 11.5, color: 'var(--ink)' }}>{SKILL_LABELS[key] ?? key}</span>
              <span style={{ fontSize: 11, letterSpacing: '.5px', color: 'var(--ink-strong)', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {BAR.slice(0, Math.max(1, Math.round((score / 100) * BAR.length)))}
                <span style={{ color: 'var(--faint)' }}>
                  {DIM.slice(0, BAR.length - Math.max(1, Math.round((score / 100) * BAR.length)))}
                </span>
              </span>
              <span style={{ fontSize: 10.5, color: 'var(--faint)', textAlign: 'right' }}>{score}</span>
            </div>
          ))}
        </Panel>
      )}
      </div>

      {/* timeline da pessoa: mesmo card do /feed, sem o bloco de autor —
          repetir o mesmo avatar a cada post na página dela é ruído */}
      <Panel tag="[ o que tem postado ]" bare>
        {/* duas colunas que encaixam: `columns` do CSS empacota por altura, então
            card curto e card com vídeo convivem sem buraco. Custo assumido: a
            leitura desce a primeira coluna e volta pro topo da segunda. */}
        <div className="post-grid">
          {feed.status === 'loading' && <div className="post-cell"><FeedNotice title="carregando…" /></div>}

          {feed.status === 'error' && (
            <div className="post-cell"><FeedNotice title="não deu pra carregar os posts." sub={feed.error ?? undefined} /></div>
          )}

          {feed.status === 'ready' && feed.entries.length === 0 && (
            <div className="post-cell"><FeedNotice title={`${person.handle} ainda não postou no Hive nem no Farcaster.`} /></div>
          )}

          {feed.entries.map((e) => (
            <div key={e.id} className="post-cell">
              <FeedPostCard entry={e} />
            </div>
          ))}

        </div>

        {feed.entries.length > 0 && feed.cursor && (
          <button
            type="button"
            onClick={feed.loadMore}
            disabled={feed.status === 'loading-more'}
            style={{
              width: '100%', font: 'inherit', fontSize: 12, padding: 12, marginTop: 10, cursor: 'pointer',
              background: 'none', color: 'var(--ink)', border: '1px solid var(--line)',
            }}
          >
            {feed.status === 'loading-more' ? '[ carregando… ]' : '[ carregar mais ▾ ]'}
          </button>
        )}
      </Panel>
    </Frame>
  )
}
