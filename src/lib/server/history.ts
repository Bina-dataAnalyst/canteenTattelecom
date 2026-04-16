import { prisma } from '@/lib/prisma'
import { getOrCreateGuestUser } from '@/lib/server/session-state'

export type HistoryDish = {
  id: string
  name: string
  price: number
  calories: number
  proteins: number
  fats: number
  carbs: number
  composition?: string | null
  weight?: string | null
  note?: string | null
  quantity?: number
}

type CartLine = {
  dishId: string
  quantity: number
}

const parseLines = (value: unknown): CartLine[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null

      const dishId = Reflect.get(item, 'dishId')
      const quantity = Number(Reflect.get(item, 'quantity'))

      if (typeof dishId !== 'string' || !Number.isFinite(quantity) || quantity <= 0) {
        return null
      }

      return {
        dishId,
        quantity: Math.floor(quantity),
      }
    })
    .filter((item): item is CartLine => !!item)
}

const toHistoryDish = (dish: {
  id: string
  name: string
  price: number
  calories: number | null
  proteins: number | null
  fats: number | null
  carbs: number | null
  composition?: string | null
  weight?: string | null
  note?: string | null
}, quantity?: number): HistoryDish => ({
  id: dish.id,
  name: dish.name,
  price: dish.price,
  calories: dish.calories ?? 0,
  proteins: dish.proteins ?? 0,
  fats: dish.fats ?? 0,
  carbs: dish.carbs ?? 0,
  composition: dish.composition ?? null,
  weight: dish.weight ?? null,
  note: dish.note ?? null,
  quantity,
})

export const getFavoriteDishes = async () => {
  const user = await getOrCreateGuestUser()

  const rows = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: {
      dish: {
        select: {
          id: true,
          name: true,
          price: true,
          calories: true,
          proteins: true,
          fats: true,
          carbs: true,
          composition: true,
          weight: true,
          note: true,
        },
      },
    },
  })

  return rows.map((row) => toHistoryDish(row.dish))
}

export const getHistoryOverview = async () => {
  const user = await getOrCreateGuestUser()

  const completedOrders = await prisma.order.findMany({
    where: {
      userId: user.id,
      status: { not: 'PENDING' },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
    select: {
      id: true,
      createdAt: true,
      totalPrice: true,
      items: true,
    },
  })

  const lastOrder = completedOrders[0] ?? null
  const lastOrderLines = parseLines(lastOrder?.items)

  const aggregate = new Map<string, number>()

  for (const order of completedOrders) {
    const lines = parseLines(order.items)
    for (const line of lines) {
      aggregate.set(line.dishId, (aggregate.get(line.dishId) ?? 0) + line.quantity)
    }
  }

  const allDishIds = new Set<string>([...aggregate.keys(), ...lastOrderLines.map((line) => line.dishId)])

  const dishes = allDishIds.size
    ? await prisma.dish.findMany({
        where: {
          id: { in: Array.from(allDishIds) },
        },
        select: {
          id: true,
          name: true,
          price: true,
          calories: true,
          proteins: true,
          fats: true,
          carbs: true,
          composition: true,
          weight: true,
          note: true,
        },
      })
    : []

  const dishMap = new Map(dishes.map((dish) => [dish.id, dish]))

  const frequentDishes = Array.from(aggregate.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([dishId, quantity]) => {
      const dish = dishMap.get(dishId)
      if (!dish) return null
      return toHistoryDish(dish, quantity)
    })
    .filter((dish): dish is HistoryDish => !!dish)

  const previousOrderItems = lastOrderLines
    .map((line) => {
      const dish = dishMap.get(line.dishId)
      if (!dish) return null
      return toHistoryDish(dish, line.quantity)
    })
    .filter((dish): dish is HistoryDish => !!dish)

  return {
    previousOrder: lastOrder
      ? {
          id: lastOrder.id,
          createdAt: lastOrder.createdAt,
          totalPrice: lastOrder.totalPrice,
          items: previousOrderItems,
        }
      : null,
    frequentDishes,
    totalOrders: completedOrders.length,
  }
}
