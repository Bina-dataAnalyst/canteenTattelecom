'use client'

import { useEffect, useMemo, useState } from 'react'
import { DishCard } from '@/components/shared/DishCard'

type Dish = {
  id: string
  name: string
  price: number
  calories: number
  proteins: number
  fats: number
  carbs: number
  quantity?: number
}

type PreviousOrder = {
  id: string
  createdAt: string
  totalPrice: number
  items: Dish[]
}

type HistoryResponse = {
  previousOrder: PreviousOrder | null
  frequentDishes: Dish[]
  favoriteDishes: Dish[]
  totalOrders: number
  error?: string
}

export default function HistoryPage() {
  const [data, setData] = useState<HistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/history', { cache: 'no-store' })
        const payload = (await response.json()) as HistoryResponse

        if (!response.ok) {
          throw new Error(payload.error || 'Не удалось загрузить историю')
        }

        setData(payload)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Неизвестная ошибка')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const previousOrderDate = useMemo(() => {
    if (!data?.previousOrder?.createdAt) return null
    return new Date(data.previousOrder.createdAt).toLocaleString('ru-RU')
  }, [data?.previousOrder?.createdAt])

  return (
    <main className="min-h-screen bg-[#FFF8F1] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-10">
        <div>
          <h1 className="mb-2 text-2xl font-black text-[#E65100] sm:text-3xl">История заказов</h1>
          <p className="text-gray-600">Предыдущий заказ, часто выбираемые и избранные блюда в одном месте.</p>
        </div>

        {loading && <p className="text-gray-500">Загружаем историю...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && data && (
          <>
            <section className="rounded-lg border border-orange-100 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-black mb-3">Предыдущий заказ</h2>
              {!data.previousOrder ? (
                <p className="text-gray-500">Завершенных заказов пока нет.</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">Дата: {previousOrderDate}</p>
                  <p className="text-gray-600">Сумма: {data.previousOrder.totalPrice} ₽</p>
                  <ul className="text-gray-700">
                    {data.previousOrder.items.map((item) => (
                      <li key={item.id}>{item.name} x {item.quantity}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-black mb-4">Часто заказываемые блюда</h2>
              {data.frequentDishes.length === 0 ? (
                <div className="rounded-lg bg-white p-6 text-gray-500">Пока недостаточно данных по заказам.</div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                  {data.frequentDishes.map((dish) => (
                    <DishCard key={dish.id} dish={dish} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-black mb-4">Избранные блюда</h2>
              {data.favoriteDishes.length === 0 ? (
                <div className="rounded-lg bg-white p-6 text-gray-500">Избранных блюд пока нет.</div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                  {data.favoriteDishes.map((dish) => (
                    <DishCard key={dish.id} dish={dish} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  )
}
