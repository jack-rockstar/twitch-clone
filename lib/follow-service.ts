import { db } from '@/prisma/db'
import { getCurrentUser } from './auth-service'

export const getFollowUsers = async () => {
  try {
    const currentUser = await getCurrentUser()

    return await db.follow.findMany({
      where: {
        followerId: currentUser.id
      },
      include: {
        following: true
      }
    })
  } catch (error) {
    return []
  }
}

export const isFollowingUser = async (id: string) => {
  try {
    const self = await getCurrentUser()
    const otherUser = await db.user.findUnique({
      where: { id }
    })

    if (!otherUser) throw new Error('User not found')

    if (otherUser.id === self.id) return true

    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: self.id,
        followingId: otherUser.id
      }
    })

    return !!existingFollow
  } catch (error) {
    console.log(error)
    return false
  }
}

export const followUser = async (id: string) => {
  const currentUser = await getCurrentUser()

  const otherUser = await db.user.findUnique({
    where: { id }
  })

  if (!otherUser) throw new Error('User not found')

  if (otherUser.id === currentUser.id) throw new Error('Cannot follow yourself')

  const existingFollow = await db.follow.findFirst({
    where: {
      followerId: currentUser.id,
      followingId: otherUser.id
    }
  })

  if (existingFollow) throw new Error('Already following')

  const follow = await db.follow.create({
    data: {
      followerId: currentUser.id,
      followingId: otherUser.id
    },
    include: {
      following: true,
      follower: true
    }
  })

  return follow
}

export const unFollowUser = async (id: string) => {
  const currentUser = await getCurrentUser()

  const otherUser = await db.user.findUnique({
    where: { id }
  })

  if (!otherUser) throw new Error('User not found')

  if (otherUser.id === currentUser.id) throw new Error('Cannot follow yourself')

  const existingFollow = await db.follow.findFirst({
    where: {
      followerId: currentUser.id,
      followingId: otherUser.id
    }
  })

  if (!existingFollow) throw new Error('Not following')

  const follow = await db.follow.delete({
    where: {
      id: existingFollow.id
    },
    include: {
      following: true
    }
  })

  return follow
}
