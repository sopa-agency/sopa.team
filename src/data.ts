import { REMOTE_PEOPLE, GENERATED_AT } from './people.generated'
import { PEOPLE_OVERRIDES } from './people-overrides'

export type Route =
  | 'home'
  | 'pessoas'
  | 'perfil'
  | 'feed'
  | 'projetos'
  | 'capacidades'
  | 'contato'
  | 'post'

/* curatorial grouping above raw skills; drives the /pessoas território filter */
export const TERRITORY_KEYS = [
  'design / motion',
  'dev / web3',
  'vídeo',
  'estratégia / produto',
  'social / conteúdo',
  'comunidade',
] as const
export type Territory = (typeof TERRITORY_KEYS)[number]

export type Person = {
  handle: string
  initials: string
  roles: string
  territory: Territory
  /** avatar real (userbase da SkateHive ou padrão do Hive). fallback → iniciais */
  avatarUrl?: string
  /** bio escrita pela pessoa no portal; null quando ainda não preencheu */
  bio: string | null
  /** skill → score 0–100 (MemberSkills no portal), já ordenado desc e sem zeros */
  skills: Record<string, number>
}

/** O diretório = cadastro do portal (bio, skills, roster) ⋈ curadoria local.
 *  Regerar o lado do portal com `pnpm sync:people`; editar o resto em
 *  people-overrides.ts, que também decide quem aparece (contas de marca da
 *  allowlist ficam de fora por não terem entrada lá).
 *  A ordem é a das chaves de PEOPLE_OVERRIDES. */
const REMOTE_BY_USER = new Map(REMOTE_PEOPLE.map((p) => [p.username, p]))

export const PEOPLE: Person[] = Object.entries(PEOPLE_OVERRIDES).flatMap(([username, o]) => {
  const remote = REMOTE_BY_USER.get(username)
  if (!remote) return [] // saiu da allowlist do portal — some do site até voltar
  return [{
    handle: `@${username}`,
    initials: o.initials,
    roles: o.roles,
    territory: o.territory,
    avatarUrl: o.avatarUrl ?? remote.avatarUrl ?? undefined,
    bio: remote.bio,
    skills: remote.skills,
  }]
})

/** Quando o cadastro foi puxado do portal. */
export { GENERATED_AT as PEOPLE_SYNCED_AT }

/** Rotas no ar. `feed`, `projetos`, `capacidades` e `post` seguem no repo (as
 *  páginas e o conteúdo de exemplo continuam em pages/), mas dependem de dados
 *  que ainda não existem no portal — ver docs/cadastro-pessoas.md. Enquanto isso
 *  saem da navegação E do router: a URL cai na home em vez de servir mock. */
export const PUBLISHED_ROUTES: Route[] = ['home', 'pessoas', 'perfil', 'contato']

/* declarado depois de PEOPLE porque o contador é derivado do diretório real */
export const NAV: { route: Route; label: string; count?: string }[] = [
  { route: 'home', label: 'home' },
  { route: 'pessoas', label: 'pessoas', count: `(${PEOPLE.length})` },
  { route: 'contato', label: 'contato' },
]

/* Home "pessoas" preview cards */
export const HOME_PEOPLE = PEOPLE.slice(0, 4)

/** Fisher-Yates — retorna uma nova ordem a cada chamada, sem mutar o original.
 *  Use com useMemo([]) pra embaralhar uma vez por montagem (não a cada render). */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* unique skill tokens across everyone's roles — feeds the /pessoas skill filter */
export const SKILLS: string[] = [...new Set(PEOPLE.flatMap((p) => p.roles.split(' · ')))]

/* derived so the rail always matches the actual roster */
export const TERRITORIES: [string, number][] = TERRITORY_KEYS.map((k) => [
  k,
  PEOPLE.filter((p) => p.territory === k).length,
])

/* --- feed --- */
export type SocialPost = {
  kind: 'social'
  person: Person
  source: 'farcaster' | 'x' | 'instagram'
  time: string
  channel?: string
  text: string
  media?: { ratio: string; label: string }
  stats: string[]
}
export type BlogPost = {
  kind: 'blog'
  title: string
  author: string
  time: string
  read: string
  cover: string
  /** only one post is actually written; others are non-clickable teasers */
  post?: boolean
}
export type FeedItem = SocialPost | BlogPost

const P = Object.fromEntries(PEOPLE.map((p) => [p.handle, p])) as Record<string, Person>

