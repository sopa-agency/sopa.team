# /feed — proposta de UI

> **Status:** proposta. Nada aqui está implementado.
> **Objetivo:** trocar a lista estilo blog por uma **timeline coletiva** — volume dominado por snaps do Hive e casts do Farcaster (texto curto + mídia), com blog long-form como minoria nobre.
> **Restrições herdadas:** Vite + React + TS, zero dependências, 3 temas (`light` / `amarelo` / `matrix`), toda cor via `var()` já existente em `src/index.css`, rail some < 1040px, sidebar vira tab-strip < 720px.

---

## 1. Decisões de design

### D1 — O chrome é terminal, o conteúdo é social

**A tensão central:** feed de rede social pede mídia grande, avatar, densidade vertical, scroll longo. TUI pede painel `<fieldset>`, tag `[ nome ]`, hachura, tudo em mono e comprimido.

**Resolução:** a divisão não é "50% de cada", é **por camada**. Tudo que é moldura (sidebar, rail, header sticky, rodapé, estados, botões) fica 100% terminal. Tudo que é conteúdo do post (avatar, texto, mídia) fica 100% social, sem enfeite TUI por cima. Não existe hachura decorativa sobre foto, não existe borda ASCII em volta de imagem, não existe `[ ]` dentro do post.

**Por quê:** a estética morre se aplicada ao conteúdo — 40 posts com tag flutuante `[ post ]` viram ruído, e a foto de skate não fica mais "terminal" por ter uma borda pontilhada. O que dá identidade é o entorno.

### D2 — Timeline é um buffer contínuo, não uma pilha de cards

Os posts **não** são `Panel` separados com gap. São blocos empilhados dentro de um único container `--panel`, separados por `border-top: 1px solid var(--line)`. Sem `border-radius` além dos 3px do projeto, sem `box-shadow`, sem margem entre posts.

**Por quê:** dois ganhos de uma vez. (a) Cards flutuantes com sombra são o vocabulário do Instagram/Twitter genérico — o projeto inteiro (`Pessoas`, `Perfil`) usa linhas divisórias 1px, e a timeline herda isso. (b) Um bloco contínuo de `--panel` lê como *buffer de terminal* — que é literalmente o que é.

**Custo aceito:** a onda ASCII de fundo não passa atrás da coluna central. Ela respira nas margens, na sidebar e no rail. Legibilidade de texto corrido ganha da textura.

### D3 — Coluna única de 620px, centrada, sem grid de galeria

Uma coluna, `max-width: 620px`, `margin: 0 auto` dentro de `.main`. Nada de masonry, nada de 2 colunas em desktop.

**Por quê:** timeline cronológica só funciona em coluna única — grid de mídia é vocabulário de portfólio, e o usuário pediu explicitamente que não pareça portfólio. 620px também é o que já existe hoje (`maxWidth: 640`) e mantém a linha de texto legível (~68 caracteres em Space Mono 13px).

### D4 — Header sticky no lugar da `<Panel>` tag

A coluna começa com uma barra `position: sticky; top: <altura do chrome>` que carrega `[ timeline ]`, a contagem carregada e os chips de filtro. É a única concessão de "app" na página.

**Por quê:** o `.panel > .tag` flutuante pressupõe um bloco de altura finita; a timeline é infinita. A barra sticky resolve o mesmo problema (rotular o bloco) e ganha a função de status line de terminal — que é exatamente o registro do projeto.

### D5 — Origem é texto mono, nunca cor de marca nem logo

Cada post carrega um token: `hive/snap`, `hive/blog`, `fc/cast`. Cor `--muted` em repouso, `--ink-strong` no hover. Sem SVG, sem vermelho do Hive, sem roxo do Farcaster.

**Por quê:** três razões duras. (a) Nenhum token do projeto contém essas cores — inventá-las quebra especialmente o `matrix`, onde a paleta inteira é verde e um roxo vira corpo estranho. (b) Zero deps significa zero lib de ícone; SVG inline por plataforma é dívida sem retorno. (c) 40 badges coloridos numa coluna viram semáforo. Texto mono é discreto e escala.

### D6 — Sem métricas de engajamento

