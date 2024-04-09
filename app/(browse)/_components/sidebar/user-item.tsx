import { Button } from '@/components/ui/button'
import LiveBadge from '@/components/ui/live-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/use-sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserAvatar from './user-avatar'

interface UserItemProps {
  username: string
  imageUrl: string
  isLive?: boolean
}
export default function UserItem({ username, imageUrl, isLive }: UserItemProps) {
  const pathname = usePathname()
  const { collapsed } = useSidebar((state) => state)
  const href = `/${username}`
  const isActive = pathname === href

  return (
    <Button
      asChild
      variant='ghost'
      className={cn(
        'w-full h-12',
        collapsed ? 'justify-center' : 'justify-start',
        isActive && 'bg-accent'
      )}
    >
      <Link href={href}>
        <div className={cn('flex items-center w-full gap-x-4', collapsed && 'justify-center')}>
          <UserAvatar
            isLive={isLive}
            imageUrl={imageUrl}
            username={username}
          />
          {
            !collapsed && (
              <p className='truncate'>
                {username}
              </p>
            )
          }
          {
            !collapsed && isLive && (
              <LiveBadge className='ml-auto' />
            )
          }
        </div>
      </Link>
    </Button>
  )
}

export const UserItemSkeleton = () => {
  return (
    <li className='flex items-center gap-x-4 px-3 py-2'>
      <Skeleton className='min-h-[32px] min-w-[32px] rounded-full' />
      <div className='flex-1'>
        <Skeleton className='h-6' />
      </div>
    </li>
  )
}
