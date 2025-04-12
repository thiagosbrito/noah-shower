'use client'

import { useState, useEffect } from 'react'
import PageContent from './PageContent'

interface ClientPageProps {
  initialSearchParams: { [key: string]: string | string[] | undefined }
}

const ClientPage = ({ initialSearchParams }: ClientPageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [guestId, setGuestId] = useState<string | null>(null)

  useEffect(() => {
    // Check localStorage for guest data
    const storedGuest = localStorage.getItem('noah-shower-guest')
    if (storedGuest) {
      const guest = JSON.parse(storedGuest)
      setGuestId(guest.id)
    }
    // Check URL params for guest ID
    const urlGuestId = initialSearchParams.guest
    if (urlGuestId && typeof urlGuestId === 'string') {
      setGuestId(urlGuestId)
    }
    setIsLoading(false)
  }, [initialSearchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
      </div>
    )
  }

  return <PageContent guestId={guestId} />
}

export default ClientPage 