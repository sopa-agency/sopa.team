import type { Territory } from './data'

/** Camada curatorial sobre o cadastro do portal (src/people.generated.ts).
 *
 *  O portal é dono de bio + skills + roster. Tudo aqui é decisão editorial que
 *  o portal não tem como saber: território, como a pessoa se apresenta, avatar
 *  custom do userbase (quando existe um melhor que o padrão do Hive).
 *
 *  Também é o **gate de exibição**: só quem tem entrada aqui aparece no site.
 *  A allowlist do portal inclui contas de marca (reelflip, keepkey, illithics)
 *  que não são pessoas — elas ficam de fora simplesmente por não estarem aqui.
 *
 *  A ordem das chaves é a ordem do diretório (a /pessoas embaralha na montagem;
 *  a home mostra os 4 primeiros).
 */
export type PersonOverride = {
  initials: string
  /** como a pessoa se apresenta — tokens separados por ' · '; alimenta o filtro de skill */
  roles: string
  territory: Territory
  /** avatar do userbase quando é melhor que o padrão https://images.hive.blog/u/<h>/avatar */
  avatarUrl?: string
}

export const PEOPLE_OVERRIDES: Record<string, PersonOverride> = {
  'bielcx': {
    initials: 'BI',
    roles: 'dev · comunidade',
    territory: 'comunidade',
    avatarUrl: 'https://ipfs.skatehive.app/ipfs/bafkreien7mljpj3erknn4mc6agtgsprovtl3dvyg4okp32mqqbjedghjii?filename=skatehive.png',
  },
  'xvlad': { initials: 'XV', roles: 'dev · ai · web3', territory: 'estratégia / produto' },
  'willdias': { initials: 'WI', roles: 'criativo', territory: 'design / motion' },
  'vaipraonde': {
    initials: 'VA',
    roles: 'dev · web3',
    territory: 'dev / web3',
    avatarUrl: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/8fa98f2b-fd39-4a33-94ad-0bd3084f6d00/original',
  },
  'mengao': { initials: 'ME', roles: 'dev · web3', territory: 'dev / web3' },
  'r4topunk': { initials: 'R4', roles: 'dev · web3 · criativo', territory: 'design / motion' },
  'joaoparmagnani': { initials: 'JO', roles: 'social media', territory: 'social / conteúdo' },
  'humbertoperes': {
    initials: 'HU',
    roles: 'skate · comunidade',
    territory: 'comunidade',
    avatarUrl: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/97fe9ce5-4047-4492-b66c-c9eb99197d00/original',
  },
  'louzoshi': {
    initials: 'LO',
    roles: 'dev · comunidade',
    territory: 'comunidade',
    avatarUrl: 'https://ipfs.skatehive.app/ipfs/bafkreieacx3evdxkmmxkehz7z7btjeto7ijaiavpfyg6dwenevql2mm2be?filename=skatehive.png',
  },
  'nogenta': { initials: 'NO', roles: 'photo · film', territory: 'vídeo' },
}

/** Rótulos PT-BR das chaves de skill que o portal usa (MemberSkills.skills). */
export const SKILL_LABELS: Record<string, string> = {
  dev: 'dev',
  design: 'design',
  videoEditing: 'edição de vídeo',
  photography: 'fotografia',
  community: 'comunidade',
  marketing: 'marketing',
  writing: 'escrita',
  music: 'música',
  skateboarding: 'skate',
  eventProducing: 'eventos',
}
