import { db } from '@/prisma/db'
import { type User } from '@prisma/client'

export const getUserByUsername = async (username: string): Promise<User | null> => {
  console.log(username)
  const user = await db.user.findUnique({
    where: { username }
  })

  return user
}
