'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-border border-t-blue-500" />
    </div>
  )
}

export function LoadingDots({ className = '' }: { className?: string }) {
  return (
    <div className={`loading-dots ${className}`}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`skeleton rounded ${className}`} />
  )
}