import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Body = {
  mediaId?: string
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = (await request.json()) as Body

    if (!body.mediaId || typeof body.mediaId !== 'string') {
      return NextResponse.json({ error: 'mediaId is required' }, { status: 400 })
    }

    const media = await prisma.media.findUnique({ where: { id: body.mediaId }, select: { id: true } })
    if (!media) {
      return NextResponse.json({ error: 'media not found' }, { status: 404 })
    }

    await prisma.combo.update({
      where: { id },
      data: { image: `/api/media/${body.mediaId}` },
    })

    return NextResponse.json({ ok: true, image: `/api/media/${body.mediaId}` })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
