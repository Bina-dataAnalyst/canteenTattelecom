import { NextResponse } from 'next/server'
import { getClientState } from '@/lib/server/session-state'

export async function GET() {
  try {
    const state = await getClientState()
    return NextResponse.json({ state })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
