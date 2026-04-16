import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const media = await prisma.media.findUnique({
    where: { id },
    select: {
      data: true,
      mimeType: true,
    },
  })

  if (!media) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(media.data, {
    status: 200,
    headers: {
      'Content-Type': media.mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
