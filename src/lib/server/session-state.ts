import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import type { CartItem, ClientState } from '@/types/cart'

type CartLine = {
  dishId: string
  quantity: number
}

const GUEST_COOKIE = 'canteen_guest_token'
const DEFAULT_CANTEEN_ID = 'main-canteen'

const normalizeCartLines = (value: unknown): CartLine[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const dishId = Reflect.get(item, 'dishId')
      const quantity = Reflect.get(item, 'quantity')

      if (typeof dishId !== 'string') return null

      const parsedQuantity = Number(quantity)
      if (!Number.isFinite(parsedQuantity)) return null

      return {
        dishId,
        quantity: Math.max(0, Math.floor(parsedQuantity)),
      }
    })
    .filter((item): item is CartLine => !!item && item.quantity > 0)
}

export const getOrCreateGuestUser = async () => {
  const cookieStore = await cookies()
  let token = cookieStore.get(GUEST_COOKIE)?.value

  if (!token) {
    token = globalThis.crypto.randomUUID()
    cookieStore.set(GUEST_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  const email = `guest-${token}@guest.local`

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Guest User',
      calorieLimit: 1200,
    },
  })

  return user
}

const getOrCreatePendingOrder = async (userId: string) => {
  await prisma.canteen.upsert({
    where: { id: DEFAULT_CANTEEN_ID },
    update: {},
    create: {
      id: DEFAULT_CANTEEN_ID,
      name: 'Основная столовая',
    },
  })

  const existing = await prisma.order.findFirst({
    where: {
      userId,
      status: 'PENDING',
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (existing) return existing

  return prisma.order.create({
    data: {
      userId,
      canteenId: DEFAULT_CANTEEN_ID,
      status: 'PENDING',
      totalPrice: 0,
      items: [],
    },
  })
}

const buildCartItems = async (lines: CartLine[]): Promise<CartItem[]> => {
  if (lines.length === 0) return []

  const dishes = await prisma.dish.findMany({
    where: {
      id: { in: lines.map((line) => line.dishId) },
      isAvailable: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
      calories: true,
      proteins: true,
      fats: true,
      carbs: true,
    },
  })

  const dishMap = new Map(dishes.map((dish) => [dish.id, dish]))

  return lines
    .map((line) => {
      const dish = dishMap.get(line.dishId)
      if (!dish) return null

      return {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        calories: dish.calories ?? 0,
        proteins: dish.proteins ?? 0,
        fats: dish.fats ?? 0,
        carbs: dish.carbs ?? 0,
        quantity: line.quantity,
      }
    })
    .filter((item): item is CartItem => !!item)
}

const calculateTotalPrice = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

const getFavorites = async (userId: string) => {
  const rows = await prisma.favorite.findMany({
    where: { userId },
    select: { dishId: true },
  })

  return rows.map((row) => row.dishId)
}

export const getClientState = async (): Promise<ClientState> => {
  const user = await getOrCreateGuestUser()
  const order = await getOrCreatePendingOrder(user.id)
  const lines = normalizeCartLines(order.items)
  const items = await buildCartItems(lines)
  const favorites = await getFavorites(user.id)

  if (lines.length !== items.length) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        items: items.map((item) => ({ dishId: item.id, quantity: item.quantity })),
        totalPrice: calculateTotalPrice(items),
      },
    })
  }

  return {
    items,
    favorites,
    dailyLimit: user.calorieLimit,
  }
}

export const changeCartItemQuantity = async (dishId: string, delta: number) => {
  const user = await getOrCreateGuestUser()
  const order = await getOrCreatePendingOrder(user.id)
  const lines = normalizeCartLines(order.items)

  const index = lines.findIndex((line) => line.dishId === dishId)

  if (index >= 0) {
    lines[index] = {
      ...lines[index],
      quantity: Math.max(0, lines[index].quantity + delta),
    }
  } else if (delta > 0) {
    lines.push({ dishId, quantity: delta })
  }

  const sanitized = lines.filter((line) => line.quantity > 0)
  const items = await buildCartItems(sanitized)

  await prisma.order.update({
    where: { id: order.id },
    data: {
      items: items.map((item) => ({ dishId: item.id, quantity: item.quantity })),
      totalPrice: calculateTotalPrice(items),
    },
  })

  return getClientState()
}

export const removeCartItem = async (dishId: string) => {
  const user = await getOrCreateGuestUser()
  const order = await getOrCreatePendingOrder(user.id)
  const lines = normalizeCartLines(order.items).filter((line) => line.dishId !== dishId)
  const items = await buildCartItems(lines)

  await prisma.order.update({
    where: { id: order.id },
    data: {
      items: items.map((item) => ({ dishId: item.id, quantity: item.quantity })),
      totalPrice: calculateTotalPrice(items),
    },
  })

  return getClientState()
}

export const toggleFavoriteDish = async (dishId: string) => {
  const user = await getOrCreateGuestUser()

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_dishId: {
        userId: user.id,
        dishId,
      },
    },
  })

  if (existing) {
    await prisma.favorite.delete({
      where: {
        userId_dishId: {
          userId: user.id,
          dishId,
        },
      },
    })
  } else {
    await prisma.favorite.create({
      data: {
        userId: user.id,
        dishId,
      },
    })
  }

  return getClientState()
}

export const setUserDailyLimit = async (dailyLimit: number) => {
  const safeLimit = Math.max(1, Math.floor(dailyLimit))
  const user = await getOrCreateGuestUser()

  await prisma.user.update({
    where: { id: user.id },
    data: { calorieLimit: safeLimit },
  })

  return getClientState()
}
