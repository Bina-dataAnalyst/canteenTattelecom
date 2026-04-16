'use client'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { MacrosModal } from '../MacrosModal'
import { Settings, History } from 'lucide-react'
import Link from 'next/link'

export const HeaderWidgets = () => {
  const [isMacrosOpen, setIsMacrosOpen] = useState(false)
  const { initialize, getTotalStats, dailyLimit, setDailyLimit } = useCartStore()
  const { calories } = getTotalStats()

  const [isEditing, setIsEditing] = useState(false)
  const [tempLimit, setTempLimit] = useState(dailyLimit)

  useEffect(() => {
    void initialize()
  }, [initialize])

  useEffect(() => {
    setTempLimit(dailyLimit)
  }, [dailyLimit])

  const isOver = calories > dailyLimit

  const handleSaveLimit = () => {
    void setDailyLimit(tempLimit)
    setIsEditing(false)
  }

  const safeLimit = Math.max(dailyLimit, 1)
  const widgetClass =
    'relative w-70 h-30 bg-white/80 backdrop-blur-md rounded-tr-[40px] rounded-bl-[40px] shadow-lg p-4 flex flex-col justify-center items-center transition-all hover:scale-105 border border-white/50'

  return (
    <>
      <div className="sticky top-24 flex justify-center gap-14 -mt-24 mb-1 relative z-50 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className={widgetClass}>
          <p className="text-[18px] text-gray-500 font-bold uppercase mb-1 tracking-wider">Счетчик калорий</p>

          <div className="flex items-center gap-2">
            <div
              className={`px-6 py-1 rounded-full font-black text-white text-m transition-colors duration-500 ${isOver ? 'bg-red-500' : 'bg-orange-500'}`}
            >
              {calories} ккал
            </div>

            <span className="text-gray-400 text-xs font-bold">/</span>

            {isEditing ? (
              <input
                type="number"
                value={tempLimit}
                onChange={(e) => setTempLimit(Number(e.target.value))}
                onBlur={handleSaveLimit}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveLimit()}
                autoFocus
                className="w-16 bg-gray-100 rounded px-1 text-m font-bold focus:outline-none"
              />
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 cursor-pointer group"
                title="Нажать, чтобы изменить лимит"
              >
                <span className="text-gray-500 text-xs font-bold group-hover:text-orange-500 transition-colors">
                  {dailyLimit}
                </span>
                <Settings size={12} className="text-gray-300 group-hover:text-orange-500 transition-all" />
              </div>
            )}
          </div>

          <div className="w-32 h-1 bg-gray-100 mt-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${Math.min((calories / safeLimit) * 100, 100)}%` }}
            />
          </div>
        </div>

        <Link href="/history" className={widgetClass}>
          <p className="text-[18px] text-gray-500 font-bold uppercase mb-1">История заказов</p>
          <div className="bg-[#4CAF50] text-white px-6 py-1 rounded-full font-black text-m flex items-center gap-2">
            <History size={14} />
            Открыть
          </div>
        </Link>

        <button onClick={() => setIsMacrosOpen(true)} className={widgetClass}>
          <p className="text-[18px] text-gray-500 font-bold uppercase mb-1">Твой баланс КБЖУ</p>
          <div className="bg-blue-500 text-white px-8 py-1 rounded-full font-black text-m">Смотреть</div>
        </button>
      </div>

      <MacrosModal isOpen={isMacrosOpen} onClose={() => setIsMacrosOpen(false)} />
    </>
  )
}
