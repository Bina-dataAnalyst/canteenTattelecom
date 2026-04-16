"use client";
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

  // Проверяем правило 1:1:4 с допуском +-20%
  const fatToProteinRatio = hasEnoughData ? stats.fats / stats.proteins : 0;
  const carbsToProteinRatio = hasEnoughData ? stats.carbs / stats.proteins : 0;
  const tolerance = 0.2;
  const isBalanced =
    hasEnoughData &&
    Math.abs(fatToProteinRatio - 1) <= tolerance &&
    Math.abs(carbsToProteinRatio - 4) <= tolerance * 4;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[40px] w-full max-w-md p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">
          Твой баланс БЖУ
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Распределение нутриентов в твоем текущем заказе
        </p>

        <div className="h-[300px] w-full">
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
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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

        <div className="grid grid-cols-3 gap-4 mt-6">
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

        <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Рекомендуемое соотношение БЖУ:{" "}
            <span className="font-bold">1:1:4</span> (белки:жиры:углеводы).
          </p>

          {isEmpty ? (
            <p className="mt-2 text-xs text-gray-500">
              Добавь блюда, чтобы оценить сбалансированность заказа.
            </p>
          ) : isBalanced ? (
            <div className="mt-3 inline-flex items-center gap-2.5 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1.5 text-xs font-semibold">
              <Smile size={25} strokeWidth={2.25} />
              Получился сбалансированный заказ.
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-2.5 rounded-full bg-red-100 text-red-700 px-3 py-1.5 text-xs font-semibold">
              <Frown size={25} strokeWidth={2.25} />
              Пропорции не соблюдены, рацион не сбалансирован.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
