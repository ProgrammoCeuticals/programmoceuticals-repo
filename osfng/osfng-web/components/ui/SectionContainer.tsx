import { cn } from '@/lib/utils'

interface Props {
  children:  React.ReactNode
  className?: string
  width?:    'wide' | 'content' | 'narrow'
  py?:       boolean
  as?:       'section' | 'div' | 'article'
  bg?:       string
  id?:       string
}

export default function SectionContainer({
  children,
  className,
  width = 'content',
  py = true,
  as: Tag = 'section',
  bg,
  id,
}: Props) {
  return (
    <Tag
      id={id}
      className={cn('w-full', py && 'py-[clamp(56px,7vw,112px)]', bg, className)}
    >
      <div
        className={cn(
          'mx-auto px-[clamp(20px,5vw,80px)]',
          width === 'wide'    && 'max-w-[1380px]',
          width === 'content' && 'max-w-[1160px]',
          width === 'narrow'  && 'max-w-[760px]',
        )}
      >
        {children}
      </div>
    </Tag>
  )
}
