import { useState } from 'react'
import { Frame, ThemeDot } from '../components/Frame'
import { Panel, Dropdown } from '../components/ui'
import { PROJECTS, PROJECTS_BY_YEAR, PROJECT_PEOPLE, PROJECT_TYPES, PROJECT_YEARS } from '../data'

const COLS = '58px 1.7fr 1fr 0.95fr 60px'
const SORTS = ['recentes', 'antigos', 'a–z']

export function Projetos() {
  const [pessoa, setPessoa] = useState<string | null>(null)
  const [tipo, setTipo] = useState<string | null>(null)
  const [ano, setAno] = useState<string | null>(null)
  const [sort, setSort] = useState('recentes')

  const filtered = PROJECTS.filter(
    (p) =>
      (pessoa == null || (p.people.match(/@\w+/g) ?? ([] as string[])).includes(pessoa)) &&
      (tipo == null || p.type === tipo) &&
      (ano == null || p.year === ano),
  )
  const shown = [...filtered].sort((a, b) => {
    if (sort === 'a–z') return a.name.localeCompare(b.name)
    const recent = b.year.localeCompare(a.year)
    return sort === 'antigos' ? -recent : recent
  })

  const activeChips: [string, () => void][] = [
    ...(pessoa ? ([[pessoa, () => setPessoa(null)]] as [string, () => void][]) : []),
    ...(tipo ? ([[`tipo: ${tipo}`, () => setTipo(null)]] as [string, () => void][]) : []),
    ...(ano ? ([[`ano: ${ano}`, () => setAno(null)]] as [string, () => void][]) : []),
  ]
  const clearAll = () => {
    setPessoa(null)
    setTipo(null)
    setAno(null)
  }

  const rail = (
    <>
      <Panel tag="[ por ano ]" tight>
        <div style={{ fontSize: 11.5, lineHeight: 1.95, color: 'var(--body)' }}>
          {PROJECTS_BY_YEAR.map(([y, n]) => {
            const on = ano === y
            return (
              <button
                key={y}
                type="button"
                onClick={() => setAno(on ? null : y)}
                style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: on ? 'rgba(var(--accent-rgb), .12)' : 'none', border: 0, padding: '2px 4px', font: 'inherit', color: on ? 'var(--ink-strong)' : 'inherit', cursor: 'pointer', textAlign: 'left' }}
              >
                <span>{y}</span>
                <span style={{ color: 'var(--faint)' }}>{n}</span>
              </button>
            )
          })}
        </div>
      </Panel>
      <Panel tag="[ por tipo ]" tight>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {PROJECT_TYPES.map((t) => {
            const on = tipo === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(on ? null : t)}
                className={'pill' + (on ? ' on' : '')}
                style={{ padding: '3px 8px', fontSize: 10.5, font: 'inherit', cursor: 'pointer', color: on ? undefined : 'var(--muted)' }}
              >
                {t}
              </button>
            )
          })}
        </div>
      </Panel>
    </>
  )

  return (
    <Frame
      active="projetos"
      path="~/projetos"
      rail={rail}
      footerLabel={`sopa://projetos — ${PROJECTS.length} projetos`}
      footerMeta={
        <>
          <span>sort: {sort}</span>
          <span>PT/EN</span>
          <ThemeDot />
        </>
      }
    >
      <Panel tag="[ projetos — arquivo ]">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 11, marginBottom: 11, alignItems: 'center' }}>
          <span style={{ color: 'var(--faint)' }}>filtrar:</span>
          <Dropdown label="pessoa" value={pessoa} options={PROJECT_PEOPLE} onChange={setPessoa} />
          <Dropdown label="tipo" value={tipo} options={PROJECT_TYPES} onChange={setTipo} />
          <Dropdown label="ano" value={ano} options={PROJECT_YEARS} onChange={setAno} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, paddingBottom: 11, borderBottom: '1px solid rgba(var(--line-rgb), .14)' }}>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', fontSize: 10.5, alignItems: 'center' }}>
            {activeChips.length > 0 ? (
              <>
                <span style={{ color: 'var(--faint)' }}>ativos:</span>
                {activeChips.map(([label, clear]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={clear}
                    style={{ background: 'rgba(var(--accent-rgb), .14)', color: 'var(--ink-strong)', padding: '3px 9px', border: 0, font: 'inherit', fontSize: 10.5, cursor: 'pointer' }}
                  >
                    {label} ✕
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearAll}
                  style={{ background: 'none', border: 0, font: 'inherit', fontSize: 10.5, color: 'var(--faint)', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  limpar
                </button>
              </>
            ) : (
              <span style={{ color: 'var(--faint)' }}>sem filtros — {PROJECTS.length} projetos</span>
            )}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--muted)', display: 'flex', gap: 14, alignItems: 'center' }}>
            <Dropdown label="sort" value={sort} options={SORTS} onChange={(v) => setSort(v ?? 'recentes')} />
            <span style={{ color: 'var(--faint)' }}>
              {PROJECTS.length} · <span style={{ color: 'var(--ink)' }}>{shown.length} exibidos</span>
            </span>
          </div>
        </div>

        <div className="proj-head" style={{ display: 'grid', gridTemplateColumns: COLS, gap: 12, fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', padding: '9px 0 8px' }}>
          <span />
          <span>nome</span>
          <span>pessoas</span>
          <span>tipo</span>
          <span>ano</span>
        </div>

        {shown.map((p, i) => (
          <div key={p.name} className="proj-row" style={{ display: 'grid', gridTemplateColumns: COLS, gap: 12, alignItems: 'center', padding: '9px 0', borderTop: '1px solid rgba(var(--line-rgb), .08)', borderBottom: i === shown.length - 1 ? '1px solid rgba(var(--line-rgb), .08)' : undefined }}>
            <div
              className={p.video ? 'ph' : ''}
              style={{ width: 58, height: 36, background: p.video ? 'var(--panel-alt)' : 'var(--hatch)', border: '1px solid var(--line-soft)', color: 'var(--faint)', fontSize: 13 }}
            >
              {p.video ? '▶' : ''}
            </div>
            <div>
              <div className="display" style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>
                {p.name}
              </div>
              <div style={{ fontSize: 9.5, color: 'var(--faint)', marginTop: 2 }}>{p.tags}</div>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{p.people}</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{p.type}</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{p.year}</div>
          </div>
        ))}

        {shown.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--faint)', padding: '18px 0' }}>nenhum projeto com esse filtro.</div>
        )}
      </Panel>
    </Frame>
  )
}
