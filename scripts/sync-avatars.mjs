// Sincroniza os avatares do site com o userbase da SkateHive (Supabase).
//
// Fonte de verdade: tabela `userbase_users` (colunas handle, avatar_url) no
// projeto Supabase do userbase. O site é estático, então a service-role key
// NÃO pode ir pro client — este script roda local e imprime o mapa
// handle → avatar_url pra você colar em src/people-overrides.ts (avatarUrl).
// Só precisa de override quem tem avatar melhor que o padrão do Hive, que já
// vem no src/people.generated.ts (via pnpm sync:people).
//
// Uso:
//   SUPABASE_USERBASE_URL=... SUPABASE_USERBASE_SERVICE_ROLE_KEY=... node scripts/sync-avatars.mjs
//
// Ou reaproveitando o .env.local do marketing-portal (default):
//   node scripts/sync-avatars.mjs
//
// Ele compara o banco com os avatarUrl atuais em src/data.ts e sinaliza drift.

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OVERRIDES_TS = resolve(__dirname, '../src/people-overrides.ts')
const PORTAL_ENV = process.env.PORTAL_ENV_PATH
  ?? '/Users/r4to/Script/skatehive/marketing-portal/.env.local'

async function loadCreds() {
  let url = process.env.SUPABASE_USERBASE_URL
  let key = process.env.SUPABASE_USERBASE_SERVICE_ROLE_KEY
  if (url && key) return { url, key }
  // fallback: parse do .env.local do portal
  try {
    const env = await readFile(PORTAL_ENV, 'utf8')
    const pick = (k) => env.match(new RegExp(`^${k}="?([^"\\n]+)"?`, 'm'))?.[1]
    url ??= pick('SUPABASE_USERBASE_URL')
    key ??= pick('SUPABASE_USERBASE_SERVICE_ROLE_KEY')
  } catch {
    // ignore — cai no erro abaixo
  }
  if (!url || !key) {
    console.error('Faltam SUPABASE_USERBASE_URL / SUPABASE_USERBASE_SERVICE_ROLE_KEY (env ou', PORTAL_ENV + ').')
    process.exit(1)
  }
  return { url, key }
}

// extrai os handles + avatarUrl atuais de src/people-overrides.ts sem importar TS
async function currentPeople() {
  const src = await readFile(OVERRIDES_TS, 'utf8')
  const people = []
  // cada entrada vai de `'<handle>': {` até o `}` que fecha o objeto
  for (const m of src.matchAll(/'([a-z0-9._-]+)':\s*\{([^}]*)\}/gi)) {
    people.push({ handle: m[1], avatarUrl: m[2].match(/avatarUrl:\s*'([^']+)'/)?.[1] ?? null })
  }
  return people
}

const { url, key } = await loadCreds()
const people = await currentPeople()
const handles = people.map((p) => p.handle)

const res = await fetch(
  `${url}/rest/v1/userbase_users?handle=in.(${handles.join(',')})&select=handle,avatar_url`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } },
)
if (!res.ok) {
  console.error('Erro no userbase:', res.status, await res.text())
  process.exit(1)
}
const rows = await res.json()
const dbByHandle = new Map(rows.map((r) => [r.handle, r.avatar_url]))

// sem override, o site usa o avatar padrão do Hive (vem de people.generated.ts)
const hiveDefault = (h) => `https://images.hive.blog/u/${h}/avatar`

let drift = 0
console.log('handle           status   avatar_url (banco)')
for (const p of people) {
  const db = dbByHandle.get(p.handle) ?? null
  const emUso = p.avatarUrl ?? hiveDefault(p.handle)
  const same = db === emUso
  if (db != null && !same) drift++
  const status = db == null ? 'SEM-BD' : same ? 'ok' : 'DRIFT'
  console.log(`@${p.handle.padEnd(15)} ${status.padEnd(7)} ${db ?? '—'}`)
}
console.log(`\n${people.length} pessoas · ${drift} com drift.`)
if (drift) console.log('→ atualize avatarUrl em src/people-overrides.ts com os valores acima.')