Nada de `♥ 96 · ↻ 21`. O payload real (`id, platform, authorHandle, authorSlug, text, url, postedAt, media[]`) não tem contadores, e o mock atual inventa números.

**Por quê:** o README já estabelece a regra — "números de marca agregados são flavor; tudo drilável é real". Métricas por post são drilável-falso, o pior tipo. E a ausência delas é justamente o que separa "timeline de um coletivo" de "clone de rede social": aqui o que importa é *quem* postou e *o quê*, não quantos likes tirou.

### D7 — Paginação por botão explícito, não infinite scroll

`[ carregar mais ▾ ]` full-width no fim da lista, estilo `.btn-ghost`.

**Por quê:** o `chrome.bottom` (`sopa://feed — timeline agregada`) faz parte da identidade da página e infinite scroll o torna inalcançável para sempre. Também evita `IntersectionObserver` + restauração de scroll, que é complexidade real sem ganho para um feed do tamanho deste. **Alternativa considerada:** sentinel com auto-load. Descartada pelo rodapé.

### D8 — O feed é a porta de entrada para o resto do site

Avatar e handle linkam para `/perfil/<slug>` (rota interna, via `data-route`). O par `origem + timestamp` linka para a rede externa. São os dois únicos alvos de clique no cabeçalho, e eles vão para lugares opostos de propósito.

**Por quê:** um agregador que só manda para fora é um leitor RSS. Amarrar autor → perfil transforma o volume do feed em tráfego para o diretório, que é o ativo real do site. E é convenção de rede social conhecida (no Twitter/Mastodon o timestamp é o permalink).

---

## 2. Inventário de componentes

Tipos compartilhados (proposta para `src/feed-types.ts` ou extensão de `data.ts`):

```ts
export type Platform = 'hive' | 'farcaster'
export type PostFormat = 'snap' | 'cast' | 'blog'

export type Media = { type: 'image' | 'video'; url: string }

/** o que o backend entrega */
export type RawPost = {
  id: string
  platform: Platform
  authorHandle: string
  authorSlug: string
  text: string
  url: string
  postedAt: string        // ISO
  media: Media[]
  title?: string          // presente ⇒ blog long-form (ver GAP-1)
}

/** o que a UI consome — cru + derivados resolvidos uma vez */
export type FeedEntry = RawPost & {
  format: PostFormat
  person: Person | null   // null = autor fora do PEOPLE (não linka perfil)
  originUrl: string       // já reescrito para skatehive quando hive
}

export type FeedFilter = 'tudo' | 'hive' | 'farcaster' | 'blogs'
export type FeedStatus = 'idle' | 'loading' | 'loading-more' | 'error' | 'done'
```

| Componente | Responsabilidade | Quando aparece |
|---|---|---|
| `Feed` | Página: monta `Frame`, header sticky, rail, delega lista ao `FeedTimeline` | rota `/feed` |
| `useFeed` | Hook: fetch + cursor + filtro + estados; único dono de rede | dentro de `Feed` |
| `FeedTimeline` | Empilha os posts com divisória 1px e renderiza os estados de borda | sempre |
| `PostCard` | Dispatcher: escolhe o corpo por `format`, monta header/body/mídia | 1 por post |
| `PostHeader` | Avatar + handle + roles + origem + tempo + `↗`; os dois links opostos (D8) | 1 por post |
| `PostBody` | Texto linkificado com clamp de 8 linhas | posts com `text` |
| `MediaGrid` | Escolhe o arranjo por `media.length` e a proporção do bloco | posts com mídia |
| `MediaCell` | Uma célula: `<img>` ou `<video>` nativo, com fallback de erro | dentro do grid |
| `SourceTag` | Renderiza `hive/snap` \| `fc/cast` \| `hive/blog` | dentro do header |
| `PostTime` | `<time>` com relativo curto + `title` da data completa | dentro do header |
| `LoadMore` | Botão de paginação com estados carregando/fim | pé da lista |
| `FeedNotice` | Bloco TUI genérico para vazio / erro / fim — tag + mensagem + ação | estados |
| `FeedSkeleton` | 3 esqueletos usando o `Hatch` existente | primeira carga |

### Props

