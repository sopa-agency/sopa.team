# Cadastro de pessoas — o que o site mostra × o que o portal guarda

TL;DR pra publicar: o portal hoje só sabe **bio + skills + contatos**. Todo o resto do perfil
(links, serviços, projetos, posts, "sobre") é mock hardcoded no site. Este doc mapeia campo a campo
o que precisa ser criado no portal, o que precisa ser preenchido, e o que sai do ar.

Fonte de verdade do cadastro: `marketing-portal` → card do membro em `/team`
(`src/components/team-view.tsx`, actions em `src/app/actions/team-admin.ts`).
Transporte: `GET /api/sopa/site-data` → `pnpm sync:people` → `src/people.generated.ts`.

---

## 1. O que a pessoa consegue preencher hoje (self-service no portal)

| campo | onde mora | limites | já chega no site? |
|---|---|---|---|
| **bio** | `MemberSkills.bio` | texto livre, 600 chars, corta no `.trim()` | ✅ sim — `/perfil` |
| **skills** | `MemberSkills.skills` (Json) | 10 categorias fixas, score 0–100 por slider | ✅ sim — painel `[ skills ]` |
| **contatos** | `TeamMemberContact` | `label` de uma lista fechada + `value` | ❌ não exposto (ver §3) |

Categorias de skill (fixas em `src/lib/skills.ts` — mudar a lista muda radar, sliders e storage):
`dev` · `writing` · `videoEditing` · `skateboarding` · `eventProducing` · `design` · `marketing`
· `community` · `photography` · `music`

Plataformas de contato (fixas em `src/lib/contact-platforms.ts`):
`Email` · `Telegram` · `WhatsApp` · `Farcaster` · `Instagram` · `X` · `GitHub` · `Discord`
· `Website` · `Wallet`

Quem pode editar: **a própria pessoa ou um admin** (`setMemberSkills` checa isso).

## 2. O que o site mostra hoje — e de onde vem

`/perfil/<handle>`:

| bloco | estado | origem |
|---|---|---|
| handle + avatar | ✅ real | portal / userbase |
| bio | ✅ real | `MemberSkills.bio` |
| `[ skills ]` | ✅ real | `MemberSkills.skills` |
| roles (subtítulo + tags) | 🟡 curatorial | `people-overrides.ts`, escrito à mão |
| `[ sobre ]` — desde 2021, base SP, idiomas PT·EN | ❌ **mock** | fixo pra todo mundo |
| `[ números ]` — 8 projetos, 5 colabs | ❌ **mock** | fixo pra todo mundo |
| `[ no radar ]` | ❌ **mock** | fixo pra todo mundo |
| links (site / instagram / are.na / behance) | ❌ **mock** | fixo, não clicável |
| `[ serviços que assumo ]` | ❌ **mock** | 5 itens fixos pra todo mundo |
| `[ posts — N ]` | ❌ **mock** | 3 itens fixos; N é número inventado |
| `[ projetos próprios ]` / `[ colaborações ]` | ❌ **mock** | fixo pra todo mundo |
| `[ mídia ]` | ❌ **placeholder** | grid hachurado |

`/pessoas`: handle, avatar e contagem de território são reais; `roles` é curatorial;
a coluna **posts** é número inventado; o filtro "skill" usa os tokens de `roles`, não os skills reais.

## 3. Gaps — o que falta no portal

### 3.1 Contatos existem, mas não podem ser publicados como estão

Já são **92 linhas** preenchidas para os 10 do diretório. Dois bloqueios:

1. **Sem flag público/privado.** `TeamMemberContact` é `{projectSlug, username, label, value}` — nada
   distingue `Instagram` (público) de `WhatsApp`, `Email`, `Telegram` e `Wallet` (pessoais).
   Publicar a tabela inteira vaza dado pessoal. Precisa de um `public Boolean @default(false)`
   e de um toggle no card do membro.
2. **Espalhados por portal.** As linhas estão sob 6 slugs diferentes (`skatehive`, `sopa`, `reelflip`,
   `gnars`, `vlad`, `coletivoxv`) porque a chave é `[projectSlug, username, label]`. O site precisa de
   uma regra: consolidar por `username` ignorando o slug (e resolver conflito quando a mesma pessoa
   tem dois valores para o mesmo label).

### 3.2 Campos que não existem em lugar nenhum

| campo do site | proposta | por quê |
|---|---|---|
| nome de exibição | `MemberSkills.displayName` | hoje o site só mostra `@handle` |
| roles / tags | `MemberSkills.roles String[]` | tirar de `people-overrides.ts`; alimenta o filtro |
| território | fica curatorial | agrupamento editorial, não é a pessoa que decide |
| localização, idiomas, "desde" | `MemberSkills.meta Json` | conteúdo do painel `[ sobre ]` |
| serviços que assumo | derivar do board `capacidades` | ver §3.3 |
| projetos próprios / colabs | derivar do board `portfolio` | ver §3.3 |
| posts | ver §4 | hoje é número inventado |

