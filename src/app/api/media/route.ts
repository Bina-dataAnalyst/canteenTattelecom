import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const MAX_FILE_SIZE = 8 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'only image files are supported' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'file too large (max 8MB)' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)

    const media = await prisma.media.create({
      data: {
        fileName: file.name || 'upload',
        mimeType: file.type,
        size: file.size,
        data,
      },
      select: {
        id: true,
        fileName: true,
        mimeType: true,
        size: true,
      },
    })

    return NextResponse.json({
      media: {
        ...media,
        url: `/api/media/${media.id}`,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
