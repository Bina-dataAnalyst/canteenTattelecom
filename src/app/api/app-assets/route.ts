import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { APP_ASSET_KEYS, type AppAssetKey } from '@/lib/server/app-assets'

type SetAssetRequest = {
  key?: string
  mediaId?: string
}

export async function GET() {
  try {
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

    const assets = Object.fromEntries(rows.map((row) => [row.key, `/api/media/${row.mediaId}`]))
    return NextResponse.json({ assets })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SetAssetRequest

    if (!body.key || !APP_ASSET_KEYS.includes(body.key as AppAssetKey)) {
      return NextResponse.json({ error: 'invalid key' }, { status: 400 })
    }

    if (!body.mediaId || typeof body.mediaId !== 'string') {
      return NextResponse.json({ error: 'mediaId is required' }, { status: 400 })
    }

    await prisma.appAsset.upsert({
      where: { key: body.key },
      update: { mediaId: body.mediaId },
      create: { key: body.key, mediaId: body.mediaId },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
