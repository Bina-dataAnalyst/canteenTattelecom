import { create } from 'zustand'

interface CartItem {
  id: string
  name: string
  price: number
  calories: number
  proteins: number
  fats: number
  carbs: number
  quantity: number 
}

interface CartState {
  items: CartItem[]
  favorites: string[]
  dailyLimit: number // Добавили лимит в состояние
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  toggleFavorite: (id: string) => void
  setDailyLimit: (limit: number) => void // Функция изменения лимита
  getTotalStats: () => { 
    calories: number, 
    proteins: number, 
    fats: number, 
    carbs: number 
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  favorites: [],
  dailyLimit: 1200, // Значение по умолчанию

  setDailyLimit: (limit) => set({ dailyLimit: limit }),

  toggleFavorite: (id) =>
    set((state) => ({
      ...state,
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((favId) => favId !== id)
        : [...state.favorites, id],
    })),

  addItem: (newItem) => set((state) => {
    const existingItem = state.items.find(i => i.id === newItem.id);
    if (existingItem) {
      return {
        items: state.items.map(i => 
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return { items: [...state.items, { ...newItem, quantity: 1 }] };
  }),

  removeItem: (id) => set((state) => {
    const existingItem = state.items.find(i => i.id === id);
    if (existingItem?.quantity === 1) {
      return { items: state.items.filter(i => i.id !== id) };
    }
    return {
      items: state.items.map(i => 
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      )
    };
  }),

  getTotalStats: () => {
    const items = get().items;
    return items.reduce((acc, item) => ({
      calories: acc.calories + (item.calories * item.quantity),
      proteins: acc.proteins + (item.proteins * item.quantity),
      fats: acc.fats + (item.fats * item.quantity),
      carbs: acc.carbs + (item.carbs * item.quantity),
    }), { calories: 0, proteins: 0, fats: 0, carbs: 0 });
  }
}))