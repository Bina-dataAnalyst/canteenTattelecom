'use client'

import { useEffect, useState } from 'react'
import { DishCard } from '@/components/shared/DishCard'

type Dish = {
  id: string
  name: string
  price: number
  calories: number
  proteins: number
  fats: number
  carbs: number
}

type FavoritesResponse = {
  items?: Dish[]
  error?: string
}

export default function FavoritesPage() {
  const [items, setItems] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/favorites', { cache: 'no-store' })
        const payload = (await response.json()) as FavoritesResponse

        if (!response.ok) {
          throw new Error(payload.error || 'Не удалось загрузить избранное')
        }

        setItems(payload.items ?? [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Неизвестная ошибка')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  return (
    <main className="bg-[#E8F5E9] min-h-screen py-10">
      <div className="container mx-auto px-10">
        <h1 className="text-3xl font-black text-[#2E7D32] mb-2">Избранные блюда</h1>
        <p className="text-gray-600 mb-8">Здесь собраны блюда, которые ты лайкал.</p>

        {loading && <p className="text-gray-500">Загружаем...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-gray-500">Пока нет избранных блюд.</div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
