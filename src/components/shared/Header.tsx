'use client'
import { useCartStore } from '@/store/useCartStore'

export const Header = () => {
  const items = useCartStore((state) => state.items)
  const totalCalories = items.reduce((sum, i) => sum + i.calories, 0)
  const limit = 1200 // Лимит калорий

  const isOver = totalCalories > limit

  return (
    <header className="bg-white p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="text-xl font-black uppercase text-[#E65100] sm:text-2xl">
          Наша <br /> столовая
        </div>
        
        <div className={`relative flex flex-col items-center justify-center rounded-lg px-4 py-3 shadow-sm sm:px-8 ${
          isOver ? 'bg-red-500 text-white' : 'bg-[#E3F2FD] text-[#2196F3]'
        }`}>
         <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Счетчик калорий</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black leading-none">{totalCalories}</span>
            <span className="text-sm font-medium opacity-70">/ {limit} ккал</span>
          </div>
        </div>
      </div>
    </header>
  )
}
