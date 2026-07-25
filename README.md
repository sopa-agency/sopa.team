# SOPA — site

Estúdio criativo coletivo. Estética TUI/terminal, fundo ASCII "água" reativo ao mouse.
Três temas: **light**, **amarelo** (dark), **matrix** (green) — ciclo pelo `◑ tema` na sidebar ou pelo `◐` no rodapé; persiste em `localStorage`.

Recriado a partir do handoff `SOPA-site-*.dc.html` (Claude Design) em **Vite + React + TS**, sem dependências além de react/react-dom.

## Comandos

```sh
pnpm install
pnpm dev       # http://localhost:5173
pnpm build     # tsc -b + vite build → dist/
pnpm preview   # serve o dist/
pnpm sync:people   # puxa o cadastro de pessoas do marketing-portal
pnpm sync:avatars  # confere os avatares contra o userbase (Supabase)
```

`VITE_SOPA_API` aponta o formulário de contato pro portal (default
`https://sopa.reelflip.com/api/sopa`). Contra um portal local:
`VITE_SOPA_API=http://localhost:3000/api/sopa pnpm dev`.

## Rotas

No ar: `/` · `/pessoas` · `/perfil/<handle>` · `/contato` — a lista é `PUBLISHED_ROUTES` em `data.ts`.

`/feed`, `/projetos`, `/capacidades` e `/post` seguem no repo (páginas + conteúdo de exemplo), mas
estão **fora do router**: dependem de dados que ainda não existem no portal, então a URL cai na home
em vez de servir mock. Para religar, basta devolvê-las a `PUBLISHED_ROUTES` — ver
`docs/cadastro-pessoas.md`.

## Estrutura

```
src/
  index.css            tokens por tema + estilos de shell/painel/grids responsivos
  data.ts              conteúdo (feed, projetos, capacidades) + junção do diretório; facetas derivadas
  people.generated.ts  GERADO (pnpm sync:people) — bio + skills + roster vindos do portal
  people-overrides.ts  camada curatorial do diretório + gate de quem aparece
  router.ts            hash router mínimo (useSyncExternalStore) + delegação [data-route]
  theme.ts             store de tema (useSyncExternalStore) + localStorage + data-theme no <html>
  App.tsx              switch de rota
  components/
    AsciiWave.tsx      canvas de fundo (port do initSmoke); paleta troca por tema
    Frame.tsx          chrome (top/footer) + sidebar file-tree + rail + ThemeDot
    ui.tsx             Panel (fieldset), Hatch (placeholder), KeyVals, Dropdown (facetas)
  pages/               uma por rota
```

## Temas

Cada tema é um bloco `:root[data-theme='...']` em `index.css`. As cores derivam de dois triplets
(`--line-rgb`, `--accent-rgb`) resolvidos preguiçosamente, então sobrescrever só os triplets + tokens
crus re-tinge tudo. Superfícies de accent sólido (botões, `.mark`) usam `--on-accent` (sempre escuro)
pra não virar texto-sobre-accent invisível nos temas escuros. Fontes: **Archivo** (display) + **Space Mono** (mono).

## Filtros (client-side, sem lib)

- **feed** — filtra por fonte (farcaster/x/instagram/hive)
- **projetos** — dropdowns pessoa/tipo/ano + sort (recentes/antigos/a–z), chips ✕, rail clicável; facetas e contagens derivadas de `PROJECTS`
- **pessoas** — dropdowns território/skill + rail de territórios clicável; facetas derivadas de `PEOPLE`

## Cadastro de pessoas (marketing-portal)

O diretório é **cadastro do portal ⋈ curadoria local**:

| lado | onde | o quê |
|---|---|---|
| portal (fonte de verdade) | `src/people.generated.ts` | roster, `bio`, `skills` (scores 0–100 de `MemberSkills`), avatar padrão |
| curadoria | `src/people-overrides.ts` | `territory`, `roles`, `posts`, `initials`, avatar do userbase, **ordem** |

`pnpm sync:people` busca `GET /api/sopa/site-data` no portal e reescreve o arquivo gerado — que é
**commitado**, então o build nunca depende da rede. Quem está na allowlist do portal mas não tem
entrada em `people-overrides.ts` fica fora do site (é assim que as contas de marca — `reelflip`,
`keepkey`, `illithics` — são excluídas); o script avisa quem ficou de fora.

```sh
pnpm sync:people                                  # produção
SOPA_SITE_DATA_URL=http://localhost:3000/api/sopa/site-data pnpm sync:people
node scripts/sync-people.mjs --from snapshot.json  # ingere um dump do payload
```

O mesmo endpoint também devolve `projects`, `capabilities` e `feed`, mas hoje esses boards do portal
não servem ao site (portfólio = lista de portais sem metadados, capacidades vazio, feed só da conta
`@skatehive`). Continuam curatoriais aqui em `data.ts`.

## Notas

- Layout full-bleed responsivo — rail some < 1040px, sidebar vira tab-strip horizontal < 720px.
- Existe **um** post escrito (`making-of` do @xvlad); só os itens que apontam pra ele abrem `#/post` — os demais blogs/posts são teasers ("em breve").
- Números de marca agregados (nav `feed (142)` / `projetos (38)`) são flavor; tudo drilável (facetas, contadores, rail) é real.
- Formulário de contato é client-side (sem backend); `enviar brief` ainda não faz POST.
- `_design/` (bundle original, 3 variantes) está no `.gitignore`.
