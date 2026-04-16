'use client'

import { CsvUploader } from '@/components/shared/CsvUploader'
import { ArrowLeft, FileText, Settings } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Кнопка возврата на главную */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Вернуться в меню
        </Link>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
              <Settings className="text-orange-500" size={36} />
              Админ-панель
            </h1>
            <p className="text-gray-500 mt-2">Управление ассортиментом столовой</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Секция загрузки файла (основная) */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                  <FileText size={24} />
                </div>
                <h2 className="text-xl font-bold">Импорт меню</h2>
              </div>
              
              <CsvUploader />
              
              <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <h4 className="text-sm font-bold text-blue-800 mb-2">Требования к CSV:</h4>
                <ul className="text-xs text-blue-700 space-y-1 opacity-80">
                  <li>• Кодировка файла: <strong>UTF-8</strong></li>
                  <li>• Разделитель: <strong>Запятая (,)</strong></li>
                  <li>• Заголовки: <strong>Раздел, Наименование, СОСТАВ, Белки, Жиры, Углеводы, Ккал, Вес, Цена, Пометки</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Секция быстрой статистики (заглушка на будущее) */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Статус базы</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Всего блюд</span>
                  <span className="font-bold text-orange-600">Обновится после загрузки</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-full" />
                </div>
              </div>
            </div>
            
            <div className="bg-green-600 rounded-[32px] p-6 text-white shadow-lg shadow-green-100">
              <h3 className="font-bold mb-2">Совет</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                Если в файле есть новые категории, они будут созданы автоматически.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}