### 3.3 Os boards que alimentariam projetos e capacidades

- **`capacidades`**: a rota `/api/sopa/site-data` lê esse board, mas ele **não existe como board
  editável** — `BoardKind` em `sopa-boards.ts` é só `"orgchart" | "portfolio"`. Por isso vem 0 linhas.
  Sem isso não há `[ serviços que assumo ]` nem a página `/capacidades`.
- **`portfolio`**: existe e tem 9 cards, mas o editor só escreve **logo, título, detalhes e membros
  (com função)**. A rota lê `tags`, `type`, `year` do meta — **nenhuma UI os escreve**, então vêm
  sempre `null`. E os 9 cards são portais/clientes (Gnars, Skatehive, Keepkey, C&A, ShapeShift,
  Odysee, Puma) com `body` de brincadeira — conteúdo interno, não portfólio público.

## 4. Posts

Não existe cadastro de posts por pessoa. O número no perfil e em `/pessoas` é inventado
(`posts` em `people-overrides.ts`), e a lista de 3 posts é a mesma pra todo mundo.

O que existe de real no portal é `FarcasterTrailCast` — 40 casts, mas **todos da conta `@skatehive`**,
duplicados entre farcaster e hive. Não dá pra atribuir a pessoas.

## 5. Ordem de trabalho pra publicar

**Site — feito.** O que está no ar é 100% real:

- [x] Posts zerados — coluna do `/pessoas`, painel `[ posts — N ]` e o campo `posts` do override
      saíram. No lugar da coluna, o **território**.
- [x] Perfil sem mock — sobraram header (avatar, handle, roles, bio) + `[ skills ]`. Saíram
      `[ sobre ]`, `[ números ]`, `[ no radar ]`, links, serviços, projetos próprios,
      colaborações e mídia.
- [x] Home sem mock — saíram as prévias de feed, projetos e capacidades; o manifesto virou seção
      própria. Contadores de pessoas agora derivam de `PEOPLE.length` (não mais "10 online").
- [x] `/feed`, `/projetos`, `/capacidades` e `/post` fora da nav **e** do router
      (`PUBLISHED_ROUTES` em `data.ts`) — a URL cai na home em vez de servir mock.

**Portal — pendente (decisão tomada: toggle por pessoa):**

1. `public Boolean @default(false)` em `TeamMemberContact` + toggle no card do membro
2. Consolidar contatos por `username` no `/api/sopa/site-data` (só os `public`), resolvendo o
   conflito de mesma pessoa + mesmo label em portais diferentes
3. `displayName` + `roles` em `MemberSkills` — tira `roles` do `people-overrides.ts` e passa a
   alimentar o filtro de skill do `/pessoas`
4. Board `capacidades` editável (`BoardKind`) → religa `/capacidades` e "serviços que assumo"
5. Campos `tags`/`type`/`year` no editor de portfólio + separar portfólio público do interno →
   religa `/projetos`

Sem plano ainda: **posts por pessoa** (não existe cadastro, e o `FarcasterTrailCast` não atribui
autoria individual) — é o que religa `/feed`.

## 6. Formulário de contato — resolvido

O "enviar brief" agora posta em `POST /api/sopa/brief` no marketing-portal:

- grava na tabela `SopaBrief` (nome, contato, tipos, orçamento, prazo, mensagem, `handled`)
- notifica o Discord da SOPA em seguida — **best-effort**: a gravação vem primeiro, então uma
  queda do Discord nunca perde um lead
- aberto na internet e CORS-aberto (o site é estático, não há sessão pra checar), com honeypot,
  limites de tamanho por campo e erro genérico pra quem chama anonimamente

A URL do portal fica em `VITE_SOPA_API` (default: `https://sopa.reelflip.com/api/sopa`). Pra
desenvolver contra um portal local:

```sh
VITE_SOPA_API=http://localhost:3000/api/sopa pnpm dev
```

**Pendente:** a SOPA não tem Discord configurado (`SOPA_DISCORD_BOT_TOKEN` +
`SOPA_DISCORD_CHANNEL_ID` não existem no `.env.local` — só SkateHive, Gnars e Reelflip têm). Sem
isso o brief é gravado mas **ninguém é avisado**, e não existe tela no portal pra ler a tabela.
Antes de publicar, uma das duas: configurar as env vars, ou fazer uma listagem de briefs no portal.

Os canais falsos do rail (`oi@sopa.studio`, `@sopa.studio`, `sopa.studio/dc`) saíram — se existirem
handles reais, é só devolver.
