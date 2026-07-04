import { useMemo } from 'react'
import { Frame, navigate, ThemeDot } from '../components/Frame'
import { Hatch, Avatar } from '../components/ui'
import { PEOPLE, HOME_FEED, HOME_PROJECTS, CAPABILITIES_SHORT, shuffle } from '../data'

const section: React.CSSProperties = { borderBottom: '1px solid rgba(var(--line-rgb), .16)' }

export function Home() {
  // ordem aleatória das pessoas, fixa por montagem
  const people = useMemo(() => shuffle(PEOPLE), [])
  return (
    <Frame
      active="home"
      path="~/home"
      bare
      footerLabel="sopa://home"
      footerMeta={
        <>
          <span>
            <span className="on">●</span>10 online
          </span>
          <span>PT/EN</span>
          <ThemeDot />
        </>
      }
    >
      {/* hero / manifesto */}
      <div style={section}>
        <div style={{ padding: '46px 24px 40px' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-strong)', marginBottom: 26 }}>
            &gt; ./manifesto --run
            <span className="cursor" />
          </div>
          <h2
            className="display"
            style={{ fontWeight: 900, fontSize: 'clamp(40px,7vw,70px)', lineHeight: 0.9, letterSpacing: '-.03em', margin: 0, color: 'var(--ink)' }}
          >
            REPERTÓRIOS INDIVIDUAIS,
            <br />
            ENTREGAS <span className="mark">COLETIVAS.</span>
          </h2>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--body)', maxWidth: '52ch', margin: '28px 0 0' }}>
            Uma rede de criadores, devs, designers e estrategistas conectando portfólios individuais em entregas
            coletivas.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 30, flexWrap: 'wrap' }}>
            <button className="btn-yellow" style={{ fontSize: 13, padding: '11px 18px' }} onClick={() => navigate('contato')}>
              tem um projeto? chama noix →
            </button>
            <button className="btn-ghost" style={{ fontSize: 13, padding: '11px 18px' }} onClick={() => navigate('feed')}>
              explore o feed
            </button>
          </div>
        </div>
      </div>

      {/* pessoas preview */}
      <div style={{ ...section, padding: '34px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ fontSize: 14, color: 'var(--ink)' }}>
            <span style={{ color: 'var(--ink-strong)' }}>~/</span>pessoas <span style={{ color: 'var(--faint)' }}>— 10</span>
          </div>
          <a data-route="pessoas" href="/pessoas" style={{ fontSize: 12, color: 'var(--muted)' }}>
            ver diretório →
          </a>
        </div>
        <div className="pessoas-dir">
          {people.map((p) => (
            <div
              key={p.handle}
              data-person
              data-route="perfil"
              data-param={p.handle.slice(1)}
              style={{ display: 'grid', gridTemplateColumns: '30px 1fr auto 16px', gap: 11, alignItems: 'center', padding: '8px 0', borderTop: '1px solid var(--line-soft)', cursor: 'pointer' }}
            >
              <Avatar src={p.avatarUrl} initials={p.initials} size={30} />
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{p.handle}</span>
                <span style={{ fontSize: 9.5, color: 'var(--ink-strong)', textTransform: 'uppercase', letterSpacing: '.04em', marginTop: 1 }}>{p.roles}</span>
              </div>
              <span style={{ fontSize: 10.5, color: 'var(--body)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                {p.posts} <span style={{ color: 'var(--faint)' }}>posts</span>
              </span>
              <span style={{ fontSize: 12, color: 'var(--ink-strong)', textAlign: 'right' }}>→</span>
            </div>
          ))}
        </div>
      </div>

      {/* feed preview */}
      <div style={{ ...section, padding: '34px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 14, color: 'var(--ink)' }}>
            <span style={{ color: 'var(--ink-strong)' }}>~/</span>feed <span style={{ color: 'var(--faint)' }}>— log</span>
          </div>
          <a data-route="feed" href="/feed" style={{ fontSize: 12, color: 'var(--muted)' }}>
            tudo · making-of · vídeo · estudo →
          </a>
        </div>
        <div>
          {HOME_FEED.map((f, i) => (
            <div
              key={i}
              className="feed-row"
              data-route={f.tag === 'making-of' ? 'post' : 'feed'}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 150px',
                gap: 18,
                alignItems: 'center',
                padding: '16px 0',
                cursor: 'pointer',
                borderTop: '1px solid rgba(var(--line-rgb), .12)',
                borderBottom: i === HOME_FEED.length - 1 ? '1px solid rgba(var(--line-rgb), .12)' : undefined,
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--faint)' }}>{f.date}</div>
              <div>
                <span style={{ fontSize: 10, color: 'var(--ink-strong)', border: '1px solid rgba(var(--accent-rgb), .4)', padding: '1px 6px', marginRight: 8 }}>
                  {f.tag}
                </span>
                <span className="display" style={{ fontWeight: 600, fontSize: 16, color: 'var(--ink)' }}>
                  {f.title}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>{f.by}</div>
            </div>
          ))}
        </div>
      </div>

      {/* projetos preview */}
      <div style={{ ...section, padding: '34px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: 'var(--ink)' }}>
            <span style={{ color: 'var(--ink-strong)' }}>~/</span>projetos <span style={{ color: 'var(--faint)' }}>— produção recente</span>
          </div>
          <a data-route="projetos" href="/projetos" style={{ fontSize: 12, color: 'var(--muted)' }}>
            arquivo completo →
          </a>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--faint)' }}>filtrar em</span>
          {['pessoa', 'tipo', 'ano'].map((f) => (
            <span key={f} data-route="projetos" className="pill" style={{ fontSize: 11, padding: '3px 9px', color: 'var(--ink)', cursor: 'pointer' }}>
              {f} ▿
            </span>
          ))}
          <span style={{ fontSize: 11, color: 'var(--faint)' }}>→ no arquivo</span>
        </div>
        <div className="grid-2">
          {HOME_PROJECTS.map((p) => (
            <div key={p.title} data-route="projetos" style={{ border: '1px solid var(--line)', background: 'var(--panel)', cursor: 'pointer' }}>
              <Hatch ratio="16/9" label="[ capa do projeto · 16:9 ]" large style={{ borderBottom: '1px solid rgba(var(--line-rgb), .12)', border: 'none' }} />
              <div style={{ padding: 15 }}>
                <div className="display" style={{ fontWeight: 800, fontSize: 19, color: 'var(--ink)' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 8 }}>{p.meta}</div>
                <div style={{ fontSize: 11.5, color: 'var(--body)', marginTop: 10 }}>{p.people}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 12 }}>
                  {p.tags.map((t) => (
                    <span key={t} className="tag-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* capacidades + manifesto split */}
      <div className="split-2" style={{ borderBottom: '1px solid rgba(var(--line-rgb), .16)' }}>
        <div style={{ padding: '34px 24px', borderRight: '1px solid rgba(var(--line-rgb), .16)' }}>
          <div style={{ fontSize: 14, color: 'var(--ink)', marginBottom: 18 }}>
            <span style={{ color: 'var(--ink-strong)' }}>$</span> ls capacidades/
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 13.5 }}>
            {CAPABILITIES_SHORT.map(([name, m]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <span style={{ color: 'var(--ink-strong)' }}>[x]</span> {name}
                </span>
                <span style={{ color: 'var(--faint)', fontSize: 11 }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '34px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--panel-alt)' }}>
          <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 14 }}>/* manifesto */</div>
          <p className="display" style={{ fontWeight: 700, fontSize: 23, lineHeight: 1.3, color: 'var(--ink)', margin: 0, maxWidth: '30ch' }}>
            onze cabeças, repertórios que não combinam, e a teimosia de fazer junto. daí sai presença, produto e cultura
            digital.
          </p>
          <p style={{ fontSize: 11.5, color: 'var(--faint)', margin: '16px 0 0' }}>
            // the studio exists to turn individual production into collective force.
          </p>
        </div>
      </div>

      {/* contato CTA */}
      <div style={{ padding: '42px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--ink-strong)', marginBottom: 14 }}>&gt; ./contato</div>
        <h3 className="display" style={{ fontWeight: 900, fontSize: 'clamp(30px,5vw,44px)', lineHeight: 1, letterSpacing: '-.02em', color: 'var(--ink)', margin: 0 }}>
          tem um projeto? chama o estúdio.
        </h3>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, fontSize: 13, flexWrap: 'wrap' }}>
          <button className="btn-yellow" style={{ padding: '11px 20px' }} onClick={() => navigate('contato')}>
            oi@sopa.studio
          </button>
          <button className="btn-ghost" style={{ padding: '11px 20px' }} onClick={() => navigate('pessoas')}>
            quer conhecer quem faz? explora os perfis →
          </button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 28 }}>
          sopa © 2026 · rede de criadores · feito coletivamente
        </div>
      </div>
    </Frame>
  )
}
