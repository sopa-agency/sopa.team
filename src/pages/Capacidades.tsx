import { Frame, ThemeDot } from '../components/Frame'
import { Panel } from '../components/ui'
import { CAPABILITIES } from '../data'

export function Capacidades() {
  const rail = (
    <Panel tag="[ montar entrega ]" tight accent>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>
        selecione o que precisa → sugerimos um time
      </div>
      <div style={{ fontSize: 11.5, lineHeight: 2, color: 'var(--body)' }}>
        <div>
          <span style={{ color: 'var(--ink-strong)' }}>[x]</span> presença digital
        </div>
        <div>
          <span style={{ color: 'var(--ink-strong)' }}>[x]</span> sites e landings
        </div>
        <div>
          <span style={{ color: 'var(--faint)' }}>[ ]</span> narrativa e identidade
        </div>
        <div>
          <span style={{ color: 'var(--faint)' }}>[ ]</span> campanha
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(var(--line-rgb), .14)', marginTop: 11, paddingTop: 11, fontSize: 11, color: 'var(--muted)' }}>
        time sugerido:
        <div style={{ color: 'var(--ink-strong)', marginTop: 5 }}>@bielcx @xvlad @nogenta @willdias</div>
      </div>
      <div data-route="contato" className="btn-yellow" style={{ fontSize: 11.5, padding: '8px 12px', textAlign: 'center', marginTop: 11, cursor: 'pointer' }}>
        chamar esse time →
      </div>
    </Panel>
  )

  return (
    <Frame
      active="capacidades"
      path="~/capacidades"
      rail={rail}
      footerLabel="sopa://capacidades — 06"
      footerMeta={
        <>
          <span>2 selecionadas</span>
          <span>PT/EN</span>
          <ThemeDot />
        </>
      }
    >
      <Panel tag="[ capacidades ]">
        <h2 className="display" style={{ fontWeight: 800, fontSize: 26, letterSpacing: '-.02em', color: 'var(--ink)', margin: 0 }}>
          Não é lista de serviços. É a leitura das forças da rede.
        </h2>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--muted)', margin: '10px 0 0', maxWidth: '76ch' }}>
          Cada capacidade existe porque tem gente com repertório pra sustentar. Toca numa e vê quem faz, o que já rolou
          e onde está documentado.
        </p>
      </Panel>

      {CAPABILITIES.map((c) => (
        <Panel key={c.n} tag={`[ ${c.n} ]`}>
          <div className="cap-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 24 }}>
            <div>
              <div className="display" style={{ fontWeight: 800, fontSize: 24, color: 'var(--ink)' }}>
                {c.title}
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--muted)', margin: '8px 0 0' }}>{c.desc}</p>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--body)', lineHeight: 1.7 }}>
              <div>
                <span style={{ color: 'var(--faint)' }}>pessoas ({c.peopleCount}):</span>{' '}
                <span style={{ color: 'var(--ink-strong)' }}>{c.people}</span> +{c.extra}
              </div>
            </div>
          </div>
        </Panel>
      ))}
    </Frame>
  )
}
