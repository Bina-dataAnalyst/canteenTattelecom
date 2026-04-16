import { NextResponse } from 'next/server'
import { changeCartItemQuantity, removeCartItem } from '@/lib/server/session-state'

type CartRequest = {
  dishId?: string
  delta?: number
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CartRequest

    if (!body.dishId || typeof body.dishId !== 'string') {
      return NextResponse.json({ error: 'dishId is required' }, { status: 400 })
    }

    if (typeof body.delta !== 'number' || !Number.isFinite(body.delta)) {
      return NextResponse.json({ error: 'delta must be a number' }, { status: 400 })
    }

    const state = await changeCartItemQuantity(body.dishId, Math.trunc(body.delta))
    return NextResponse.json({ state })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as CartRequest

    if (!body.dishId || typeof body.dishId !== 'string') {
      return NextResponse.json({ error: 'dishId is required' }, { status: 400 })
    }

    const state = await removeCartItem(body.dishId)
    return NextResponse.json({ state })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
