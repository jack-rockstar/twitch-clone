'use client'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/use-sidebar'
import { useIsClient } from 'usehooks-ts'
import { SidebarSkeleton } from '.'
import { RecommendedSkeleton } from './recommended'

interface WrapperProps {
  children: React.ReactNode
}

export default function Wrapper({ children }: WrapperProps) {
  const { collapsed } = useSidebar((state) => state)
  const isClient = useIsClient()

  if (!isClient) {
    return (
      <aside
        className='fixed left-0 flex flex-col transition-all w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50'
      >
        <SidebarSkeleton />
        <RecommendedSkeleton />
      </aside>
    )
  }

  return (
    <aside
      className={cn(
        'fixed left-0 flex flex-col transition-all w-60 h-full bg-background border-r border-[#2D2E35] z-50',
        collapsed && 'w-[70px]'
      )}
    >
      {children}
    </aside>
  )
}
