'use client'
import { useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { Heart, Plus, Minus, Trash2 } from 'lucide-react'

// Обновленный интерфейс, чтобы соответствовать базе
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
}

export const DishCard = ({ dish }: { dish: Dish }) => {
  
  const { items, favorites = [], toggleFavorite, addItem, removeItem } = useCartStore()
  const cartItem = items.find(i => i.id === dish.id)
  const quantity = cartItem ? cartItem.quantity : 0
  const [showConfirm, setShowConfirm] = useState(false)
  
  const isFavorite = favorites.includes(dish.id)

  const handleHeartClick = () => {
    if (isFavorite) {
      // Если уже в избранном — показываем модалку подтверждения
      setShowConfirm(true)
    } else {
      // Если нет — добавляем сразу
      toggleFavorite(dish.id)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50 flex flex-col relative group">
      {/* Кнопка Сердечко */}
      <button 
        onClick={handleHeartClick}
        className={`absolute top-4 right-4 p-2 rounded-full shadow-sm z-10 transition-all ${
          isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'
        }`}
      >
        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
      </button>

      {/* Твоя мини-модалка подтверждения */}
      {showConfirm && (
        <div className="absolute inset-0 bg-white/90 z-20 rounded-3xl flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-200">
          <p className="text-xs font-bold mb-3">Удалить из избранного?</p>
          <div className="flex gap-2">
            <button 
              onClick={() => { toggleFavorite(dish.id); setShowConfirm(false); }}
              className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs"
            >
              Да
            </button>
            <button 
              onClick={() => setShowConfirm(false)}
              className="bg-gray-200 px-3 py-1 rounded-lg text-xs"
            >
              Нет
            </button>
          </div>
        </div>
      )}

      {/* Контент карточки (как был раньше) */}
      <div className="w-full h-32 bg-gray-100 rounded-2xl mb-3 overflow-hidden" />
      <h3 className="font-semibold text-sm mb-1">{dish.name}</h3>
      <p className="text-gray-400 text-xs mb-2">{dish.calories ?? 0} ккал</p>

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="font-bold text-orange-600">{dish.price} ₽</span>
        {quantity === 0 ? (
          // Если 0 - показываем одну кнопку Плюс
          <button 
            onClick={() => addItem({
              id: dish.id, 
              name: dish.name, 
              price: dish.price, 
              calories: dish.calories || 0,
              proteins: dish.proteins || 0,
              fats: dish.fats || 0,
              carbs: dish.carbs || 0
            })}
            className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
          </button>
        ) : (
          // Если больше 0 - показываем Плюс, Минус и Количество
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
            <button 
              onClick={() => removeItem(dish.id)}
              className="bg-white text-orange-500 p-1 rounded-lg shadow-sm hover:bg-orange-50"
            >
              <Minus size={16} />
            </button>
            
            <span className="font-bold text-sm min-w-[20px] text-center">
              {quantity}
            </span>
            
            <button 
              onClick={() => addItem({
                id: dish.id, 
                name: dish.name, 
                price: dish.price, 
                calories: dish.calories || 0,
                proteins: dish.proteins || 0,
                fats: dish.fats || 0,
                carbs: dish.carbs || 0
              })}
              className="bg-orange-500 text-white p-1 rounded-lg shadow-sm hover:bg-orange-600"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}