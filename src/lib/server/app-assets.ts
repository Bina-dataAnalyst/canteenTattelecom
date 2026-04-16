import { prisma } from '@/lib/prisma'

export const APP_ASSET_KEYS = ['hero_main', 'hero_decor'] as const

export type AppAssetKey = (typeof APP_ASSET_KEYS)[number]

export const getAppAssetUrls = async () => {
  const rows = await prisma.appAsset.findMany({
    where: {
      key: {
        in: [...APP_ASSET_KEYS],
      },
    },
    select: {
      key: true,
      mediaId: true,
    },
  })

  const map: Partial<Record<AppAssetKey, string>> = {}

  for (const row of rows) {
    map[row.key as AppAssetKey] = `/api/media/${row.mediaId}`
  }

  return map
}
