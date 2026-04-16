import { create } from 'zustand'
import type { CartItem, ClientState } from '@/types/cart'

type Totals = {
  calories: number
  proteins: number
  fats: number
  carbs: number
}

interface CartState extends ClientState {
  isHydrated: boolean
  initialize: () => Promise<void>
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>
  removeItem: (id: string) => Promise<void>
  removeItemCompletely: (id: string) => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  setDailyLimit: (limit: number) => Promise<void>
  getTotalStats: () => Totals
  getTotalCount: () => number
}

type StateResponse = {
  state: ClientState
  error?: string
}

const applyServerState = (state: ClientState) => ({
  items: state.items,
  favorites: state.favorites,
  dailyLimit: state.dailyLimit,
  isHydrated: true,
})

const fetchState = async (): Promise<ClientState> => {
  const response = await fetch('/api/state', {
    method: 'GET',
    cache: 'no-store',
  })

  const payload = (await response.json()) as StateResponse

  if (!response.ok || !payload.state) {
    throw new Error(payload.error || 'Failed to fetch state')
  }

  return payload.state
}

const postState = async <TBody>(url: string, body: TBody, method: 'POST' | 'DELETE' = 'POST') => {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const payload = (await response.json()) as StateResponse

  if (!response.ok || !payload.state) {
    throw new Error(payload.error || 'Failed to update state')
  }

  return payload.state
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  favorites: [],
  dailyLimit: 1200,
  isHydrated: false,

  initialize: async () => {
    if (get().isHydrated) return

    try {
      const serverState = await fetchState()
      set(applyServerState(serverState))
    } catch (error) {
      console.error('State hydrate failed:', error)
      set({ isHydrated: true })
    }
  },

  addItem: async (newItem) => {
    try {
      const serverState = await postState('/api/cart', { dishId: newItem.id, delta: 1 })
      set(applyServerState(serverState))
    } catch (error) {
      console.error('Add item failed:', error)
    }
  },

  removeItem: async (id) => {
    try {
      const serverState = await postState('/api/cart', { dishId: id, delta: -1 })
      set(applyServerState(serverState))
    } catch (error) {
      console.error('Remove item failed:', error)
    }
  },

  removeItemCompletely: async (id) => {
    try {
      const serverState = await postState('/api/cart', { dishId: id }, 'DELETE')
      set(applyServerState(serverState))
    } catch (error) {
      console.error('Remove item completely failed:', error)
    }
  },

  toggleFavorite: async (id) => {
    try {
      const serverState = await postState('/api/favorites', { dishId: id })
      set(applyServerState(serverState))
    } catch (error) {
      console.error('Toggle favorite failed:', error)
    }
  },

  setDailyLimit: async (limit) => {
    try {
      const safeLimit = Math.max(1, Math.floor(limit))
      const serverState = await postState('/api/daily-limit', { dailyLimit: safeLimit })
      set(applyServerState(serverState))
    } catch (error) {
      console.error('Set daily limit failed:', error)
    }
  },

  getTotalStats: () => {
    const items = get().items
    return items.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories * item.quantity,
        proteins: acc.proteins + item.proteins * item.quantity,
        fats: acc.fats + item.fats * item.quantity,
        carbs: acc.carbs + item.carbs * item.quantity,
      }),
      { calories: 0, proteins: 0, fats: 0, carbs: 0 },
    )
  },

  getTotalCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}))
