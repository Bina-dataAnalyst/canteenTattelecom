const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Начинаем заполнение базы...');

  // 1. Очистка (опционально, чтобы не дублировать)
  await prisma.dish.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.canteen.deleteMany({});

  // 2. Создаем столовую
  const canteen = await prisma.canteen.create({
    data: {
      id: 'c-1',
      name: 'Наша Столовая №1',
      address: 'Главный офис',
    },
  });

  // 3. Создаем категории
  const cat1 = await prisma.category.create({ data: { name: 'Вторые блюда' } });
  const cat2 = await prisma.category.create({ data: { name: 'Супы' } });

  // 4. Создаем блюда
  await prisma.dish.createMany({
    data: [
      {
        name: 'Запеченное филе бедра',
        price: 105,
        calories: 170,
        stock: 3,
        categoryId: cat1.id,
        canteenId: canteen.id,
      },
      {
        name: 'Котлета рыбная',
        price: 108,
        calories: 170,
        stock: 10,
        categoryId: cat1.id,
        canteenId: canteen.id,
      },
      {
        name: 'Том ям с курицей и фунчозой',
        price: 145,
        calories: 150,
        stock: 12,
        categoryId: cat2.id,
        canteenId: canteen.id,
      },
      {
        name: 'Овощной суп',
        price: 108,
        calories: 170,
        stock: 5,
        categoryId: cat2.id,
        canteenId: canteen.id,
      },
    ],
  });

  console.log('Готово! База данных наполнена.');
}

main()
  .catch((e) => {
    console.error('Ошибка:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();ы
  });