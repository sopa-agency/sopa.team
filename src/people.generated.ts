// GERADO por scripts/sync-people.mjs — NÃO EDITE À MÃO.
// Fonte: marketing-portal /api/sopa/site-data (campo `people`).
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

export const GENERATED_AT = '2026-07-25T23:10:49.916Z'

export const REMOTE_PEOPLE: RemotePerson[] = [
  {
    "username": "bielcx",
    "bio": "skatil I die",
    "skills": {
      "skateboarding": 99,
      "dev": 44,
      "design": 33,
      "photography": 22,
      "marketing": 20
    },
    "avatarUrl": "https://images.hive.blog/u/bielcx/avatar"
  },
  {
    "username": "xvlad",
    "bio": "Vlad is a vampire from another time. He is 420 years old",
    "skills": {
      "skateboarding": 82,
      "community": 55,
      "marketing": 55,
      "dev": 54,
      "videoEditing": 33,
      "eventProducing": 31,
      "photography": 17,
      "design": 14,
      "music": 1
    },
    "avatarUrl": "https://images.hive.blog/u/xvlad/avatar"
  },
  {
    "username": "vaipraonde",
    "bio": null,
    "skills": {},
    "avatarUrl": "https://images.hive.blog/u/vaipraonde/avatar"
  },
  {
    "username": "mengao",
    "bio": null,
    "skills": {},
    "avatarUrl": "https://images.hive.blog/u/mengao/avatar"
  },
  {
    "username": "louzoshi",
    "bio": null,
    "skills": {
      "dev": 100,
      "writing": 100,
      "skateboarding": 100,
      "music": 70,
      "community": 70,
      "design": 50,
      "marketing": 50,
      "videoEditing": 50,
      "eventProducing": 40,
      "photography": 35
    },
    "avatarUrl": "https://images.hive.blog/u/louzoshi/avatar"
  },
  {
    "username": "willdias",
    "bio": null,
    "skills": {
      "videoEditing": 100,
      "skateboarding": 100,
      "music": 82,
      "marketing": 51,
      "community": 12
    },
    "avatarUrl": "https://images.hive.blog/u/willdias/avatar"
  },
  {
    "username": "reelflip",
    "bio": null,
    "skills": {
      "writing": 100,
      "marketing": 100,
      "music": 90,
      "design": 90,
      "photography": 90,
      "videoEditing": 90,
      "skateboarding": 23
    },
    "avatarUrl": "https://images.hive.blog/u/reelflip/avatar"
  },
  {
    "username": "joaoparmagnani",
    "bio": null,
    "skills": {
      "writing": 80,
      "community": 70,
      "design": 60,
      "marketing": 60,
      "photography": 37,
      "music": 36,
      "skateboarding": 28,
      "videoEditing": 26,
      "eventProducing": 23,
      "dev": 4
    },
    "avatarUrl": "https://images.hive.blog/u/joaoparmagnani/avatar"
  },
  {
    "username": "keepkey",
    "bio": "Bangkok nightmare",
    "skills": {
      "dev": 100,
      "community": 71,
      "photography": 4
    },
    "avatarUrl": "https://images.hive.blog/u/keepkey/avatar"
  },
  {
    "username": "illithics",
    "bio": null,
    "skills": {},
    "avatarUrl": "https://images.hive.blog/u/illithics/avatar"
  },
  {
    "username": "humbertoperes",
    "bio": null,
    "skills": {
      "skateboarding": 100,
      "videoEditing": 58,
      "marketing": 39,
      "dev": 20
    },
    "avatarUrl": "https://images.hive.blog/u/humbertoperes/avatar"
  },
  {
    "username": "r4topunk",
    "bio": null,
    "skills": {
      "dev": 100,
      "marketing": 54,
      "skateboarding": 7
    },
    "avatarUrl": "https://images.hive.blog/u/r4topunk/avatar"
  },
  {
    "username": "nogenta",
    "bio": null,
    "skills": {
      "skateboarding": 85,
      "videoEditing": 82,
      "photography": 80,
      "design": 65,
      "eventProducing": 57,
      "marketing": 54,
      "music": 33,
      "community": 10
    },
    "avatarUrl": "https://images.hive.blog/u/nogenta/avatar"
  }
]
