import { NextResponse } from 'next/server'
import { getFavoriteDishes } from '@/lib/server/history'
import { toggleFavoriteDish } from '@/lib/server/session-state'

type FavoriteRequest = {
  dishId?: string
}

export async function GET() {
  try {
    const items = await getFavoriteDishes()
    return NextResponse.json({ items })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FavoriteRequest

    if (!body.dishId || typeof body.dishId !== 'string') {
      return NextResponse.json({ error: 'dishId is required' }, { status: 400 })
    }

    const state = await toggleFavoriteDish(body.dishId)
    return NextResponse.json({ state })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
