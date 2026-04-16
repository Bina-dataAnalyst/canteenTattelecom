'use client'
import { useState } from 'react'
import { importMenuFromCSV } from '@/lib/actions/import-csv'

export const CsvUploader = () => {
  const [loading, setLoading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const reader = new FileReader()
    
    reader.onload = async (event) => {
      const text = event.target?.result as string
      try {
        const result = await importMenuFromCSV(text)
        if (result.success) {
          alert(`Успешно! Обновлено позиций: ${result.count}`)
          window.location.reload() // Перезагрузим, чтобы увидеть меню
        }
      } catch (err) {
        alert('Ошибка при чтении файла. Проверь заголовки в CSV!')
      } finally {
        setLoading(false)
      }
    }
    
    reader.readAsText(file, 'windows-1251');
  }

  return (
    <div className="p-8 border-2 border-dashed border-orange-200 rounded-[32px] bg-orange-50 text-center">
      <h3 className="text-lg font-bold text-orange-700 mb-2">Обновление меню</h3>
      <p className="text-sm text-orange-600/70 mb-4">Выберите файл .csv с актуальным меню на апрель</p>
      
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileUpload}
        disabled={loading}
        className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-orange-500 file:text-white
          hover:file:bg-orange-600
          cursor-pointer disabled:opacity-50"
      />
      {loading && <p className="mt-4 text-orange-500 animate-pulse font-bold">Загружаем данные в базу...</p>}
    </div>
  )
}