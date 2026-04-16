'use server'
import { prisma } from '@/lib/prisma'
import Papa from 'papaparse'
import { revalidatePath } from 'next/cache'

export async function importMenuFromCSV(csvString: string) {
  const { data } = Papa.parse(csvString, { header: true, skipEmptyLines: true });

  for (const row of data as any[]) {
    // Сопоставляем твои заголовки из файла
    const name = row["Наименование"];
    if (!name) continue;

    const categoryName = row["Раздел"] || "Разное"; // Твой "Раздел" -> наша Категория

    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName }
    });

    // Очистка числовых данных
    const parseNum = (val: string) => parseFloat(val?.replace(',', '.') || '0');

    await prisma.dish.upsert({
        where: { name: name },
        update: {
      composition: row["СОСТАВ"],
          proteins: parseNum(row["Белки"]),
          fats: parseNum(row["Жиры"]),
          carbs: parseNum(row["Углеводы"]),
          calories: parseInt(row["Ккал"] || '0'),
          weight: row["Вес"],
          price: parseNum(row["Цена"]),
          note: row["Пометки"],
          categoryId: category.id,
          isAvailable: true
        },
        create: {
          name: name,
      composition: row["СОСТАВ"],
          proteins: parseNum(row["Белки"]),
          fats: parseNum(row["Жиры"]),
          carbs: parseNum(row["Углеводы"]),
          calories: parseInt(row["Ккал"] || '0'),
          weight: row["Вес"],
          price: parseNum(row["Цена"]),
      note: row["Пометки"],
          categoryId: category.id,
          canteenId: "main-canteen"
        }
      });
    }

  revalidatePath('/');
  return { success: true, count: data.length };
}