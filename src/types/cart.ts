export interface CartItem {
  id: string
  name: string
  price: number
  calories: number
  proteins: number
  fats: number
  carbs: number
  quantity: number
}

export interface ClientState {
  items: CartItem[]
  favorites: string[]
  dailyLimit: number
}
