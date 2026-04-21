"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { MacrosModal } from "../MacrosModal";
import { Settings, History } from "lucide-react";
import Link from "next/link";

export const HeaderWidgets = () => {
  const [isMacrosOpen, setIsMacrosOpen] = useState(false);
  const { initialize, getTotalStats, dailyLimit, setDailyLimit } =
    useCartStore();
  const { calories } = getTotalStats();

  const [isEditing, setIsEditing] = useState(false);
  const [tempLimit, setTempLimit] = useState(dailyLimit);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    setTempLimit(dailyLimit);
  }, [dailyLimit]);

  const isOver = calories > dailyLimit;

  const handleSaveLimit = () => {
    void setDailyLimit(tempLimit);
    setIsEditing(false);
  };

  const safeLimit = Math.max(dailyLimit, 1);
  const widgetClass =
    "petal-widget relative flex min-h-28 w-full rounded-tr-[40px] rounded-bl-[40px] flex-col items-center justify-center overflow-hidden p-4 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 sm:min-h-30";

  return (
    <>
      <div className="relative z-50 mx-auto -mt-20 mb-1 grid w-full max-w-7xl grid-cols-1 gap-3 px-4 animate-in fade-in slide-in-from-top-4 duration-700 sm:-mt-16 sm:grid-cols-3 sm:px-6 lg:sticky lg:top-24 lg:-mt-24 lg:gap-6 lg:px-10">
        <div className={`${widgetClass} petal-widget--orange`}>
          <p className="mb-1 text-sm font-black uppercase text-gray-600 sm:text-base lg:text-[18px]">
            Счетчик калорий
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <div
              className={`rounded-lg px-4 py-1 font-black text-white shadow-sm transition-colors duration-500 sm:px-6 ${isOver ? "bg-red-500" : "bg-orange-500"}`}
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
                onKeyDown={(e) => e.key === "Enter" && handleSaveLimit()}
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
                <Settings
                  size={12}
                  className="text-gray-300 group-hover:text-orange-500 transition-all"
                />
              </div>
            )}
          </div>

          <div className="mt-3 h-1.5 w-36 overflow-hidden rounded-lg bg-white/70 shadow-inner">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{
                width: `${Math.min((calories / safeLimit) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        <Link href="/history" className={`${widgetClass} petal-widget--green`}>
          <p className="mb-1 text-sm font-black uppercase text-gray-600 sm:text-base lg:text-[18px]">
            История заказов
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-[#4CAF50] px-5 py-1 font-black text-white shadow-sm sm:px-6">
            <History size={14} />
            Открыть
          </div>
        </Link>

        <button
          onClick={() => setIsMacrosOpen(true)}
          className={`${widgetClass} petal-widget--blue`}
        >
          <p className="mb-1 text-sm font-black uppercase text-gray-600 sm:text-base lg:text-[18px]">
            Твой баланс КБЖУ
          </p>
          <div className="rounded-lg bg-blue-500 px-6 py-1 font-black text-white shadow-sm sm:px-8">
            Смотреть
          </div>
        </button>
      </div>

      <MacrosModal
        isOpen={isMacrosOpen}
        onClose={() => setIsMacrosOpen(false)}
      />
    </>
  );
};
