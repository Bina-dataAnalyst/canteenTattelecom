'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, History, ShoppingCart, UtensilsCrossed } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { CartDrawer } from './CartDrawer'

const navButton =
  'inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg transition-colors border border-transparent hover:bg-orange-100 hover:text-orange-700'

export const TopActionHeader = () => {
  const pathname = usePathname()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { initialize, getTotalCount } = useCartStore()
  const totalCount = getTotalCount()

  useEffect(() => {
    void initialize()
  }, [initialize])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[140] border-b border-orange-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <Link href="/" className="min-w-0 font-black text-base text-[#E65100] sm:text-xl">
            Наша Столовая
          </Link>

          <nav className="flex shrink-0 items-center gap-1 text-gray-600 sm:gap-2">
            <Link href="/" className={`${navButton} ${pathname === '/' ? 'bg-orange-100 text-orange-700' : ''}`} title="Меню">
              <UtensilsCrossed size={18} />
            </Link>

            <Link
              href="/favorites"
              className={`${navButton} ${pathname === '/favorites' ? 'bg-orange-100 text-orange-700' : ''}`}
              title="Избранное"
            >
              <Heart size={18} />
            </Link>

            <Link
              href="/history"
              className={`${navButton} ${pathname === '/history' ? 'bg-orange-100 text-orange-700' : ''}`}
              title="История заказов"
            >
              <History size={18} />
            </Link>

            <button onClick={() => setIsCartOpen(true)} className={`${navButton} relative`} title="Корзина">
              <ShoppingCart size={18} />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-orange-500 text-white text-[10px] font-bold px-1 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
