import { Frame, ThemeDot } from '../components/Frame'
import { Panel, Hatch, KeyVals, Avatar } from '../components/ui'
import { PEOPLE } from '../data'

const LINKS = ['site ↗', 'instagram ↗', 'are.na ↗', 'behance ↗']
const SERVICES = ['identidade visual', 'sistema de design', 'direção de arte', 'motion básico', 'layout figma → web']
const POSTS = [
  { tag: 'making-of', title: 'Identidade viva pra rave XYZ', date: '28.06', video: false },
  { tag: 'nota de processo', title: 'Sistema tipográfico do Festival Maré', date: '12.06', video: false },
  { tag: '▶ vídeo', title: 'Timelapse do lettering (0:48)', date: '20.05', video: true },
]
const OWN = [
  ['Festival Maré', 'site + identidade · 2025'],
  ['Fanzine #03', 'editorial · 2024'],
  ['Identidade — coletivo de skate', 'identidade · 2024'],
]
const COLLABS = [
  ['RSVP on-chain', '@willdias @joaoparmagnani'],
  ['Drop de inverno', '@r4topunk @vaipraonde'],
  ['Doc da line-up', '@vaipraonde'],
]

export function Perfil({ handle }: { handle?: string }) {
  const person = PEOPLE.find((p) => p.handle.slice(1) === handle) ?? PEOPLE[1] // default @xvlad
  const slug = person.handle.slice(1)
  // the one written post belongs to @xvlad; only its row opens the post page
  const isVlad = person.handle === '@xvlad'

  const rail = (
    <>
      <Panel tag="[ sobre ]" tight>
        <KeyVals rows={[
          ['desde', 2021],
          ['base', 'São Paulo'],
          ['idiomas', 'PT · EN'],
          ['foco', person.roles.split(' · ')[0]],
        ]} />
      </Panel>
      <Panel tag="[ números ]" tight>
        <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
          {[[person.posts, 'posts'], [8, 'projetos'], [5, 'colabs']].map(([n, l]) => (
            <div key={l}>
              <div className="display" style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)' }}>{n}</div>
              <div style={{ fontSize: 9, color: 'var(--faint)' }}>{l}</div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel tag="[ no radar ]" tight>
        <div style={{ fontSize: 11, lineHeight: 1.7, color: 'var(--muted)' }}>
          tipos variáveis · risografia · sistemas de cor pra eventos
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
          <span>{person.posts} posts</span>
          <span>PT/EN</span>
          <ThemeDot />
        </>
      }
    >
      {/* header */}
      <Panel tag="[ perfil ]" style={{ padding: '22px 18px 18px' }}>
        <div className="perfil-head" style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 20 }}>
          <Avatar src={person.avatarUrl} initials={person.initials} fill style={{ border: '1px solid rgba(var(--line-rgb), .22)' }} />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div className="display" style={{ fontWeight: 900, fontSize: 38, letterSpacing: '-.02em', lineHeight: 0.95, color: 'var(--ink)' }}>
                  {person.handle}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>
                  <span style={{ color: 'var(--ink-strong)', textTransform: 'uppercase' }}>{person.roles}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div data-route="contato" className="btn-yellow" style={{ fontSize: 12, padding: '8px 14px', marginTop: 8, cursor: 'pointer' }}>chamar pra projeto →</div>
              </div>
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.65, color: 'var(--body)', margin: '14px 0 0', maxWidth: '60ch' }}>
              Designer gráfica focada em identidade viva pra cultura e música. Gosto de sistemas que respiram —
              tipografia, grid e movimento como uma coisa só. Baseada em SP.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
              {LINKS.map((l) => (
                <span key={l} style={{ fontSize: 10.5, border: '1px solid var(--line-strong)', padding: '3px 8px', color: 'var(--muted)' }}>{l}</span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {person.roles.split(' · ').map((t) => (
                <span key={t} style={{ fontSize: 10, background: 'rgba(var(--accent-rgb), .12)', color: 'var(--ink-strong)', padding: '3px 8px' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* serviços */}
      <Panel tag="[ serviços que assumo ]">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SERVICES.map((s) => (
            <span key={s} style={{ fontSize: 12, border: '1px solid rgba(var(--line-rgb), .22)', color: 'var(--ink)', padding: '7px 12px' }}>{s}</span>
          ))}
        </div>
      </Panel>

      {/* posts */}
      <Panel tag={`[ posts — ${person.posts} ]`}>
        {POSTS.map((p) => {
          const live = isVlad && p.tag === 'making-of'
          return (
            <div
              key={p.title}
              {...(live ? { 'data-route': 'post' } : {})}
              style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 14, alignItems: 'center', padding: '9px 0', borderTop: '1px solid rgba(var(--line-rgb), .09)', cursor: live ? 'pointer' : 'default' }}
            >
              <div className={p.video ? 'ph' : ''} style={{ width: 64, height: 42, background: p.video ? 'var(--panel-alt)' : 'var(--hatch)', border: '1px solid var(--line-soft)', color: 'var(--faint)', fontSize: 14 }}>
                {p.video ? '▶' : ''}
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--ink-strong)', textTransform: 'uppercase' }}>{p.tag}</div>
                <div className="display" style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', marginTop: 2 }}>{p.title}</div>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--faint)', textAlign: 'right' }}>{live ? `${p.date} →` : p.date}</div>
            </div>
          )
        })}
        <div data-route="feed" style={{ fontSize: 10.5, color: 'var(--faint)', padding: '10px 0 2px', borderTop: '1px solid rgba(var(--line-rgb), .09)', cursor: 'pointer' }}>
          ver todos os {person.posts} posts →
        </div>
      </Panel>

      {/* projetos + colabs */}
      <div className="grid-2" style={{ gap: 16, marginTop: 16 }}>
        <Panel tag="[ projetos próprios ]" tight style={{ padding: '20px 14px 13px' }}>
          {OWN.map(([n, m]) => (
            <div key={n} style={{ padding: '8px 0', borderTop: '1px solid rgba(var(--line-rgb), .09)' }}>
              <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 700 }}>{n}</span>
              <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 3 }}>{m}</div>
            </div>
          ))}
        </Panel>
        <Panel tag="[ colaborações ]" tight style={{ padding: '20px 14px 13px' }}>
          {COLLABS.map(([n, w]) => (
            <div key={n} style={{ padding: '8px 0', borderTop: '1px solid rgba(var(--line-rgb), .09)' }}>
              <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 700 }}>{n}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>
                com <span style={{ color: 'var(--ink-strong)' }}>{w}</span>
              </div>
            </div>
          ))}
        </Panel>
      </div>

      {/* mídia */}
      <Panel tag="[ mídia ]">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {[0, 1, 2, 3].map((i) =>
            i === 1 ? (
              <div key={i} className="ph" style={{ aspectRatio: 1, background: 'var(--panel-alt)', border: '1px solid var(--line-soft)', color: 'var(--faint)', fontSize: 15 }}>▶</div>
            ) : (
              <Hatch key={i} ratio="1" label="[ img ]" />
            ),
          )}
        </div>
      </Panel>
    </Frame>
  )
}
