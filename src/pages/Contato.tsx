import { useState } from 'react'
import { Frame, ThemeDot } from '../components/Frame'
import { Panel } from '../components/ui'

const TYPES = ['presença digital', 'site / landing', 'identidade', 'campanha', 'comunidade', 'produto digital']
const BUDGET = ['até 5k', '5–15k', '15–40k', '40k+', 'a definir']
const DEADLINE = ['sem pressa', '1 mês', 'este trimestre', 'ontem']

function Toggle({ items, initial }: { items: string[]; initial: number[] }) {
  const [sel, setSel] = useState<Set<number>>(new Set(initial))
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {items.map((t, i) => {
        const on = sel.has(i)
        return (
          <span
            key={t}
            onClick={() =>
              setSel((prev) => {
                const next = new Set(prev)
                next.has(i) ? next.delete(i) : next.add(i)
                return next
              })
            }
            className={'pill' + (on ? ' on' : '')}
            style={{ fontSize: 11.5, padding: '5px 11px', cursor: 'pointer', color: on ? undefined : 'var(--ink)' }}
          >
            [{on ? 'x' : ' '}] {t}
          </span>
        )
      })}
    </div>
  )
}

function Single({ items, initial }: { items: string[]; initial: number }) {
  const [sel, setSel] = useState(initial)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
      {items.map((t, i) => (
        <span
          key={t}
          onClick={() => setSel(i)}
          className={'pill' + (sel === i ? ' on' : '')}
          style={{ fontSize: 11.5, padding: '5px 11px', cursor: 'pointer', color: sel === i ? undefined : 'var(--ink)' }}
        >
          {t}
        </span>
      ))}
    </div>
  )
}

export function Contato() {
  const rail = (
    <>
      <Panel tag="[ canais ]" tight>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 12 }}>
          {[
            ['email', 'oi@sopa.studio'],
            ['insta', '@sopa.studio'],
            ['discord', 'sopa.studio/dc'],
            ['base', 'SP · remoto'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ color: 'var(--faint)' }}>{k}</span>
              <span style={{ color: 'var(--ink)' }}>{v}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel tag="[ depois do envio ]" tight>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 11.5, lineHeight: 1.5 }}>
          {[
            ['01', 'a gente lê o brief inteiro'],
            ['02', 'monta um time com o repertório certo'],
            ['03', 'chama pra uma call de 30min'],
            ['04', 'manda proposta + escopo'],
          ].map(([n, t]) => (
            <div key={n} style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: 'var(--ink-strong)' }}>{n}</span>
              <span style={{ color: 'var(--body)' }}>{t}</span>
            </div>
          ))}
        </div>
      </Panel>
      <div style={{ border: '1px solid var(--line-yellow)', background: 'var(--panel-alt)', padding: '14px 13px', fontSize: 11.5, lineHeight: 1.6 }}>
        <div style={{ color: 'var(--ink-strong)' }}>● resposta em ~2 dias úteis</div>
        <div style={{ color: 'var(--faint)', marginTop: 4 }}>seg–sex · 10h–19h BRT</div>
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--faint)', lineHeight: 1.6, marginTop: 2 }}>
        // nada de formulário automático do outro lado. quem lê é gente do estúdio.
      </div>
    </>
  )

  return (
    <Frame
      active="contato"
      path="~/contato"
      rail={rail}
      railWide
      sidebarStatus={
        <>
          <div>
            <span className="on">●</span> aberto pra projetos
          </div>
          <div>agenda: ago · set 2026</div>
        </>
      }
      footerLabel="sopa://contato — brief"
      footerMeta={
        <>
          <span>
            <span className="on">●</span> aberto pra projetos
          </span>
          <span>PT/EN</span>
          <ThemeDot />
        </>
      }
    >
      <div style={{ padding: '18px 12px 12px' }}>
        <div style={{ fontSize: 12, color: 'var(--ink-strong)', marginBottom: 22 }}>
          &gt; ./contato --novo-brief
          <span className="cursor" />
        </div>
        <h2 className="display" style={{ fontWeight: 900, fontSize: 'clamp(38px,5vw,56px)', lineHeight: 0.92, letterSpacing: '-.03em', margin: 0, color: 'var(--ink)' }}>
          manda o brief.
          <br />a gente monta <span className="mark">o time.</span>
        </h2>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--body)', maxWidth: '60ch', margin: '22px 0 0' }}>
          Descreve o projeto em linhas gerais. A gente lê, junta um time com o repertório certo e responde em até 2 dias
          úteis.
        </p>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--faint)', maxWidth: '60ch', margin: '7px 0 0' }}>
          Sketch the project. We read it, assemble a crew with the right repertoire, and reply within 2 working days.
        </p>

        <div style={{ marginTop: 30 }}>
          <Panel tag="[ brief.txt ]" style={{ padding: '26px 22px 22px' }}>
            <div className="grid-2" style={{ gap: 18 }}>
              <label style={{ display: 'block' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 7 }}>nome / coletivo</div>
                <input className="field" placeholder="quem tá chamando" />
              </label>
              <label style={{ display: 'block' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 7 }}>email / @</div>
                <input className="field" placeholder="pra gente responder" />
              </label>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 9 }}>
                o que é <span style={{ color: 'var(--faint)' }}>— pode marcar mais de um</span>
              </div>
              <Toggle items={TYPES} initial={[0]} />
            </div>

            <div className="grid-2" style={{ gap: 22, marginTop: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 9 }}>orçamento</div>
                <Single items={BUDGET} initial={4} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 9 }}>prazo</div>
                <Single items={DEADLINE} initial={2} />
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 7 }}>conta mais</div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: 10, color: 'var(--ink-strong)', fontSize: 13 }}>&gt;</span>
                <textarea
                  className="field"
                  rows={4}
                  placeholder="o projeto, a vibe, referências, links do que já existe..."
                  style={{ paddingLeft: 28, resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--faint)' }}>
                ou manda direto pra <span style={{ color: 'var(--body)' }}>oi@sopa.studio</span>
              </div>
              <button className="btn-yellow" style={{ fontSize: 13, padding: '11px 22px' }}>
                enviar brief →
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </Frame>
  )
}