export const FEED: FeedItem[] = [
  {
    kind: 'social',
    person: P['@willdias'],
    source: 'farcaster',
    time: '2h',
    channel: '/criativo',
    text: 'subi o contrato de RSVP on-chain na testnet. mint gasless via relayer e a lista fecha sozinha quando lota. quem quiser testar (e quebrar), tá aberto pra todo mundo →',
    stats: ['♥ 96', '↻ 21', '↩ 14'],
  },
  {
    kind: 'blog',
    title: 'Identidade viva pra rave XYZ — do brief ao motion',
    author: '@xvlad',
    time: '2d',
    read: 'leitura 4 min',
    cover: '[ imagem de capa · 16:9 ]',
    post: true, // the one written post — see pages/Post.tsx
  },
  {
    kind: 'social',
    person: P['@bielcx'],
    source: 'x',
    time: '5h',
    text: 'marca não é logo. logo é a parte da marca que cabe num favicon. o resto é comportamento — como ela se move, fala e reage quando ninguém pediu.',
    stats: ['♥ 210', '↻ 48', '↩ 17'],
  },
  {
    kind: 'social',
    person: P['@louzoshi'],
    source: 'instagram',
    time: '8h',
    media: { ratio: '4 / 5', label: '[ render · loop 3D · 00:06 ]' },
    text: 'drop de inverno girando infinito. a versão com som tá no story — passa lá.',
    stats: ['♥ 431', '▢ 26'],
  },
  {
    kind: 'social',
    person: P['@joaoparmagnani'],
    source: 'farcaster',
    time: '12h',
    channel: '/social',
    text: 'discovery da semana: 7 entrevistas, 1 conclusão. ninguém quer "mais uma rede". querem um lugar onde o portfólio se atualiza sozinho enquanto a pessoa trabalha.',
    stats: ['♥ 74', '↻ 12', '↩ 8'],
  },
  {
    kind: 'social',
    person: P['@r4topunk'],
    source: 'x',
    time: '1d',
    text: 'thread: como a gente transformou um discord parado em 300 pessoas ativas em 6 semanas — sem sortear iphone, sem bot de nível. só ritmo e gente de verdade. (1/9)',
    stats: ['♥ 158', '↻ 39', '↩ 22'],
  },
  {
    kind: 'blog',
    title: 'RSVP on-chain — arquitetura do contrato, passo a passo',
    author: '@willdias',
    time: '3d',
    read: 'leitura 7 min',
    cover: '[ imagem de capa · diagrama do contrato ]',
  },
  {
    kind: 'social',
    person: P['@vaipraonde'],
    source: 'instagram',
    time: '1d',
    media: { ratio: '1 / 1', label: '[ still · doc da line-up · frame 042 ]' },
    text: 'bastidor do corte. 3 dias de gravação viraram 4 minutos — valeu cada take.',
    stats: ['♥ 289', '▢ 15'],
  },
  {
    kind: 'social',
    person: P['@mengao'],
    source: 'farcaster',
    time: '2d',
    channel: '/dev',
    text: 'número que ninguém olha e devia: o tempo entre "entrou no coletivo" e "primeiro post". caiu de 9 dias pra 2 quando puxamos o onboarding pro feed.',
    stats: ['♥ 63', '↻ 9', '↩ 5'],
  },
  {
    kind: 'blog',
    title: 'Loop 3D do drop de inverno — breakdown técnico',
    author: '@louzoshi',
    time: '4d',
    read: 'leitura 5 min',
    cover: '[ imagem de capa · breakdown 3D ]',
  },
  {
    kind: 'social',
    person: P['@xvlad'],
    source: 'x',
    time: '2d',
    text: 'dica chata mas real: nomeia tuas camadas. teu "eu do futuro" e todo mundo que abrir teu arquivo agradecem.',
    stats: ['♥ 122', '↻ 18', '↩ 6'],
  },
  {
    kind: 'social',
    person: P['@humbertoperes'],
    source: 'instagram',
    time: '3d',
    media: { ratio: '1 / 1', label: '[ foto · meetup sopa #04 · lab ]' },
    text: 'meetup #04 lotou o lab. no próximo vai ter call aberta pra quem tá chegando agora.',
    stats: ['♥ 204', '▢ 11'],
  },
]

export const FEED_SOURCES: [string, number][] = [
  ['farcaster', 38],
  ['x', 51],
  ['instagram', 33],
  ['hive · blog', 20],
]

