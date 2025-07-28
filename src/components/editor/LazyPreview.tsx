'use client'

import React, { Suspense, lazy } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const LivePreview = lazy(() => import('./LivePreview'))

const LazyPreview = React.memo(function LazyPreview() {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-preview-bg border-l border-border">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="md" />
            <p className="text-sm text-text-secondary">Loading preview...</p>
          </div>
        </div>
      }
    >
      <LivePreview />
    </Suspense>
  )
})

export default LazyPreview