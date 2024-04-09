import { isFollowingUser } from '@/lib/follow-service'
import { getUserByUsername } from '@/lib/user-service'
import { notFound } from 'next/navigation'
import { Actions } from './_components/actions'

interface UserPageProps {
  params: {
    username: string
  }
}

export default async function UserPage({ params: { username } }: UserPageProps) {
  const user = await getUserByUsername(username)
  if (!user) notFound()

  const isFollowing = await isFollowingUser(user.id)

  return (
    <div className='flex flex-col gap-y-4'>
      <p>User: {user.username}</p>
      <p>is following: {`${isFollowing}`}</p>
      <Actions isFollowing={isFollowing} userId={user.id} />
    </div>
  )
}
