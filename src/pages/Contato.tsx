import { useState } from 'react'
import { Frame, ThemeDot } from '../components/Frame'
import { Panel } from '../components/ui'

const TYPES = ['presença digital', 'site / landing', 'identidade', 'campanha', 'comunidade', 'produto digital']
const BUDGET = ['até 5k', '5–15k', '15–40k', '40k+', 'a definir']
const DEADLINE = ['sem pressa', '1 mês', 'este trimestre', 'ontem']

/** Endpoint do brief no marketing-portal. Sobrescrevível por VITE_SOPA_API pra
 *  apontar num portal local durante o desenvolvimento. */
const BRIEF_URL =
  (import.meta.env.VITE_SOPA_API as string | undefined)?.replace(/\/$/, '') ??
  'https://sopa.reelflip.com/api/sopa'

function Toggle({ items, value, onChange }: { items: string[]; value: Set<string>; onChange: (v: Set<string>) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {items.map((t) => {
        const on = value.has(t)
        return (
          <span
            key={t}
            onClick={() => {
              const next = new Set(value)
              next.has(t) ? next.delete(t) : next.add(t)
              onChange(next)
            }}
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

function Single({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
      {items.map((t) => (
        <span
          key={t}
          onClick={() => onChange(t)}
          className={'pill' + (value === t ? ' on' : '')}
          style={{ fontSize: 11.5, padding: '5px 11px', cursor: 'pointer', color: value === t ? undefined : 'var(--ink)' }}
        >
          {t}
        </span>
      ))}
    </div>
  )
}

type Status = { kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string }

export function Contato() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [types, setTypes] = useState<Set<string>>(new Set([TYPES[0]]))
  const [budget, setBudget] = useState(BUDGET[4])
  const [deadline, setDeadline] = useState(DEADLINE[2])
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('') // bots preenchem, gente não vê
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function submit() {
    if (status.kind === 'sending') return
    if (!name.trim() || !contact.trim() || message.trim().length < 10) {
      setStatus({ kind: 'error', message: 'Preencha nome, contato e conta um pouco mais (10+ caracteres).' })
      return
    }
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch(`${BRIEF_URL}/brief`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, contact, message, budget, deadline,
          types: [...types],
          website: honeypot,
        }),
      })
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? `Erro ${res.status}`)
      setStatus({ kind: 'sent' })
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Falha ao enviar.' })
    }
  }

  const rail = (
    <>
      <Panel tag="[ canais ]" tight>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 12 }}>
          {[
            ['brief', 'este formulário'],
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
                <input className="field" placeholder="quem tá chamando" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label style={{ display: 'block' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 7 }}>email / @</div>
                <input className="field" placeholder="pra gente responder" value={contact} onChange={(e) => setContact(e.target.value)} />
              </label>
            </div>

            {/* honeypot — fora da tela, invisível pra quem usa o site */}
            <input
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
            />

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 9 }}>
                o que é <span style={{ color: 'var(--faint)' }}>— pode marcar mais de um</span>
              </div>
              <Toggle items={TYPES} value={types} onChange={setTypes} />
            </div>

            <div className="grid-2" style={{ gap: 22, marginTop: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 9 }}>orçamento</div>
                <Single items={BUDGET} value={budget} onChange={setBudget} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 9 }}>prazo</div>
                <Single items={DEADLINE} value={deadline} onChange={setDeadline} />
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontSize: 11, color: status.kind === 'error' ? 'var(--ink-strong)' : 'var(--faint)' }}>
                {status.kind === 'error'
                  ? `⚠ ${status.message}`
                  : status.kind === 'sent'
                    ? '● brief recebido — a gente responde em até 2 dias úteis.'
                    : 'a gente lê o brief inteiro antes de responder.'}
              </div>
              <button
                className="btn-yellow"
                style={{ fontSize: 13, padding: '11px 22px', opacity: status.kind === 'sending' || status.kind === 'sent' ? 0.6 : 1 }}
                disabled={status.kind === 'sending' || status.kind === 'sent'}
                onClick={submit}
              >
                {status.kind === 'sending' ? 'enviando…' : status.kind === 'sent' ? 'enviado ✓' : 'enviar brief →'}
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </Frame>
  )
}
