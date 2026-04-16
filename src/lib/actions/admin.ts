'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function toggleDishAvailability(id: string, currentState: boolean) {
  await prisma.dish.update({
    where: { id },
    data: { isAvailable: !currentState }
  })
  
  // Очищаем кэш главной страницы, чтобы пользователи сразу увидели изменения
  revalidatePath('/')
}