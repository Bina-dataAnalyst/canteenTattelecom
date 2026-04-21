"use client";
import Image from "next/image";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useCartStore } from "@/store/useCartStore";
import { X, Smile, Frown } from "lucide-react";

export const MacrosModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { getTotalStats } = useCartStore();
  const stats = getTotalStats();

  if (!isOpen) return null;

  // Данные для графика
  const data = [
    { name: "Белки", value: stats.proteins, color: "#4CAF50" }, // Зеленый
    { name: "Жиры", value: stats.fats, color: "#FB8C00" }, // Оранжевый
    { name: "Углеводы", value: stats.carbs, color: "#2196F3" }, // Синий
  ];

  // Если корзина пуста, график будет выглядеть грустно, добавим проверку
  const isEmpty = stats.proteins + stats.fats + stats.carbs === 0;
  const hasEnoughData = stats.proteins > 0 && stats.fats > 0 && stats.carbs > 0;

  // 1. Расчеты калорийности (энергетическая ценность)
  const pCal = stats.proteins * 4;
  const fCal = stats.fats * 9;
  const cCal = stats.carbs * 4;
  const totalCal = pCal + fCal + cCal;

  // 2. Процентное распределение
  const pPct = totalCal > 0 ? (pCal / totalCal) * 100 : 0;
  const fPct = totalCal > 0 ? (fCal / totalCal) * 100 : 0;
  const cPct = totalCal > 0 ? (cCal / totalCal) * 100 : 0;

  // 3. Функция генерации совета
  const getRecommendation = () => {
    if (totalCal === 0) return "Добавь блюда, чтобы оценить баланс заказа.";

    const advice = [];

    if (pPct < 10)
      advice.push(
        "Маловато белка — добавь мясо, рыбу или бобовые для сытости.",
      );
    if (pPct > 25)
      advice.push("Много белка — это хорошо для мышц, но не забудь про овощи.");

    if (fPct > 40)
      advice.push(
        "Многовато жиров — попробуй выбрать блюдо на пару или добавить салат без заправки.",
      );
    if (fPct < 20 && totalCal > 300)
      advice.push(
        "Полезные жиры важны для мозга — добавь рыбу или блюдо с растительным маслом.",
      );

    if (cPct > 70)
      advice.push(
        "Углеводов с избытком — может, заменим гарнир на свежие овощи?",
      );
    if (cPct < 40 && totalCal > 300)
      advice.push(
        "Маловато углеводов — может не хватить энергии до конца дня. Добавь гарнир.",
      );

    return advice.length > 0
      ? advice[Math.floor(Math.random() * advice.length)] // Берем случайный из подходящих
      : "Идеальный баланс! Твой организм скажет «спасибо».";
  };

  const isBalanced =
    totalCal > 0 &&
    pPct >= 10 &&
    pPct <= 25 &&
    fPct >= 20 &&
    fPct <= 40 &&
    cPct >= 40 &&
    cPct <= 70;
  const adviceText = getRecommendation();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-5 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="mb-2 pr-8 text-xl font-black uppercase sm:text-2xl">
          Твой баланс БЖУ
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Распределение нутриентов в твоем текущем заказе
        </p>

        <div className="h-[240px] w-full sm:h-[300px]">
          {isEmpty ? (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              Добавь блюда, чтобы увидеть статистику
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={8} // Добавили скругление секторов
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold">
              Белки
            </p>
            <p className="text-lg font-black text-[#4CAF50]">
              {stats.proteins}г
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold">
              Жиры
            </p>
            <p className="text-lg font-black text-[#FB8C00]">{stats.fats}г</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold">
              Углеводы
            </p>
            <p className="text-lg font-black text-[#2196F3]">{stats.carbs}г</p>
          </div>
        </div>

        <div
          className={`mt-6 rounded-2xl p-4 border transition-colors duration-300 ${
            isEmpty
              ? "bg-gray-50 border-gray-100"
              : isBalanced
                ? "bg-emerald-50 border-emerald-100"
                : "bg-amber-50 border-amber-100"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {isEmpty ? (
                <Smile className="text-gray-400" size={20} />
              ) : isBalanced ? (
                <Smile className="text-emerald-600" size={20} />
              ) : (
                <Smile className="text-amber-600" size={20} />
              )}
            </div>
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                  isEmpty
                    ? "text-gray-500"
                    : isBalanced
                      ? "text-emerald-700"
                      : "text-amber-700"
                }`}
              >
                {isEmpty
                  ? "Анализ меню"
                  : isBalanced
                    ? "Отличный выбор!"
                    : "Совет по балансу"}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed italic">
                {adviceText}
              </p>
            </div>
          </div>
        </div>
        {/* --- НОВЫЙ БЛОК: Гарвардская тарелка --- */}
        <div className="mt-8 border-t border-gray-100 pt-8 text-center">
          <h3 className="text-lg font-bold mb-1 tracking-tight text-gray-900">
            Принцип «Идеальной тарелки»
          </h3>

          {/* ИСПРАВЛЕНО: mb-6 -> mb-2 */}
          <p className="text-xs text-gray-500 mb-2 max-w-xs mx-auto leading-relaxed">
            Простой способ собрать сбалансированный обед без сложных расчетов.
            Просто взгляни на свой поднос!
          </p>

          {/* ИСПРАВЛЕНО: mt-8 -> mt-2 и max-w-md для хорошего размера */}
          <div className="relative w-full aspect-square max-w-md mx-auto opacity-90 hover:opacity-100 transition-opacity mt-2">
            <Image
              src="/images/harvard-plate.jpg"
              alt="Инфографика: Гарвардская тарелка здорового питания"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-4 italic">
            Источник: Harvard Health Publishing
          </p>
        </div>
      </div>
    </div>
  );
};
