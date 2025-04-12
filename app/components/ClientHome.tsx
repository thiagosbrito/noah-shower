'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PageContent from './PageContent'

function ClientContent() {
  const searchParams = useSearchParams()
  const guestId = searchParams.get('guest')

  return <PageContent guestId={guestId} />
}

export default function ClientHome() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
        </div>
      }
    >
      <ClientContent />
    </Suspense>
  )
} 