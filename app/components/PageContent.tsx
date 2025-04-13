'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaGift, FaCalendarAlt, FaMapMarkerAlt, FaPaw } from 'react-icons/fa'
import RSVPForm from './RSVPForm'
import GiftRegistry from './GiftRegistry'

interface PageContentProps {
  guestId: string | null
}

export default function PageContent({ guestId: urlGuestId }: PageContentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [guestId, setGuestId] = useState<string | null>(urlGuestId)

  useEffect(() => {
    // Check localStorage for guest data if no URL guest ID
    if (!urlGuestId) {
      const storedGuest = localStorage.getItem('noah-shower-guest')
      if (storedGuest) {
        const guest = JSON.parse(storedGuest)
        setGuestId(guest.id)
      }
    }
    setIsLoading(false)
  }, [urlGuestId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section with Event Details and RSVP */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-orange-200 to-orange-100"></div>
        
        {/* Jungle Background */}
        <div className="absolute inset-0 bg-[url('/jungle-frame.svg')] bg-cover no-repeat opacity-20"></div>

        {/* Content */}
        <div className="relative min-h-screen container mx-auto px-4 py-16 flex flex-col">
          {/* Welcome Text */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <FaPaw className="text-orange-700 text-6xl animate-bounce" />
            </div>
            <div className="flex flex-col gap-y-2">
              <h1 className="text-6xl md:text-7xl font-bold text-orange-800 mb-4 font-hanalei arch-text">
                <span>W</span>
                <span>e</span>
                <span>l</span>
                <span>c</span>
                <span>o</span>
                <span>m</span>
                <span>e</span>
                <span>!</span>
              </h1>
              <h2 className="text-5xl md:text-6xl font-bold text-orange-800 mb-4 font-sour-gummy">
                to Noah's Wild Adventure
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-orange-700 mb-8 max-w-2xl mx-auto font-roboto">
              We're going on a jungle adventure to celebrate our little explorer on the way! 🌿🦁🐒
            </p>
          </div>

          {/* Event Details and RSVP Grid */}
          <div className="grid md:grid-cols-3 gap-8 flex-grow">
            {/* Event Details Card */}
            <div className="bg-white/90 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 h-fit">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <FaCalendarAlt className="text-orange-700 text-2xl" />
                </div>
                <h2 className="text-3xl font-bold text-orange-800 font-sour-gummy">Event Details</h2>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-6 group">
                  <div className="bg-orange-50 p-4 rounded-xl group-hover:bg-orange-100 transition-colors duration-300">
                    <FaCalendarAlt className="text-orange-700 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-orange-800 mb-2 font-sour-gummy">Date & Time</h3>
                    <div className="space-y-1">
                      <p className="text-orange-700 font-roboto flex items-center">
                        <span className="w-32">Date</span>
                        <span className="font-medium">Saturday, May 24th, 2025</span>
                      </p>
                      <p className="text-orange-700 font-roboto flex items-center">
                        <span className="w-32">Time</span>
                        <span className="font-medium">Starting at 15:00</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="bg-orange-50 p-4 rounded-xl group-hover:bg-orange-100 transition-colors duration-300">
                    <FaMapMarkerAlt className="text-orange-700 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-orange-800 mb-2 font-sour-gummy">Location</h3>
                    <div className="space-y-1">
                      <p className="text-orange-700 font-roboto flex items-center">
                        <span className="w-32">Address</span>
                        <span className="font-medium">Gromadzka 63/5</span>
                      </p>
                      <p className="text-orange-700 font-roboto flex items-center">
                        <span className="w-32">City</span>
                        <span className="font-medium">Krakow</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RSVP Form Card */}
            <div className="md:col-span-2">
              <RSVPForm guestId={guestId || undefined} />
            </div>
          </div>
        </div>
      </section>

      {/* Gifts Section */}
      {guestId && (
        <section className="py-16 bg-gradient-to-b from-green-50 to-sky-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-orange-800 mb-4 font-sour-gummy">Gift Registry</h2>
              <p className="text-orange-700 max-w-2xl mx-auto font-roboto">
                If you'd like to bring a gift, we've put together a wishlist of items that would be helpful. Your presence is the most important gift of all, but if you choose to bring something, we'll be delighted!
              </p>
            </div>
            <GiftRegistry guestId={guestId} />
          </div>
        </section>
      )}
    </main>
  )
} 