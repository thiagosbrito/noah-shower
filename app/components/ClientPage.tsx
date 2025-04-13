'use client'

import { useState, useEffect } from 'react'
import PageContent from './PageContent'

const GUEST_STORAGE_KEY = 'noah_shower_guest'

function ClientPage() {
  const [guestId, setGuestId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY)
    if (savedGuest) {
      const parsedGuest = JSON.parse(savedGuest)
      setGuestId(parsedGuest.id)
    }
  }, [])

  return <PageContent guestId={guestId} />
}

export default ClientPage 