import { prisma } from '@/lib/prisma'
import { HeaderWidgets } from '@/components/shared/HeaderWidgets';
import { CategoryShowcase } from '@/components/shared/CategoryShowcase'
import Image from 'next/image';
import type { Category, Dish } from '@prisma/client'
import { getAppAssetUrls } from '@/lib/server/app-assets'

// src/app/page.tsx
export default async function HomePage() {
  type CategoryWithDishes = Category & { dishes: Dish[] }
  const defaultCategoryOrder = [
    'Супы',
    'Вторые блюда',
    'Салаты',
    'Гарниры',
    'Выпечка',
    'Десерты',
    'Напитки',
    'Завтрак',
    'Сопутствующие товары',
  ]

  let categories: CategoryWithDishes[] = []
  let appAssets: Partial<Record<'hero_main' | 'hero_decor', string>> = {}
  let dbError: string | null = null

  try {
    await prisma.category.createMany({
      data: defaultCategoryOrder.map((name) => ({ name })),
      skipDuplicates: true,
    })

    const [loadedCategories, loadedAssets] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
          dishes: {
            where: {
              isAvailable: true, // Показываем только то, что НЕ в стоп-листе
            },
          },
        },
      }),
      getAppAssetUrls(),
    ])

    categories = loadedCategories
    appAssets = loadedAssets
  } catch (e) {
    dbError = e instanceof Error ? e.message : 'Unknown database error'
  }

  return (
    <div className="bg-white min-h-screen">
      {dbError && (
        <div className="bg-red-50 text-red-800 border-b border-red-200">
          <div className="container mx-auto px-10 py-3 text-sm">
            Не удалось подключиться к базе данных. Запусти Postgres и проверь `DATABASE_URL` в `.env`.
            {process.env.NODE_ENV !== 'production' && (
              <span className="block mt-1 opacity-80 break-words">{dbError}</span>
            )}
          </div>
        </div>
      )}
   

      {/* 1. Обновленный Верхний баннер  section делаем относительным (relative), чтобы тарелка позиционировалась внутри него */}
      <section className="relative w-full h-[550px] bg-[#E8F5E9] overflow-hidden">
        <div className="container mx-auto px-10 flex items-center h-full relative z-10">
          
          {/* Контент слева (как в макете) */}
          <div className="relative z-30 max-w-3xl ml-[10%]"> 
            <h1 className="text-[#FB8C00] font-black text-7xl leading-[1.1] mb-7 italic uppercase tracking-widest">
              ВКУСНО ПО <br /> 
              <span className="ml-4">ДОМАШНЕМУ</span>
            </h1>
            <p className="text-[#2E7D32] text-4xl font-bold opacity-90 leading-tight max-w-md">
              Свежие блюда, приготовленные специально для вас
            </p>
          </div>
          

       {/* --- Магия позиционирования тарелки (справа) --- */}
       <div className="absolute right-[-10%] -bottom-32 w-[1000px] h-[750px] z-20 pointer-events-none flex items-center justify-center">
          <Image 
            src={appAssets.hero_main ?? '/images/hero-dish.png'}
            alt="Тарелка с домашней едой"
            width={950} // Ширина картинки
            height={750} // Высота картинки
            className="object-contain" // Сохраняет пропорции
            priority // Загружает в первую очередь
            />
        </div>

        {/* Вторая картинка (салат в углу слева), которая была на макете */}
        <div className="absolute left-[-20%] -bottom-40 w-[650px] z-10 pointer-events-none opacity-90">
          <Image 
            src={appAssets.hero_decor ?? '/images/salad.png'}
            alt="Декор салат"
            width={470} 
            height={450} 
            className="object-contain rotate-12"
            />
            </div>
        </div>

        {/* Необязательно: Текстурный фон или легкий градиент поверх зеленого, как в макете Рисунка2 1 */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent z-0" />
      </section>
      {/* 2. Виджеты (налезают на баннер) */}
      {/* Лимит калорий пока что только он */}
      <HeaderWidgets />

      {/* 3. Комбо (Розовая секция) */}
      <section className="bg-[#FFF8F1] py-16 mt-1">
         <h2 className="text-center font-black text-2xl uppercase tracking-widest mb-10">ВЫБЕРИ СВОЙ КОМБО-ОБЕД</h2>
         <div className="container mx-auto grid grid-cols-3 gap-6 px-10">
            {/* Сюда пойдут карточки комбо-обедов */}
         </div>
      </section>

      {/* 4. Категории */}
      <CategoryShowcase categories={categories} preferredOrder={defaultCategoryOrder} />
    </div>
  );
}
