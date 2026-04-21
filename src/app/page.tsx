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
          <div className="mx-auto max-w-7xl px-4 py-3 text-sm sm:px-6 lg:px-10">
            Не удалось подключиться к базе данных. Запусти Postgres и проверь `DATABASE_URL` в `.env`.
            {process.env.NODE_ENV !== 'production' && (
              <span className="block mt-1 opacity-80 break-words">{dbError}</span>
            )}
          </div>
        </div>
      )}
   

      {/* 1. Обновленный Верхний баннер  section делаем относительным (relative), чтобы тарелка позиционировалась внутри него */}
      <section className="relative w-full min-h-[520px] overflow-hidden bg-[#E8F5E9] sm:min-h-[560px] lg:min-h-[550px]">
        <div className="relative z-10 mx-auto flex h-full min-h-[520px] max-w-7xl items-start px-4 pt-14 sm:min-h-[560px] sm:px-6 sm:pt-20 lg:min-h-[550px] lg:items-center lg:px-10 lg:pt-0">
          
          {/* Контент слева (как в макете) */}
          <div className="relative z-30 max-w-[44rem] lg:ml-[6%]"> 
            <h1 className="mb-5 text-4xl font-black uppercase leading-[1.08] text-[#FB8C00] sm:mb-7 sm:text-6xl lg:text-7xl">
              ВКУСНО ПО <br /> 
              <span className="sm:ml-4">ДОМАШНЕМУ</span>
            </h1>
            <p className="max-w-md text-2xl font-bold leading-tight text-[#2E7D32] opacity-90 sm:text-3xl lg:text-4xl">
              Свежие блюда, приготовленные специально для вас
            </p>
          </div>
          

       {/* --- Магия позиционирования тарелки (справа) --- */}
       <div className="pointer-events-none absolute -bottom-24 right-[-48%] z-20 flex h-[430px] w-[620px] items-center justify-center sm:-bottom-32 sm:right-[-28%] sm:h-[640px] sm:w-[820px] lg:right-[-10%] lg:h-[750px] lg:w-[1000px]">
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
        <div className="pointer-events-none absolute -bottom-28 left-[-42%] z-10 w-[420px] opacity-70 sm:-bottom-40 sm:left-[-24%] sm:w-[560px] lg:left-[-20%] lg:w-[650px] lg:opacity-90">
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
      <section className="mt-1 bg-[#FFF8F1] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
         <h2 className="mb-8 text-center text-xl font-black uppercase sm:mb-10 sm:text-2xl">ВЫБЕРИ СВОЙ КОМБО-ОБЕД</h2>
         <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Сюда пойдут карточки комбо-обедов */}
         </div>
      </section>

      {/* 4. Категории */}
      <CategoryShowcase categories={categories} preferredOrder={defaultCategoryOrder} />
    </div>
  );
}
