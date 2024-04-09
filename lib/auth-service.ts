import { db } from '@/prisma/db'
import { currentUser } from '@clerk/nextjs'

export const getCurrentUser = async () => {
  const self = await currentUser()

  if (!self?.id) throw new Error('Unauthorized')

  const user = await db.user.findUnique({ where: { externalUserId: self.id } })

  if (!user) throw new Error('Not Found')

  return user
}
