// Sincroniza o cadastro de pessoas com o marketing-portal (fonte de verdade).
//
// Fonte: GET /api/sopa/site-data no portal — endpoint público read-only que
// devolve { people, projects, capabilities, feed }. Hoje só `people` tem dado
// aproveitável (bio + skills reais, de MemberSkills); projects/capabilities/feed
// continuam curatoriais aqui no site. Este script só lê `people`.
//
// O site é estático (Vite SPA), então nada disso roda no client: o script gera
// src/people.generated.ts, que é COMMITADO. O build nunca depende da rede.
//
// Uso:
//   pnpm sync:people                      # busca do portal em produção
//   SOPA_SITE_DATA_URL=http://localhost:3000/api/sopa/site-data pnpm sync:people
//   pnpm sync:people -- --from snap.json  # ingere um snapshot local do payload
//
// O que é curatorial (território, roles, posts, avatar do userbase) mora em
// src/people-overrides.ts e NÃO é tocado aqui. Quem está no portal mas não tem
// override fica fora do diretório — o script avisa.

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../src/people.generated.ts')
const OVERRIDES = resolve(__dirname, '../src/people-overrides.ts')

const DEFAULT_URL = 'https://sopa.reelflip.com/api/sopa/site-data'

async function loadPayload() {
  const fromIdx = process.argv.indexOf('--from')
  if (fromIdx !== -1) {
    const file = process.argv[fromIdx + 1]
    if (!file) {
      console.error('--from precisa do caminho do arquivo JSON.')
      process.exit(1)
    }
    console.error(`fonte: snapshot ${file}`)
    return JSON.parse(await readFile(resolve(process.cwd(), file), 'utf8'))
  }

  const url = process.env.SOPA_SITE_DATA_URL ?? DEFAULT_URL
  console.error(`fonte: ${url}`)
  const res = await fetch(url, { redirect: 'manual' })
  if (res.status >= 300 && res.status < 400) {
    console.error(
      `\n${res.status} → ${res.headers.get('location')}\n` +
        'O endpoint caiu no gate de sessão. Ele precisa estar na whitelist do\n' +
        'middleware do portal (src/proxy.ts, PUBLIC_PATHS) e deployado.',
    )
    process.exit(1)
  }
  if (!res.ok) {
    console.error(`HTTP ${res.status} ao buscar ${url}`)
    process.exit(1)
  }
  return res.json()
}

/** Handles com override curatorial — só eles entram no diretório. */
async function readOverrideHandles() {
  try {
    const src = await readFile(OVERRIDES, 'utf8')
    return new Set([...src.matchAll(/^\s*'([a-z0-9._-]+)':/gim)].map((m) => m[1]))
  } catch {
    return new Set()
  }
}

const payload = await loadPayload()
if (!Array.isArray(payload?.people)) {
  console.error('payload sem `people[]` — formato inesperado.')
  process.exit(1)
}

/** Só os campos que o portal é dono. Skills sem score (0/ausente) são descartados. */
const people = payload.people.map((p) => {
  const skills = Object.fromEntries(
    Object.entries(p.skills ?? {})
      .filter(([, v]) => typeof v === 'number' && v > 0)
      .sort((a, b) => b[1] - a[1]),
  )
  return {
    username: String(p.username),
    bio: typeof p.bio === 'string' && p.bio.trim() ? p.bio.trim() : null,
    skills,
    avatarUrl: typeof p.avatarUrl === 'string' ? p.avatarUrl : null,
  }
})

const overrides = await readOverrideHandles()
const semOverride = people.filter((p) => !overrides.has(p.username)).map((p) => p.username)
const orfaos = [...overrides].filter((h) => !people.some((p) => p.username === h))

const body = `// GERADO por scripts/sync-people.mjs — NÃO EDITE À MÃO.
// Fonte: marketing-portal /api/sopa/site-data (campo \`people\`).
// Regerar: pnpm sync:people
// O que é curatorial (território, roles, posts, avatar) mora em people-overrides.ts.

export type RemotePerson = {
  username: string
  /** bio escrita pela pessoa no portal; null quando vazia */
  bio: string | null
  /** skill → score 0–100, já ordenado desc e sem zeros */
  skills: Record<string, number>
  avatarUrl: string | null
}

export const GENERATED_AT = '${payload.generatedAt ?? new Date().toISOString()}'

export const REMOTE_PEOPLE: RemotePerson[] = ${JSON.stringify(people, null, 2)}
`

await writeFile(OUT, body)

console.error(`\nok — ${people.length} pessoas → src/people.generated.ts`)
if (semOverride.length) {
  console.error(`  fora do diretório (sem override): ${semOverride.join(', ')}`)
}
if (orfaos.length) {
  console.error(`  ⚠ override sem correspondente no portal: ${orfaos.join(', ')}`)
}
