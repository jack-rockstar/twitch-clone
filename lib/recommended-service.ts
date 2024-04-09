import { db } from '@/prisma/db'
import { getCurrentUser } from './auth-service'

export const getRecommended = async () => {
  let userId
  try {
    const self = await getCurrentUser()
    userId = self.id
  } catch (error) {
    userId = null
  }

  if (!userId) {
    return await db.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
  return await db.user.findMany({
    where: {
      NOT: {
        id: userId
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}
