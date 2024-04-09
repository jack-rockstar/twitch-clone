'use client'
import { useSidebar } from '@/store/use-sidebar'
import { type User } from '@prisma/client'
import UserItem, { UserItemSkeleton } from './user-item'

interface RecommendedProps {
  data: User[]
}

export default function Recommended({ data }: RecommendedProps) {
  const { collapsed } = useSidebar((state) => state)
  const showLabel = !collapsed && data.length > 0

  return (
    <div>
      {
        showLabel && (
          <section className='pl-6 mb-4'>
            <p className='text-sm text-muted-foreground'>Recommended</p>
          </section>
        )
      }
      <ul className='space-y-2 px-2'>
        {
          data.map((user) => (
            <UserItem
              key={user.id}
              imageUrl={user.imageUrl}
              username={user.username}
              isLive={false}
            />
          ))
        }
      </ul>
    </div>
  )
}

export const RecommendedSkeleton = () => {
  return (
    <ul className='px-2 '>
      {
        [...Array(3)].map((_, i) => (
          <UserItemSkeleton key={i} />
        ))
      }
    </ul>
  )
}
