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
```

## Rotas (hash router)

`#/home` · `#/pessoas` · `#/perfil/<handle>` · `#/feed` · `#/projetos` · `#/capacidades` · `#/contato` · `#/post`

## Estrutura

```
src/
  index.css            tokens por tema + estilos de shell/painel/grids responsivos
  data.ts              conteúdo (pessoas, feed, projetos, capacidades) — fonte única; facetas derivadas
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

## Notas

- Layout full-bleed responsivo — rail some < 1040px, sidebar vira tab-strip horizontal < 720px.
- Existe **um** post escrito (`making-of` do @xvlad); só os itens que apontam pra ele abrem `#/post` — os demais blogs/posts são teasers ("em breve").
- Números de marca agregados (nav `feed (142)` / `projetos (38)`) são flavor; tudo drilável (facetas, contadores, rail) é real.
- Formulário de contato é client-side (sem backend); `enviar brief` ainda não faz POST.
- `_design/` (bundle original, 3 variantes) está no `.gitignore`.
