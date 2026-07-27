import { useCallback, useEffect, useRef, useState } from 'react'
import { PEOPLE, type Person } from './data'

/** Endpoint da timeline no marketing-portal (o mesmo host do brief). */
const API =
  (import.meta.env.VITE_SOPA_API as string | undefined)?.replace(/\/$/, '') ??
  'https://sopa.reelflip.com/api/sopa'

export type FeedKind = 'snap' | 'blog' | 'cast'
export type FeedPlatform = 'hive' | 'farcaster'
/** `embed` = player de terceiro (skatehype, odysee…): não é arquivo, vira link. */
export type FeedMedia = { type: 'image' | 'video' | 'embed'; url: string }

export type FeedPost = {
  id: string
  kind: FeedKind
  platform: FeedPlatform
  author: string
  handle: string
  text: string
  url: string | null
  postedAt: string
  media: FeedMedia[]
}

/** O que a UI consome: o post cru + o que dá pra resolver uma vez só. */
export type FeedEntry = FeedPost & {
  /** null quando o autor não está no diretório — aí o nome não vira link */
  person: Person | null
  /** mídia que dá pra renderizar inline, separada da que precisa de iframe */
  inline: FeedMedia[]
  embeds: FeedMedia[]
}

export type FeedFilter = 'tudo' | 'hive' | 'farcaster'

const byHandle = new Map(PEOPLE.map((p) => [p.handle.slice(1), p]))

function hydrate(post: FeedPost): FeedEntry {
  return {
    ...post,
    person: byHandle.get(post.author) ?? null,
    inline: post.media.filter((m) => m.type !== 'embed'),
    embeds: post.media.filter((m) => m.type === 'embed'),
  }
}

/** Rótulo curto da origem: `hive/snap`, `hive/blog`, `fc/cast`. */
export function sourceLabel(post: FeedPost): string {
  return post.platform === 'farcaster' ? 'fc/cast' : `hive/${post.kind}`
}

/** Tempo relativo curto — sem lib, sem Intl.RelativeTimeFormat. */
export function shortAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 3600) return `${Math.floor(s / 60) || 1}min`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  if (s < 2592000) return `${Math.floor(s / 86400)}d`
  const d = new Date(iso)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(2)}`
}

export type FeedState = {
  entries: FeedEntry[]
  status: 'loading' | 'loading-more' | 'ready' | 'error'
  /** null = acabou a lista */
  cursor: string | null
  error: string | null
  loadMore: () => void
  setFilter: (f: FeedFilter) => void
  filter: FeedFilter
}

/**
 * Dono único da rede nesta página. O filtro vai como parâmetro da requisição,
 * não como .filter() sobre o que já veio — filtrar client-side sobre uma janela
 * paginada mentiria sobre o total.
 */
export function useFeed({ pageSize = 20, author }: { pageSize?: number; author?: string } = {}): FeedState {
  const [entries, setEntries] = useState<FeedEntry[]>([])
  const [status, setStatus] = useState<FeedState['status']>('loading')
  const [cursor, setCursor] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilterState] = useState<FeedFilter>('tudo')
  // Corrida: uma resposta lenta de um filtro antigo não pode sobrescrever a nova.
  const run = useRef(0)

  const fetchPage = useCallback(
    async (f: FeedFilter, after: string | null) => {
      const id = ++run.current
      setStatus(after ? 'loading-more' : 'loading')
      setError(null)
      try {
        const qs = new URLSearchParams({ limit: String(pageSize) })
        if (f !== 'tudo') qs.set('platform', f)
        // no perfil o feed é de uma pessoa só — filtro vai na requisição
        if (author) qs.set('author', author)
        if (after) qs.set('cursor', after)
        const res = await fetch(`${API}/feed?${qs}`)
        const data = (await res.json()) as
          | { ok: true; items: FeedPost[]; nextCursor: string | null }
          | { ok: false; error: string }
        if (id !== run.current) return // chegou tarde, já tem pedido mais novo
        if (!res.ok || !data.ok) throw new Error('error' in data ? data.error : `HTTP ${res.status}`)
        const fresh = data.items.map(hydrate)
        setEntries((prev) => (after ? [...prev, ...fresh] : fresh))
        setCursor(data.nextCursor)
        setStatus('ready')
      } catch (err) {
        if (id !== run.current) return
        setError(err instanceof Error ? err.message : 'Falha ao carregar.')
        setStatus('error')
      }
    },
    [pageSize, author],
  )

  useEffect(() => {
    void fetchPage('tudo', null)
  }, [fetchPage])

  return {
    entries,
    status,
    cursor,
    error,
    filter,
    loadMore: () => {
      if (cursor && status === 'ready') void fetchPage(filter, cursor)
    },
    setFilter: (f) => {
      setFilterState(f)
      setEntries([])
      setCursor(null)
      void fetchPage(f, null)
    },
  }
}
