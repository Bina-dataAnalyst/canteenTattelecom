'use client'

import { Plus, Minus, ShoppingCart, Trash2, X } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, addItem, removeItem, removeItemCompletely, getTotalStats } = useCartStore()
  const stats = getTotalStats()
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[120] flex">
      <button
        aria-label="Закрыть корзину"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <div className="relative ml-auto h-full w-full max-w-md bg-white shadow-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <ShoppingCart size={24} className="text-orange-500" />
            Корзина
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 italic">
            Корзина пока пуста
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-gray-100 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.price} ₽ x {item.quantity}</p>
                    </div>

                    <button
                      onClick={() => void removeItemCompletely(item.id)}
                      className="text-gray-400 hover:text-red-500"
                      title="Удалить блюдо"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => void removeItem(item.id)}
                      className="bg-gray-100 p-1.5 rounded-lg hover:bg-gray-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="min-w-[24px] text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        void addItem({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          calories: item.calories,
                          proteins: item.proteins,
                          fats: item.fats,
                          carbs: item.carbs,
                        })
                      }
                      className="bg-orange-500 text-white p-1.5 rounded-lg hover:bg-orange-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t pt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Калории</span>
                <span className="font-bold">{stats.calories} ккал</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Итого</span>
                <span className="font-black text-orange-600 text-lg">{totalPrice} ₽</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
