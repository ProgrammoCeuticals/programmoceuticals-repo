import { cn } from '../lib/utils'

export function SkeletonLine({
  width,
  className,
}: {
  width?: string
  className?: string
}) {
  return (
    <div
      className={cn('h-4 animate-pulse rounded bg-slate-200', width ?? 'w-full', className)}
    />
  )
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded bg-slate-200', className)} />
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded bg-slate-200', className)} />
}
