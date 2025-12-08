'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const gapClasses = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1.5',
  }

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1)
    }
  }

  return (
    <div className={cn('flex items-center', gapClasses[size], className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < Math.floor(rating)
        const partial = index === Math.floor(rating) && rating % 1 !== 0
        const percentage = partial ? (rating % 1) * 100 : 0

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(index)}
            className={cn(
              'relative',
              interactive && 'cursor-pointer hover:scale-110 transition-transform'
            )}
          >
            {/* Empty Star */}
            <Star
              className={cn(sizeClasses[size], 'text-gray-300')}
            />
            
            {/* Filled Star */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: filled ? '100%' : partial ? `${percentage}%` : '0%' }}
            >
              <Star
                className={cn(sizeClasses[size], 'text-warning-500 fill-warning-500')}
              />
            </div>
          </button>
        )
      })}
      
      {showValue && (
        <span className={cn(
          'font-medium text-gray-700 ml-1',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base'
        )}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}







