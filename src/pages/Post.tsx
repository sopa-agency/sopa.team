import { Frame, ThemeDot } from '../components/Frame'
import { Panel, Hatch } from '../components/ui'

export function Post() {
  const rail = (
    <>
      <Panel tag="[ autor ]" tight>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Hatch ratio="1" style={{ width: 42, height: 42, border: '1px solid rgba(var(--line-rgb), .22)' }} />
          <div>
            <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 700 }}>@xvlad</div>
            <div style={{ fontSize: 10, color: 'var(--ink-strong)', textTransform: 'uppercase' }}>dev · ai · web3</div>
          </div>
        </div>
        <a data-route="perfil" data-param="xvlad" href="#/perfil/xvlad" style={{ fontSize: 10.5, color: 'var(--faint)', marginTop: 10, display: 'block' }}>
          ver perfil →
        </a>
      </Panel>
      <Panel tag="[ neste post ]" tight>
        <div style={{ fontSize: 11.5, lineHeight: 2, color: 'var(--muted)' }}>
          <div>· o ponto de partida</div>
          <div>· sistema tipográfico</div>
          <div>· bloco de processo</div>
          <div>· referências</div>
        </div>
      </Panel>
      <Panel tag="[ relacionados ]" tight>
        <div style={{ fontSize: 11.5, lineHeight: 1.5, color: 'var(--body)' }}>
          <div style={{ padding: '6px 0', borderTop: '1px solid rgba(var(--line-rgb), .08)' }}>
            Sistema tipográfico do Festival Maré <span style={{ color: 'var(--faint)' }}>· @xvlad</span>
          </div>
          <div style={{ padding: '6px 0', borderTop: '1px solid rgba(var(--line-rgb), .08)' }}>
            RSVP on-chain — primeiro fluxo <span style={{ color: 'var(--faint)' }}>· @willdias</span>
          </div>
        </div>
      </Panel>
    </>
  )

  const h2 = { fontWeight: 800, fontSize: 22, color: 'var(--ink)', margin: '28px 0 10px', letterSpacing: '-.01em' } as const
  const p = { fontSize: 15, lineHeight: 1.7, color: 'var(--body)', margin: '0 0 16px' } as const

  return (
    <Frame
      active="feed"
      path="~/feed/making-of/identidade-viva-rave-xyz"
      rail={rail}
      footerLabel="sopa://feed/identidade-viva-rave-xyz"
      footerMeta={
        <>
          <span>making-of</span>
          <span>4 min</span>
          <span>PT/EN</span>
          <ThemeDot />
        </>
      }
    >
      <Panel tag="[ post ]" style={{ padding: '26px 22px 22px' }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{ fontSize: 10.5, color: 'var(--faint)' }}>
            ~/feed / <span style={{ color: 'var(--ink-strong)' }}>making-of</span>
          </div>
          <h1 className="display" style={{ fontWeight: 900, fontSize: 'clamp(32px,4.5vw,44px)', lineHeight: 1, letterSpacing: '-.025em', color: 'var(--ink)', margin: '12px 0 0' }}>
            Identidade viva pra rave XYZ — do brief ao motion
          </h1>
          <div style={{ display: 'flex', gap: 28, fontSize: 11, color: 'var(--muted)', marginTop: 14, flexWrap: 'wrap' }}>
            <span>
              <span style={{ color: 'var(--ink-strong)' }}>@xvlad</span> · dev · ai · web3
            </span>
            <span>28.06.2026</span>
            <span>leitura 4 min</span>
            <span>
              colaboração com <span style={{ color: 'var(--ink-strong)' }}>@willdias</span>
            </span>
          </div>
        </div>

        <Hatch ratio="16/8" label="[ imagem de capa · 16:8 ]" large style={{ border: '1px solid var(--line-soft)', margin: '22px 0 6px' }} />
        <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 22 }}>↑ frame final da identidade em movimento</div>

        <div style={{ maxWidth: 680 }}>
          <p className="display" style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--lead)', margin: '0 0 20px', fontWeight: 500 }}>
            Como um sistema de identidade pode "respirar" junto com a música? Esse é o registro do processo — do primeiro
            brief bagunçado até o motion que rodou nos telões.
          </p>

          <h2 className="display" style={h2}>O ponto de partida</h2>
          <p className="display" style={p}>
            O pedido era simples na superfície: uma identidade pra uma rave itinerante. Mas a rave muda de lugar, de
            line-up e de público toda edição. Então a marca não podia ser um logo fixo — tinha que ser um sistema com
            regras e folga pra improviso.
          </p>

          <div style={{ borderLeft: '2px solid var(--yellow)', padding: '6px 0 6px 18px', margin: '24px 0' }}>
            <div className="display" style={{ fontWeight: 800, fontSize: 26, lineHeight: 1.25, color: 'var(--ink)' }}>
              "A gente não desenhou um logo. Desenhou um jeito da coisa se mover."
            </div>
          </div>

          <h2 className="display" style={h2}>Sistema tipográfico</h2>
          <p className="display" style={{ ...p, margin: '0 0 18px' }}>
            Uma grotesca pesada pros nomes, uma mono pros metadados (data, local, line-up). O contraste entre as duas
            virou a assinatura — e deu ritmo pros cartazes e pros stories.
          </p>

          <div style={{ border: '1px solid var(--line-strong)', padding: 16, margin: '22px 0', background: 'var(--panel-alt)' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-strong)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>
              // bloco de processo
            </div>
            <div className="grid-2" style={{ gap: 12, fontSize: 12, color: 'var(--body)' }}>
              <div>
                <span style={{ color: 'var(--ink-strong)' }}>01</span> pesquisa de repertório visual
              </div>
              <div>
                <span style={{ color: 'var(--ink-strong)' }}>02</span> grid modular + folga
              </div>
              <div>
                <span style={{ color: 'var(--ink-strong)' }}>03</span> par tipográfico + escala
              </div>
              <div>
                <span style={{ color: 'var(--ink-strong)' }}>04</span> motion: regras de entrada/saída
              </div>
            </div>
          </div>

          <div style={{ aspectRatio: '16/9', background: 'var(--panel-alt)', border: '1px solid var(--line-soft)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '22px 0 6px' }}>
            <span style={{ width: 42, height: 42, border: '1px solid rgba(var(--accent-rgb), .5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-strong)', fontSize: 16 }}>▶</span>
            <span style={{ fontSize: 10.5, color: 'var(--faint)' }}>[ embed · vídeo do processo · vimeo/youtube ]</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--faint)', marginBottom: 22 }}>↑ timelapse do sistema em movimento (1:12)</div>

          <h2 className="display" style={{ ...h2, margin: '6px 0 12px' }}>Referências que ancoraram</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 22 }}>
            {[0, 1, 2].map((i) => (
              <Hatch key={i} ratio="3/4" label="[ ref ]" />
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 18, borderTop: '1px solid rgba(var(--line-rgb), .12)' }}>
            {['#identidade', '#motion', '#tipografia', '#making-of'].map((t) => (
              <span key={t} style={{ fontSize: 10, border: '1px solid var(--line-strong)', padding: '3px 8px', color: 'var(--muted)' }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(var(--line-rgb), .12)', fontSize: 11, color: 'var(--muted)' }}>
          <a data-route="feed" href="#/feed" style={{ color: 'var(--muted)', cursor: 'pointer' }}>← voltar ao feed</a>
          <a data-route="contato" href="#/contato" style={{ color: 'var(--ink-strong)', cursor: 'pointer' }}>tem um projeto assim? chama →</a>
        </div>
      </Panel>
    </Frame>
  )
}
