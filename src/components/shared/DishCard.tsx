'use client'
import { useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { Heart, Plus, Minus, X, PiggyBank, Sprout } from 'lucide-react'
import Image from 'next/image'

interface Dish {
  id: string
  name: string
  price: number
  calories: number | null
  composition?: string | null
  proteins?: number | null
  fats?: number | null
  carbs?: number | null
  weight?: string | null
  note?: string | null
  image?: string | null
}

export const DishCard = ({ dish }: { dish: Dish }) => {
  const { items, favorites = [], toggleFavorite, addItem, removeItem } = useCartStore()
  const cartItem = items.find((i) => i.id === dish.id)
  const quantity = cartItem ? cartItem.quantity : 0
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const isFavorite = favorites.includes(dish.id)
  const normalizedNote = (dish.note ?? '').toLowerCase()
  const hasPork = normalizedNote.includes('свини') || normalizedNote.includes('🐷')
  const isVegan = normalizedNote.includes('веган') || normalizedNote.includes('пост') || normalizedNote.includes('🌱')

  const handleHeartClick = () => {
    if (isFavorite) {
      setShowConfirm(true)
    } else {
      void toggleFavorite(dish.id)
    }
  }

  return (
    <>
      <div
        onClick={() => setIsDetailsOpen(true)}
        className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50 flex flex-col relative group transition-all duration-300 hover:-translate-y-1 hover:rotate-[0.25deg] hover:scale-[1.02] hover:shadow-[0_20px_45px_-25px_rgba(2,6,23,0.45)] cursor-pointer"
      >
      {(hasPork || isVegan) && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          {hasPork && (
            <div className="bg-rose-100 text-rose-700 rounded-full p-1.5" title="Содержит свинину">
              <PiggyBank size={14} />
            </div>
          )}
          {isVegan && (
            <div className="bg-emerald-100 text-emerald-700 rounded-full p-1.5" title="Постный состав">
              <Sprout size={14} />
            </div>
          )}
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation()
          handleHeartClick()
        }}
        className={`absolute top-4 right-4 p-2 rounded-full shadow-sm z-10 transition-all ${
          isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'
        }`}
      >
        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>

      {showConfirm && (
        <div className="absolute inset-0 bg-white/90 z-20 rounded-3xl flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-200">
          <p className="text-xs font-bold mb-3">Удалить из избранного?</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                void toggleFavorite(dish.id)
                setShowConfirm(false)
              }}
              className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs"
            >
              Да
            </button>
            <button onClick={() => setShowConfirm(false)} className="bg-gray-200 px-3 py-1 rounded-lg text-xs">
              Нет
            </button>
          </div>
        </div>
      )}

      <div className="w-full h-32 bg-gray-100 rounded-2xl mb-3 overflow-hidden relative">
        {dish.image ? (
          <Image src={dish.image} alt={dish.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : null}
      </div>
      <h3 className="font-semibold text-sm mb-1">{dish.name}</h3>
      <p className="text-gray-400 text-xs mb-2">{dish.calories ?? 0} ккал</p>

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="font-bold text-orange-600">{dish.price} ₽</span>
        {quantity === 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              void addItem({
                id: dish.id,
                name: dish.name,
                price: dish.price,
                calories: dish.calories || 0,
                proteins: dish.proteins || 0,
                fats: dish.fats || 0,
                carbs: dish.carbs || 0,
              })
            }}
            className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                void removeItem(dish.id)
              }}
              className="bg-white text-orange-500 p-1 rounded-lg shadow-sm hover:bg-orange-50"
            >
              <Minus size={16} />
            </button>

            <span className="font-bold text-sm min-w-[20px] text-center">{quantity}</span>

            <button
              onClick={(e) => {
                e.stopPropagation()
                void addItem({
                  id: dish.id,
                  name: dish.name,
                  price: dish.price,
                  calories: dish.calories || 0,
                  proteins: dish.proteins || 0,
                  fats: dish.fats || 0,
                  carbs: dish.carbs || 0,
                })
              }}
              className="bg-orange-500 text-white p-1 rounded-lg shadow-sm hover:bg-orange-600"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
      </div>

      {isDetailsOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <button
            className="absolute inset-0"
            aria-label="Закрыть окно блюда"
            onClick={() => setIsDetailsOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-[32px] bg-white p-6 shadow-2xl border border-orange-100">
            <button
              onClick={() => setIsDetailsOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black"
            >
              <X size={22} />
            </button>

            <h3 className="text-2xl font-black text-[#2E7D32] pr-8">{dish.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{dish.weight ? `Вес: ${dish.weight}` : 'Вес не указан'}</p>

            <div className="mt-5 grid grid-cols-4 gap-3 text-center">
              <div className="rounded-2xl bg-orange-50 p-3">
                <p className="text-[10px] text-orange-700 uppercase font-bold">Ккал</p>
                <p className="font-black text-orange-600">{dish.calories ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3">
                <p className="text-[10px] text-emerald-700 uppercase font-bold">Белки</p>
                <p className="font-black text-emerald-600">{dish.proteins ?? 0}г</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3">
                <p className="text-[10px] text-amber-700 uppercase font-bold">Жиры</p>
                <p className="font-black text-amber-600">{dish.fats ?? 0}г</p>
              </div>
              <div className="rounded-2xl bg-sky-50 p-3">
                <p className="text-[10px] text-sky-700 uppercase font-bold">Углеводы</p>
                <p className="font-black text-sky-600">{dish.carbs ?? 0}г</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-wide text-gray-400 font-bold mb-2">Состав</p>
              <p className="text-sm leading-relaxed text-gray-700">
                {dish.composition?.trim() ? dish.composition : 'Состав пока не указан.'}
              </p>
            </div>

            {(hasPork || isVegan) && (
              <div className="mt-5 flex flex-wrap gap-2">
                {hasPork && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 text-rose-700 px-3 py-1.5 text-xs font-semibold">
                    <PiggyBank size={14} />
                    Содержит свинину
                  </div>
                )}
                {isVegan && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1.5 text-xs font-semibold">
                    <Sprout size={14} />
                    Постный состав
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