```tsx
function Feed(): JSX.Element

function useFeed(filter: FeedFilter): {
  entries: FeedEntry[]
  status: FeedStatus
  hasMore: boolean
  total: number | null      // do backend; null se desconhecido
  error: string | null
  loadMore: () => void
  retry: () => void
}

function FeedTimeline(props: {
  entries: FeedEntry[]
  status: FeedStatus
  hasMore: boolean
  error: string | null
  onLoadMore: () => void
  onRetry: () => void
  onClearFilter?: () => void   // presente só quando há filtro ativo
}): JSX.Element

function PostCard(props: { entry: FeedEntry }): JSX.Element

function PostHeader(props: {
  person: Person | null
  handle: string          // '@willdias' — usado quando person é null
  slug: string
  platform: Platform
  format: PostFormat
  postedAt: string
  originUrl: string
}): JSX.Element

function PostBody(props: {
  text: string
  size?: 'sm' | 'lg'      // 'lg' quando não há mídia (D: texto vira o peso)
  clampLines?: number     // default 8
  originUrl: string       // destino do "ver completo ↗"
}): JSX.Element

function MediaGrid(props: {
  media: Media[]
  originUrl: string       // clique numa célula abre o post na origem
  variant?: 'inline' | 'cover'  // 'cover' = capa 16:9 do blog
}): JSX.Element

function MediaCell(props: {
  item: Media
  ratio: string           // '4 / 5' | '1 / 1' | '16 / 9'
  overflow?: number       // +N no canto da última célula
  href: string
}): JSX.Element

function SourceTag(props: { platform: Platform; format: PostFormat }): JSX.Element

function PostTime(props: { iso: string }): JSX.Element

function LoadMore(props: {
  status: FeedStatus
  hasMore: boolean
  loaded: number
  total: number | null
  onClick: () => void
}): JSX.Element

function FeedNotice(props: {
  tag: string             // '[ vazio ]' | '[ erro ]' | '[ eof ]'
  children: ReactNode
  action?: { label: string; onClick: () => void }
}): JSX.Element

function FeedSkeleton(props: { count?: number }): JSX.Element   // default 3
```

### Utilitários (funções puras, sem componente)

```ts
/** Hive sempre abre na skatehive; Farcaster mantém a url do payload. */
export function originUrl(p: RawPost): string {
  if (p.platform !== 'hive') return p.url
  const author = (p.authorSlug || p.authorHandle).replace(/^@/, '')
  const permlink = p.url.split('?')[0].replace(/\/+$/, '').split('/').pop() ?? ''
  return `https://skatehive.app/post/${author}/${permlink}`
}

/** '4min' | '2h' | '3d' | '28.06' | '28.06.24' */
export function relTime(iso: string, now = Date.now()): string

/** URLs → <a> externo truncado; @handle → data-route="perfil" se estiver em PEOPLE.
 *  Retorna ReactNode[]. NUNCA usa dangerouslySetInnerHTML. */
export function linkify(text: string): ReactNode[]

/** remove ![alt](url) e <center>/<div> do markdown do Hive — a imagem já veio em media[] */
export function stripHiveMarkup(text: string): string
```

---

## 3. Wireframes ASCII

### 3.1 Layout da página (desktop ≥ 1040px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ● SOPA — studio.tui · ~/feed                          ● 12 no coletivo   │  chrome.top (sticky)
├────────────┬───────────────────────────────────────────┬─────────────────┤
│ ▾ sopa/    │ ┌─────────────────────────────────────┐   │  ┌───────────┐  │
│  ▸ home    │ │ [ timeline ]              24 de 142 │◄──┼──┤[ fontes ] │  │
│  ▸ pessoas │ │ ‹tudo› hive  farcaster  blogs       │   │  │ hive   18 │  │
│  ▸ feed ●  │ └─────────────────────────────────────┘   │  │ farcast 6 │  │
│  ▸ contato │  ┌────────────────────────────────────┐   │  └───────────┘  │
│            │  │  post                              │   │  ┌───────────┐  │
│  PT/EN ⇄   │  ├────────────────────────────────────┤   │  │[ quem     │  │
│  ◑ tema    │  │  post                              │   │  │  postou ] │  │
│            │  ├────────────────────────────────────┤   │  │ @willdias │  │
│            │  │  post                              │   │  │ @louzoshi │  │
│            │  ├────────────────────────────────────┤   │  └───────────┘  │
│            │  │  [ carregar mais ▾ ]               │   │  ┌───────────┐  │
│            │  └────────────────────────────────────┘   │  │[ conectar]│  │
│            │        ▲ max-width 620px, centrado        │  └───────────┘  │
├────────────┴───────────────────────────────────────────┴─────────────────┤
│ sopa://feed — timeline agregada        24 posts · 2 fontes · PT/EN · ◐    │  chrome.bottom
└──────────────────────────────────────────────────────────────────────────┘
```

