import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Очистка базы (чтобы не было дублей и ошибок)
  await prisma.dish.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.canteen.deleteMany({})

  // 2. Создаем столовую
  const canteen = await prisma.canteen.create({
    data: {
      id: 'main-canteen',
      name: 'Основная столовая',
      address: 'ул. Центральная, 1',
    }
  })

  // 3. Создаем категории
  const catSoups = await prisma.category.create({ data: { name: 'Супы' } })
  const catMain = await prisma.category.create({ data: { name: 'Вторые блюда' } })
  const catSalads = await prisma.category.create({ data: { name: 'Салаты' } })

  // 4. Создаем 10 эталонных блюд
  const dishes = [
    {
      name: 'Борщ Украинский',
      composition: 'Свекла, капуста, картофель, говядина, лук, морковь, специи.',
      price: 150,
      calories: 220,
      proteins: 12, fats: 8, carbs: 25,
      weight: '300/30',
      note: '',
      categoryId: catSoups.id,
    },
    {
      name: 'Том Ям с курицей',
      composition: 'Бульон том-ям, кокосовое молоко, куриное филе, грибы, рис.',
      price: 250,
      calories: 310,
      proteins: 15, fats: 18, carbs: 35,
      weight: '350/50',
      note: 'Острое',
      categoryId: catSoups.id,
    },
    {
      name: 'Котлета По-Киевски',
      composition: 'Куриное филе, сливочное масло, панировка, специи.',
      price: 180,
      calories: 420,
      proteins: 22, fats: 28, carbs: 15,
      weight: '150г',
      note: '',
      categoryId: catMain.id,
    },
    {
      name: 'Плов со свининой',
      composition: 'Рис, свинина, морковь, лук, зира, барбарис.',
      price: 210,
      calories: 550,
      proteins: 18, fats: 32, carbs: 45,
      weight: '250г',
      note: 'содержит свинину 🐷',
      categoryId: catMain.id,
    },
    {
      name: 'Паста Карбонара',
      composition: 'Спагетти, бекон, сливки, сыр пармезан, желток.',
      price: 280,
      calories: 610,
      proteins: 20, fats: 35, carbs: 55,
      weight: '300г',
      note: '🐷',
      categoryId: catMain.id,
    },
    {
      name: 'Цезарь с курицей',
      composition: 'Салат айсберг, куриное филе, сухарики, соус цезарь, сыр.',
      price: 220,
      calories: 280,
      proteins: 18, fats: 12, carbs: 10,
      weight: '210г',
      note: '',
      categoryId: catSalads.id,
    },
    {
      name: 'Оливье',
      composition: 'Картофель, морковь, колбаса в/к, огурец, горошек, майонез.',
      price: 120,
      calories: 310,
      proteins: 8, fats: 22, carbs: 18,
      weight: '180г',
      note: 'содержит свинину 🐷',
      categoryId: catSalads.id,
    },
    {
      name: 'Гречка с грибами',
      composition: 'Крупа гречневая, шампиньоны, лук, масло растительное.',
      price: 90,
      calories: 180,
      proteins: 6, fats: 4, carbs: 32,
      weight: '200г',
      note: 'Веган 🌱',
      categoryId: catMain.id,
    },
    {
      name: 'Стейк из лосося',
      composition: 'Лосось на гриле, лимон, специи.',
      price: 450,
      calories: 320,
      proteins: 28, fats: 18, carbs: 0,
      weight: '120/30',
      note: 'ПП',
      categoryId: catMain.id,
    },
    {
      name: 'Винегрет',
      composition: 'Свекла, картофель, морковь, соленый огурец, масло.',
      price: 95,
      calories: 140,
      proteins: 2, fats: 8, carbs: 14,
      weight: '150г',
      note: '🌱',
      categoryId: catSalads.id,
    }
  ]

  for (const dish of dishes) {
    await prisma.dish.create({
      data: {
        ...dish,
        canteenId: canteen.id,
        isAvailable: true,
        stock: 10
      }
    })
  }

  console.log('Seed: База данных успешно наполнена 10 блюдами!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())