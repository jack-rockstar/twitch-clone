'use client'

import { onFollow, onUnFollow } from '@/actions/follow'
import { Button } from '@/components/ui/button'
import { useTransition } from 'react'
import { toast } from 'sonner'

interface ActionsProps {
  isFollowing: boolean
  userId: string
}

export const Actions = ({ isFollowing, userId }: ActionsProps) => {
  const [isPending, startTransition] = useTransition()

  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) => toast.success(`You are now following ${data.following.username}`))
        .catch(() => toast.error('Something went wrong'))
    })
  }

  const handleUnFollow = () => {
    startTransition(() => {
      onUnFollow(userId)
        .then((data) => toast.success(`You have unfollowed ${data.following.username}`))
        .catch(() => toast.error('Something went wrong'))
    })
  }

  const onClick = () => isFollowing ? handleUnFollow() : handleFollow()

  return (
    <Button
      disabled={isPending}
      onClick={onClick}
      variant='primary'
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