Header sticky = `top: 42px` (altura do `.chrome.top`). O chip ativo usa `.pill.on`.

### 3.2 Snap do Hive (o caso dominante — texto curto + 1 imagem)

```
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ▓▓▓▓  @willdias                              hive/snap  ↗    │
│  ▓▓▓▓  criativo · design / motion                      2h     │
│  ▓▓▓▓                                                         │
│                                                               │
│  sessão de ontem no lab. o corte inteiro sai sexta,           │
│  esse é só o frame que ficou na cabeça.                       │
│                                                               │
├───────────────────────────────────────────────────────────────┤   ← mídia sangra
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│      até as bordas
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░ imagem · 4:5 · cover ░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
├───────────────────────────────────────────────────────────────┤
```

Avatar 40px. Handle em `--ink` bold 13px, roles em `--ink-strong` 10px uppercase (mesmo tratamento de `Pessoas.tsx`). `hive/snap` e `2h` alinhados à direita, empilhados, ambos dentro do mesmo `<a>` externo.

### 3.3 Cast do Farcaster (texto curto, sem mídia — o texto cresce)

```
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ▓▓▓▓  @xvlad                                   fc/cast  ↗    │
│  ▓▓▓▓  dev · ai · web3                                 5h     │
│  ▓▓▓▓                                                         │
│                                                               │
│  dica chata mas real: nomeia tuas camadas. teu "eu do         │
│  futuro" e todo mundo que abrir teu arquivo agradecem.        │
│                                                               │
├───────────────────────────────────────────────────────────────┤
```

Sem mídia, `PostBody` sobe de 13.5px para 15px (`size='lg'`) e ganha `--ink-body`. É o único momento em que o texto puxa peso visual, e é intencional: um cast sem imagem que ficasse pequeno viraria uma linha de log perdida no meio de fotos.

### 3.4 Post de blog do Hive (long-form — o formato nobre)

```
├───────────────────────────────────────────────────────────────┤
│▏                                                              │   ← barra accent 2px
│▏ ▓▓▓▓  @xvlad                                 hive/blog  ↗    │      à esquerda
│▏ ▓▓▓▓  dev · ai · web3                                 2d     │
│▏                                                              │
│▏ Identidade viva pra rave XYZ —                               │   ← Archivo 900, 21px
│▏ do brief ao motion                                           │
│▏                                                              │
├───────────────────────────────────────────────────────────────┤
│░░░░░░░░░░░░░░░░░░░ capa · 16:9 · cover ░░░░░░░░░░░░░░░░░░░░░░░│
├───────────────────────────────────────────────────────────────┤
│▏                                                              │
│▏ primeiro brief que chegou sem referência nenhuma. o que      │
│▏ sobrou foi conversa: como uma rave soa antes de existir…     │
│▏                                                              │
│▏ leitura ~4 min                        ler na skatehive ↗     │
│▏                                                              │
├───────────────────────────────────────────────────────────────┤
```

Três distinções, todas dentro dos tokens existentes:
1. `border-left: 2px solid rgba(var(--accent-rgb), .45)` no bloco inteiro — o único uso de accent na timeline.
2. Ordem invertida: título antes da capa, capa antes do corpo. Snap/cast é texto→mídia; blog é título→capa→excerpt.
3. Rodapé próprio com tempo de leitura e CTA nominal `ler na skatehive ↗`.

### 3.5 Mobile (< 720px)

