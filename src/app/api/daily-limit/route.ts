import { NextResponse } from 'next/server'
import { setUserDailyLimit } from '@/lib/server/session-state'

type DailyLimitRequest = {
  dailyLimit?: number
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DailyLimitRequest

    if (typeof body.dailyLimit !== 'number' || !Number.isFinite(body.dailyLimit)) {
      return NextResponse.json({ error: 'dailyLimit must be a number' }, { status: 400 })
    }

    const state = await setUserDailyLimit(body.dailyLimit)
    return NextResponse.json({ state })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
