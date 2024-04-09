'use server'

import { followUser, unFollowUser } from '@/lib/follow-service'
import { revalidatePath } from 'next/cache'

export const onFollow = async (id: string) => {
  try {
    const followedUser = await followUser(id)

    revalidatePath('/')

    if (followedUser) revalidatePath(`/${followedUser.following.username}`)

    return followedUser
  } catch (error) {
    throw new Error('Internal error')
  }
}
export const onUnFollow = async (id: string) => {
  try {
    const unFollow = await unFollowUser(id)

    revalidatePath('/')
    if (unFollow) revalidatePath(`/${unFollow.following.username}`)

    return unFollow
  } catch (error) {
    throw new Error('Internal Error')
  }
}