```
┌──────────────────────────────────┐
│ ● SOPA · ~/feed        ● 12 · ◐  │
├──────────────────────────────────┤
│ home │ pessoas │ feed │ contato →│  tab-strip
├──────────────────────────────────┤
│ [ timeline ]           24 de 142 │  sticky
│ ‹tudo› hive  farcaster  blogs  → │  chips com scroll-x
├──────────────────────────────────┤
│ ▓▓ @willdias      hive/snap  ↗   │  header quebra em 2 linhas:
│ ▓▓ criativo             2h       │  origem+tempo vão pra linha
│                                  │  de baixo se não couber
│ sessão de ontem no lab…          │
├──────────────────────────────────┤
│░░░░░░░ imagem · 4:5 ░░░░░░░░░░░░░│
└──────────────────────────────────┘
```

A coluna perde o `max-width` e o padding cai para 12px (herda `.main`). O rail vira faixa horizontal em 1040px e coluna no fim da página em 720px — comportamento já existente, nada de novo CSS.

---

## 4. Tratamento de mídia

**Regra base:** toda célula tem `aspect-ratio` fixo + `object-fit: cover`. O backend não entrega dimensões, e altura livre causaria layout shift a cada imagem carregada — inaceitável num feed onde o usuário está rolando. A imagem original fica a um clique de distância (abre o post na origem).

**Gaps do grid = linha, não espaço:** `gap: 1px` com `background: var(--line-strong)` no container. As células "encostam" separadas por um fio, que é o mesmo fio das divisórias entre posts. Isso é o detalhe que torna o grid *deste projeto* e não do Instagram.

| Nº de mídias | Arranjo | Ratio da célula | Ratio do bloco |
|---|---|---|---|
| 1 | célula única | `4 / 5` | `4 / 5` |
| 2 | 2 colunas | `1 / 1` cada | `2 / 1` |
| 3 | 1 grande à esquerda (`grid-row: span 2`) + 2 empilhadas à direita | esq. `2 / 5`, dir. `1 / 1` | `4 / 5` |
| 4+ | 2 × 2 | `1 / 1` cada | `1 / 1` |
| capa de blog | célula única, `variant='cover'` | `16 / 9` | `16 / 9` |

**Por que 4:5 para uma imagem só:** o conteúdo do coletivo é majoritariamente foto/vídeo de celular, vertical. 16:9 decapitaria quase todo snap; 1:1 é neutro mas apagado. 4:5 é o compromisso que o Instagram já validou para exatamente este material, e ainda cabe na dobra em desktop (620 × 775px).

**5 ou mais:** mostra 4 células e a última recebe overlay `rgba(var(--line-rgb), .55)` com `[ +3 ]` centralizado em mono `--ink-strong`. Clique vai para o post na origem — não abrimos lightbox (ver §7).

**Vídeo:**
- `<video>` nativo (`preload="metadata"`, `playsInline`, `loop`, `controls={false}` até o primeiro play). Sem autoplay: quatro vídeos rodando simultaneamente numa timeline é o oposto de "terminal".
- Overlay em repouso: `▶` centralizado, 26px, `--ink-strong` sobre `rgba(var(--line-rgb), .35)`. Canto inferior esquerdo: tag `.tag-sm` com `▶ vídeo` (ou a duração, se o backend passar a mandar).
- Clique: `play()` + liga `controls`. Segundo clique é do player nativo.
- Mesmo aspect-ratio da tabela acima — vídeo não tem tratamento próprio de layout.

**Sem mídia:** ver §3.3 — `PostBody` sobe para 15px. **Não** inserimos `Hatch` de placeholder: hachura significa "imagem que ainda não existe" no vocabulário atual do site, e aqui não falta nada.

**Falha de carregamento:** `onError` troca a célula por `Hatch` com label `[ mídia indisponível ]`, preservando o ratio. Mesmo padrão do `Avatar`, que já faz isso.

**Performance:** `loading="lazy"` + `decoding="async"` em todo `<img>` fora do primeiro post.

---

## 5. Marcação de origem

**Um token de texto por post, no canto superior direito do header:**

| plataforma | formato | token |
|---|---|---|
| hive | snap | `hive/snap` |
| hive | blog | `hive/blog` |
| farcaster | cast | `fc/cast` |

