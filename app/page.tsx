'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PageContent from './components/PageContent'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const [guestId, setGuestId] = useState<string | null>(null)

  useEffect(() => {
    // Check localStorage for guest data
    const storedGuest = localStorage.getItem('noah-shower-guest')
    if (storedGuest) {
      const guest = JSON.parse(storedGuest)
      setGuestId(guest.id)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
      </div>
    )
  }

  return <PageContent guestId={guestId} />
}

