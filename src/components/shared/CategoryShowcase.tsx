"use client";

import { useMemo, useState } from "react";
import { DishCard } from "@/components/shared/DishCard";

type Dish = {
  id: string;
  name: string;
  price: number;
  calories: number | null;
  composition?: string | null;
  proteins?: number | null;
  fats?: number | null;
  carbs?: number | null;
  weight?: string | null;
  note?: string | null;
  image?: string | null;
};

type CategoryWithDishes = {
  id: string;
  name: string;
  dishes: Dish[];
};

type CategoryShowcaseProps = {
  categories: CategoryWithDishes[];
  preferredOrder: string[];
};

const ALL = "Всё";

export const CategoryShowcase = ({
  categories,
  preferredOrder,
}: CategoryShowcaseProps) => {
  const [selected, setSelected] = useState<string>(ALL);

  const sortedCategories = useMemo(() => {
    const orderMap = new Map(
      preferredOrder.map((name, index) => [name, index]),
    );
    return [...categories].sort((a, b) => {
      const aOrder = orderMap.get(a.name) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = orderMap.get(b.name) ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.name.localeCompare(b.name, "ru");
    });
  }, [categories, preferredOrder]);

  const tabs = useMemo(() => [ALL, ...preferredOrder], [preferredOrder]);

  const visibleCategories = useMemo(() => {
    if (selected === ALL) return sortedCategories;
    return sortedCategories.filter((category) => category.name === selected);
  }, [selected, sortedCategories]);

  return (
    <main className="bg-[#E8F5E9] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-8 rounded-[2rem] border border-white/50 bg-white/30 p-3 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.28)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/25 sm:p-4">
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
            {tabs.map((tab) => {
              const isActive = tab === selected;

              return (
                <button
                  key={tab}
                  onClick={() => setSelected(tab)}
                  className={`relative rounded-full border px-5 py-3 text-sm font-semibold tracking-[0.01em] transition-all duration-300 sm:px-6 ${
                    isActive
                      ? "border-white/60 bg-white/70 text-orange-600 shadow-[0_10px_30px_-12px_rgba(255,255,255,0.95),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl scale-[1.02]"
                      : "border-white/35 bg-white/20 text-orange-950/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl hover:bg-white/35 hover:text-orange-700 hover:scale-[1.01]"
                  }`}
                >
                  <span className="relative z-10">{tab}</span>

                  {isActive && (
                    <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/70 via-white/25 to-white/10" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {visibleCategories.length === 0 && (
          <div className="rounded-lg bg-white p-6 text-gray-500 sm:p-8">
            В этой категории пока нет блюд.
          </div>
        )}

        {visibleCategories.map((category) => (
          <section key={category.id} className="mb-10 sm:mb-12">
            <h2 className="mb-5 text-xl font-bold text-[#2E7D32] sm:mb-6 sm:text-2xl">
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <div className="rounded-lg border border-white bg-white/80 p-6 text-gray-500">
                Блюда в этой категории скоро появятся.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-5 xl:grid-cols-5">
                {category.dishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
};
