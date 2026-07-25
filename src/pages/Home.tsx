import { useMemo } from 'react'
import { Frame, navigate, ThemeDot } from '../components/Frame'
import { Avatar } from '../components/ui'
import { PEOPLE, shuffle } from '../data'

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
            <span className="on">●</span>
            {PEOPLE.length} no coletivo
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
            <button className="btn-ghost" style={{ fontSize: 13, padding: '11px 18px' }} onClick={() => navigate('pessoas')}>
              conhece quem faz
            </button>
          </div>
        </div>
      </div>

      {/* pessoas preview */}
      <div style={{ ...section, padding: '34px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ fontSize: 14, color: 'var(--ink)' }}>
            <span style={{ color: 'var(--ink-strong)' }}>~/</span>pessoas <span style={{ color: 'var(--faint)' }}>— {PEOPLE.length}</span>
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
              <span style={{ fontSize: 10.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{p.territory}</span>
              <span style={{ fontSize: 12, color: 'var(--ink-strong)', textAlign: 'right' }}>→</span>
            </div>
          ))}
        </div>
      </div>

      {/* manifesto — feed, projetos e capacidades saíram daqui junto com o mock */}
      <div style={{ ...section, padding: '38px 24px', background: 'var(--panel-alt)' }}>
        <div style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 14 }}>/* manifesto */</div>
        <p className="display" style={{ fontWeight: 700, fontSize: 23, lineHeight: 1.3, color: 'var(--ink)', margin: 0, maxWidth: '30ch' }}>
          {PEOPLE.length} cabeças, repertórios que não combinam, e a teimosia de fazer junto. daí sai presença, produto e
          cultura digital.
        </p>
        <p style={{ fontSize: 11.5, color: 'var(--faint)', margin: '16px 0 0' }}>
          // the studio exists to turn individual production into collective force.
        </p>
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
