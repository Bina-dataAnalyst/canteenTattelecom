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
    <main className="bg-[#E8F5E9] py-12">
      <div className="container mx-auto px-10">
        <div className="mb-8 rounded-[28px] border border-orange-200/70 bg-white/70 backdrop-blur-xl shadow-[0_12px_32px_-20px_rgba(249,115,22,0.5)] p-3">
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
            {tabs.map((tab) => {
              const isActive = tab === selected;
              return (
                <button
                  key={tab}
                  onClick={() => setSelected(tab)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-[0_8px_18px_-8px_rgba(249,115,22,0.9)] scale-[1.02]"
                      : "bg-white/85 text-orange-900 hover:bg-orange-50 hover:scale-[1.01]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {visibleCategories.length === 0 && (
          <div className="rounded-3xl bg-white p-8 text-gray-500">
            В этой категории пока нет блюд.
          </div>
        )}

        {visibleCategories.map((category) => (
          <section key={category.id} className="mb-12">
            <h2 className="text-2xl font-bold text-[#2E7D32] mb-6">
              {category.name}
            </h2>

            {category.dishes.length === 0 ? (
              <div className="rounded-2xl bg-white/80 border border-white p-6 text-gray-500">
                Блюда в этой категории скоро появятся.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
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
