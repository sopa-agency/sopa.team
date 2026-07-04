import { useMemo, useState } from 'react'
import { Frame, ThemeDot } from '../components/Frame'
import { Panel, Dropdown, Avatar } from '../components/ui'
import { PEOPLE, TERRITORIES, TERRITORY_KEYS, SKILLS, shuffle } from '../data'

export function Pessoas() {
  const [territory, setTerritory] = useState<string | null>(null)
  const [skill, setSkill] = useState<string | null>(null)
  // ordem aleatória, fixa enquanto a página está montada (não re-embaralha ao filtrar)
  const ordered = useMemo(() => shuffle(PEOPLE), [])

  const shown = ordered.filter(
    (p) =>
      (territory == null || p.territory === territory) &&
      (skill == null || p.roles.split(' · ').includes(skill)),
  )

  const rail = (
    <>
      <Panel tag="[ territórios ]" tight>
        <div style={{ fontSize: 11.5, lineHeight: 1.95, color: 'var(--body)' }}>
          {TERRITORIES.map(([k, n]) => {
            const on = territory === k
            return (
              <button
                key={k}
                type="button"
                onClick={() => setTerritory(on ? null : (k as string))}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  background: on ? 'rgba(var(--accent-rgb), .12)' : 'none',
                  border: 0,
                  padding: '2px 4px',
                  font: 'inherit',
                  color: on ? 'var(--ink-strong)' : 'inherit',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>{k}</span>
                <span style={{ color: 'var(--faint)' }}>{n}</span>
              </button>
            )
          })}
        </div>
      </Panel>
      <Panel tag="[ entrar no coletivo ]" tight accent>
        <div className="display" style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)', lineHeight: 1.15 }}>
          Faz parte da rede Gnars?
        </div>
        <div data-route="contato" className="btn-yellow" style={{ fontSize: 11.5, padding: '8px 12px', textAlign: 'center', marginTop: 11, cursor: 'pointer' }}>
          candidatar perfil →
        </div>
      </Panel>
    </>
  )

  return (
    <Frame
      active="pessoas"
      path="~/pessoas"
      rail={rail}
      footerLabel={`sopa://pessoas — ${PEOPLE.length} perfis`}
      footerMeta={
        <>
          <span>
            <span className="on">●</span>
            {PEOPLE.length}
          </span>
          <span>PT/EN</span>
          <ThemeDot />
        </>
      }
    >
      <Panel tag="[ pessoas — diretório ]">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 11, alignItems: 'center' }}>
            <span style={{ color: 'var(--faint)' }}>filtrar:</span>
            <Dropdown label="território" value={territory} options={[...TERRITORY_KEYS]} onChange={setTerritory} />
            <Dropdown label="skill" value={skill} options={SKILLS} onChange={setSkill} />
            {(territory || skill) && (
              <button
                type="button"
                onClick={() => {
                  setTerritory(null)
                  setSkill(null)
                }}
                style={{ background: 'none', border: 0, font: 'inherit', fontSize: 11, color: 'var(--faint)', textDecoration: 'underline', cursor: 'pointer' }}
              >
                limpar
              </button>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--faint)' }}>
            {shown.length === PEOPLE.length ? `${PEOPLE.length} pessoas` : `${shown.length} de ${PEOPLE.length}`}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 82px 22px', gap: 12, fontSize: 10, color: 'var(--faint)', textTransform: 'uppercase', padding: '0 0 8px', borderBottom: '1px solid rgba(var(--line-rgb), .14)' }}>
          <span />
          <span>nome</span>
          <span>posts</span>
          <span />
        </div>

        {shown.map((p) => (
          <div
            key={p.handle}
            data-person
            data-route="perfil"
            data-param={p.handle.slice(1)}
            style={{ display: 'grid', gridTemplateColumns: '40px 1fr 82px 22px', gap: 12, alignItems: 'center', padding: '9px 0', borderTop: '1px solid rgba(var(--line-rgb), .08)', cursor: 'pointer' }}
          >
            <Avatar src={p.avatarUrl} initials={p.initials} size={38} />
            <div>
              <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 700 }}>{p.handle}</div>
              <div style={{ fontSize: 10, color: 'var(--ink-strong)', marginTop: 2, textTransform: 'uppercase' }}>{p.roles}</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--body)' }}>
              {p.posts} <span style={{ color: 'var(--faint)' }}>posts</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-strong)', textAlign: 'right' }}>→</div>
          </div>
        ))}

        {shown.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--faint)', padding: '18px 0' }}>ninguém com esse filtro.</div>
        )}
      </Panel>
    </Frame>
  )
}