/* --- projetos --- */
export type Project = {
  name: string
  tags: string
  people: string
  type: string
  year: string
  video?: boolean
}
export const PROJECTS: Project[] = [
  { name: 'Presença digital — Festival Maré', tags: 'web · identidade · web3', people: '@bielcx @xvlad +1', type: 'site + id', year: '2025' },
  { name: 'RSVP on-chain', tags: 'web3 · produto', people: '@willdias @joaoparmagnani', type: 'produto', year: '2025' },
  { name: 'Drop de inverno', tags: 'campanha · social', people: '@r4topunk @vaipraonde +1', type: 'campanha', year: '2025' },
  { name: 'Fanzine #03', tags: 'editorial · print', people: '@r4topunk @xvlad +1', type: 'editorial', year: '2024' },
  { name: 'Identidade — coletivo de skate', tags: 'identidade · brand', people: '@bielcx @louzoshi', type: 'identidade', year: '2024' },
  { name: 'Doc da line-up', tags: 'vídeo · doc', people: '@vaipraonde', type: 'vídeo', year: '2024', video: true },
]

/* derived so year facets + counts always reflect PROJECTS */
export const PROJECT_YEARS: string[] = [...new Set(PROJECTS.map((p) => p.year))].sort((a, b) => b.localeCompare(a))
export const PROJECT_TYPES: string[] = [...new Set(PROJECTS.map((p) => p.type))]
export const PROJECTS_BY_YEAR: [string, number][] = PROJECT_YEARS.map((y) => [
  y,
  PROJECTS.filter((p) => p.year === y).length,
])

/** unique @handles mentioned across all projects (parsed from the people string) */
export const PROJECT_PEOPLE: string[] = [
  ...new Set(PROJECTS.flatMap((p) => p.people.match(/@\w+/g) ?? [])),
]

/* --- capacidades --- */
export type Capability = {
  n: string
  title: string
  desc: string
  peopleCount: number
  people: string
  extra: number
}
export const CAPABILITIES: Capability[] = [
  { n: '01', title: 'Presença digital', desc: 'Colocar um projeto no mundo digital com cara própria — não um site genérico, uma presença.', peopleCount: 7, people: '@bielcx @xvlad @nogenta @mengao', extra: 3 },
  { n: '02', title: 'Sites e landing pages', desc: 'Do Figma ao código, rápido e sólido — landing de drop, site de festival, mini-app.', peopleCount: 5, people: '@nogenta @willdias @xvlad', extra: 2 },
  { n: '03', title: 'Narrativa e identidade', desc: 'Nome, tom, símbolo e sistema — a marca como algo vivo, não um logo parado.', peopleCount: 6, people: '@bielcx @xvlad @r4topunk @louzoshi', extra: 2 },
  { n: '04', title: 'Campanha de conteúdo', desc: 'Ritmo de posts, cortes e narrativa por temporada — feito pra ter presença constante.', peopleCount: 4, people: '@r4topunk @vaipraonde @joaoparmagnani', extra: 1 },
  { n: '05', title: 'Ativação de comunidade', desc: 'Transformar audiência em crew — eventos, drops, presença no Discord e IRL.', peopleCount: 8, people: '@humbertoperes @r4topunk @mengao', extra: 5 },
  { n: '06', title: 'Protótipos e produtos digitais', desc: 'Testar ideias como produto de verdade — inclusive on-chain, quando faz sentido.', peopleCount: 4, people: '@willdias @joaoparmagnani @nogenta', extra: 1 },
]

/* home capacidades short list */
export const CAPABILITIES_SHORT: [string, string][] = [
  ['presença digital', '7p · 4pj'],
  ['sites e landing pages', '5p · 6pj'],
  ['narrativa e identidade', '6p · 5pj'],
  ['campanha de conteúdo', '4p · 3pj'],
  ['ativação de comunidade', '8p · 4pj'],
  ['protótipos e produtos digitais', '4p · 3pj'],
]

/* home feed preview */
export const HOME_FEED = [
  { date: '28.06 · 14:02', tag: 'making-of', title: 'Identidade viva pra rave XYZ — do brief ao motion', by: '@xvlad · design' },
  { date: '26.06 · 09:40', tag: '▶ vídeo', title: 'Corte do doc da line-up — 3min', by: '@vaipraonde · vídeo' },
  { date: '24.06 · 17:15', tag: 'estudo', title: 'Tipografia de fanzine dos anos 90 — referências', by: '@r4topunk · conteúdo' },
  { date: '21.06 · 11:30', tag: 'protótipo', title: 'Mini-app de RSVP on-chain — primeiro fluxo', by: '@willdias · dev' },
]

/* home projetos preview */
export const HOME_PROJECTS = [
  { title: 'Presença digital — Festival Maré', meta: 'site + identidade · 2025', people: '@bielcx · @xvlad · @willdias', tags: ['web', 'identidade', 'web3'] },
  { title: 'RSVP on-chain', meta: 'produto digital · 2025', people: '@willdias · @joaoparmagnani', tags: ['web3', 'produto'] },
]