`font-size: 10px`, `letter-spacing: .06em`, cor `--muted`, sem borda, sem fundo. O `/` fica em `--faint` — separa plataforma de formato sem precisar de dois elementos.

**O bloco clicável é `origem + timestamp + ↗`**, agrupados num único `<a target="_blank" rel="noopener noreferrer">`. Em hover: cor vira `--ink-strong` no grupo inteiro. O `↗` (U+2197) fica sempre visível, alinhado à direita — é o sinal universal de "sai do site" e já é usado no `Feed.tsx` atual.

**Destinos:**
- `hive` → `https://skatehive.app/post/<autorSlug>/<permlink>`, derivado via `originUrl()` (§2). **Nunca** peakd ou ecency.
- `farcaster` → a `url` do payload, sem reescrita.

**No blog, há um segundo link** no rodapé do card: `ler na skatehive ↗`. É redundante com o header de propósito — long-form é o conteúdo que queremos que abra, e o rodapé é onde o olho para depois de ler o excerpt.

**O que descartamos:** badge com fundo colorido (quebra o `matrix`), logo SVG (dependência conceitual + não escala nos 3 temas), e uma coluna dedicada de origem à esquerda de cada post (rouba largura da coluna que já é estreita).

---

## 6. Estados

O feed é buscado em runtime — todos estes estados são reais, não decorativos.

### Primeira carga — `FeedSkeleton`

```
├──────────────────────────────────────────┤
│  ▨▨▨  ▨▨▨▨▨▨▨▨▨▨                 ▨▨▨▨▨   │
│  ▨▨▨  ▨▨▨▨▨▨                       ▨▨    │
│                                          │
│  ▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨    │
│  ▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨                     │
├──────────────────────────────────────────┤
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└──────────────────────────────────────────┘
      3 blocos · Hatch existente · sem shimmer
```

Usa o `Hatch` de `ui.tsx` para cada área. **Sem animação de shimmer** — a única `@keyframes` do projeto é `blink`, e adicionar um gradiente animado importa vocabulário de outro sistema de design. O sinal de vida fica no header sticky: `[ timeline ] carregando▊` com a classe `.cursor` existente.

### Carregando mais

O botão vira `[ carregando… ]`, `disabled`, cor `--faint`. Os posts já renderizados **não** somem nem esmaecem.

### Vazio — filtro sem resultado

```
┌──────────────────────────────────────────┐
│ [ vazio ]                                │
│                                          │
│  nenhum post de farcaster nessa janela.  │
│                                          │
│  [ limpar filtro ]                       │
└──────────────────────────────────────────┘
```

### Vazio — resposta 200 com lista vazia

Mesma moldura, texto `o feed não trouxe nada ainda.` e a ação vira `[ conectar contas → ]` apontando para `/contato` — reaproveita a CTA que o rail já tem.

### Fim da lista

Sem moldura, uma linha só, centrada, `--faint`, 10.5px:

```
        ─────  fim do buffer · 142 posts  ─────
```

### Erro

```
┌──────────────────────────────────────────┐
│ [ erro ]                                 │
│                                          │
│  não deu pra puxar o feed.               │
│  timeout na api · tenta de novo.         │
│                                          │
│  [ tentar de novo ]                      │
└──────────────────────────────────────────┘
```

**Regra crítica:** se já existem posts na tela, o erro aparece **abaixo** deles. Falha de paginação nunca apaga o que já foi carregado.

Borda do `FeedNotice`: `1px solid var(--line-strong)`. **Sem vermelho** — não existe token de erro no projeto, e inventar um quebra os 3 temas. Erro se comunica pelo texto e pela tag `[ erro ]`, que é como um terminal comunica erro.

### Filtro × paginação — decisão

O filtro vai como **parâmetro da requisição**, não como `.filter()` sobre o array carregado. Filtrar client-side sobre uma janela paginada mente para o usuário: ele vê "3 posts de farcaster" quando existem 60. Se o backend não aceitar o parâmetro (**GAP-2**), o fallback é filtrar client-side **e** rotular honestamente: `3 de 24 carregados` em vez de `3 de 142`.

---

## 7. O que NÃO fazer

