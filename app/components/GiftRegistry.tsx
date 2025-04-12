'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { FaGift, FaHeart } from 'react-icons/fa'

interface Gift {
  id: string
  name: string
  description: string
  reserved: boolean
  image_url?: string
  reserved_by?: string | null
}

interface GiftRegistryProps {
  guestId?: string
}

export default function GiftRegistry({ guestId }: GiftRegistryProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gifts, setGifts] = useState<Gift[]>([])

  useEffect(() => {
    fetchGifts()
  }, [])

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('name')

      if (error) throw error
      setGifts(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReserveGift = async (giftId: string) => {
    if (!guestId) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('gifts')
        .update({
          reserved: true,
          reserved_by: guestId
        })
        .eq('id', giftId)

      if (error) throw error

      // Refresh gifts list
      await fetchGifts()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUnreserveGift = async (giftId: string) => {
    if (!guestId) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('gifts')
        .update({
          reserved: false,
          reserved_by: null
        })
        .eq('id', giftId)
        .eq('reserved_by', guestId) // Only allow unreserving if the guest reserved it

      if (error) throw error

      // Refresh gifts list
      await fetchGifts()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <FaGift className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-red-600 mb-2">Oops!</h3>
        <p className="text-gray-600">
          We had trouble loading the gift registry. Please try again later.
        </p>
      </div>
    )
  }

  if (gifts.length === 0) {
    return (
      <div className="text-center py-12 bg-orange-50 rounded-lg">
        <div className="text-orange-600 mb-4">
          <FaGift className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-orange-800 mb-2 font-sour-gummy">
          Gift Registry Coming Soon!
        </h3>
        <p className="text-orange-600 font-roboto">
          We're still preparing our gift wishlist. Please check back later!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 p-2 rounded-lg">
          <FaGift className="h-6 w-6 text-orange-700" />
        </div>
        <h2 className="text-3xl font-bold text-orange-800 font-sour-gummy">Gift Registry</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifts.map((gift) => {
          const isReservedByMe = gift.reserved_by === guestId
          return (
            <div 
              key={gift.id} 
              className={`bg-white/90 rounded-lg shadow-md overflow-hidden border-2 ${
                gift.reserved 
                  ? isReservedByMe 
                    ? 'border-orange-400' 
                    : 'border-gray-200'
                  : 'border-orange-200'
              }`}
            >
              {gift.image_url && (
                <img 
                  src={gift.image_url} 
                  alt={gift.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-orange-800 mb-2">{gift.name}</h3>
                <p className="text-orange-700 mb-4">{gift.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-2 ${
                    gift.reserved 
                      ? isReservedByMe 
                        ? 'text-orange-700' 
                        : 'text-gray-500'
                      : 'text-orange-700'
                  }`}>
                    <FaHeart className="h-4 w-4" />
                    {isReservedByMe 
                      ? 'Reserved by you'
                      : gift.reserved 
                        ? 'Already Reserved' 
                        : 'Available'
                    }
                  </span>
                  {guestId && (
                    isReservedByMe ? (
                      <button
                        onClick={() => handleUnreserveGift(gift.id)}
                        className="text-orange-700 underline hover:text-orange-800 focus:outline-none"
                      >
                        Unreserve
                      </button>
                    ) : !gift.reserved && (
                      <button
                        onClick={() => handleReserveGift(gift.id)}
                        className="bg-orange-700 text-white px-4 py-2 rounded-md hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        Reserve
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 