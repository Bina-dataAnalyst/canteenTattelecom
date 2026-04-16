import { NextResponse } from 'next/server'
import { getFavoriteDishes, getHistoryOverview } from '@/lib/server/history'

export async function GET() {
  try {
    const [overview, favorites] = await Promise.all([getHistoryOverview(), getFavoriteDishes()])
    return NextResponse.json({
      ...overview,
      favoriteDishes: favorites,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