1. **Não inventar métricas.** `♥ 96 · ↻ 21 · ↩ 14` não existe no payload. O mock atual em `data.ts` faz isso e precisa morrer junto com a página velha.
2. **Não introduzir cor fora dos tokens.** Vermelho do Hive, roxo do Farcaster, vermelho de erro, verde de sucesso — nenhum existe. No tema `matrix` a paleta inteira é verde sobre preto; qualquer hex solto vira corpo estranho. Toda cor sai de `var()` já declarado.
3. **Não usar `--accent` como fundo de área grande.** No `matrix` o accent é `#00ff41` puro. `.mark`, `.btn-yellow` e bordas finas: ok. Bloco de mídia, header de post, card inteiro: não. A única exceção autorizada é a barra de 2px do blog, e ela é `rgba(..., .45)`.
4. **Não importar nada.** `date-fns` (→ `relTime`, 12 linhas), `react-markdown` (→ não renderizamos markdown), lightbox, carrossel, lib de animação. O `package.json` tem react e react-dom e continua assim.
5. **Não renderizar markdown/HTML do backend.** Nada de `dangerouslySetInnerHTML`. O texto do Hive vem com markdown; a resposta é `stripHiveMarkup()` + texto plano + `linkify()` retornando `ReactNode[]`. Renderizar HTML de terceiros num site estático é XSS de graça.
6. **Não linkar peakd, ecency ou hive.blog.** Requisito explícito: todo post do Hive abre em `skatehive.app`. Vale para o header, o rodapé do blog e o clique na mídia.
7. **Não fazer infinite scroll.** Mata o `chrome.bottom`, que é identidade da página (D7).
8. **Não deixar mídia com altura livre.** Sem `aspect-ratio` fixo, cada imagem que carrega empurra o conteúdo e o scroll pula. Sempre ratio + `cover`.
9. **Não virar Instagram genérico.** Sem sombra, sem `border-radius > 3px`, sem gradiente, sem lightbox modal, sem botão de curtir, sem stories, sem hover que escala a imagem. Se um elemento pareceria natural num template de rede social pronto, provavelmente está errado aqui.
10. **Não virar portfólio.** Sem grid masonry, sem "featured", sem ordenação por destaque. É cronológico e ponto — é isso que faz parecer uma rede, não uma vitrine.
11. **Não quebrar quando o autor não está em `PEOPLE`.** O feed pode trazer gente de fora do coletivo. `person: null` ⇒ iniciais derivadas do handle, sem link para `/perfil`, sem linha de roles. Nunca renderizar `undefined` nem sumir com o post.
12. **Não deixar o post inteiro clicável.** Só handle/avatar (interno) e origem/tempo/mídia (externo). Card inteiro clicável impede seleção de texto e faz cada link interno virar armadilha de `stopPropagation`.
13. **Não decorar mídia com vocabulário TUI.** Hachura por cima de foto, moldura ASCII em volta de vídeo, filtro verde no `matrix`. A moldura é terminal, o conteúdo não (D1).

---

## Gaps

- **GAP-1 — como o backend marca um blog?** A proposta assume `title?: string` presente ⇒ `format: 'blog'`. Se o payload não tiver `title`, precisa de um campo explícito (`format` ou `kind`) — heurística por tamanho de texto (`hive` + `text.length > 600`) é frágil e classifica snap longo como blog. **Pedir o campo ao backend antes de implementar.**
- **GAP-2 — o endpoint aceita filtro e cursor?** §6 depende disso. Sem suporte, o rótulo de contagem muda de `N de 142` para `N de 24 carregados`.
- **GAP-3 — o `url` do Hive sempre termina em permlink?** `originUrl()` extrai o último segmento. Se o payload puder trazer `permlink` direto, é mais seguro do que parsear URL.
- **GAP-4 — duração de vídeo e `poster`.** Sem eles, o placeholder do vídeo mostra só `▶` e depende de `preload="metadata"` para pintar o primeiro frame — inconsistente entre navegadores. Um campo `poster?: string` resolveria.
- **GAP-5 — `/feed` está fora de `PUBLISHED_ROUTES`.** Religar exige devolver `'feed'` ao array em `data.ts` e ao `NAV`. Fora do escopo desta proposta, mas é pré-requisito de qualquer implementação.
