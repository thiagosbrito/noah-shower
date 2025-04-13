'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { FaGift, FaSpinner } from 'react-icons/fa'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import type { TranslationKey } from '../contexts/LanguageContext'

interface Gift {
  id: string
  name: string
  description: string
  status: 'available' | 'reserved'
  created_at: string
  updated_at: string
  image_url?: string
}

interface GiftReservation {
  gift_id: string
  guest_id: string
}

interface GiftRegistryProps {
  guestId?: string
}

const RESERVED_GIFT_STORAGE_KEY = 'noah_shower_reserved_gift'
const ITEMS_PER_PAGE = 6

export default function GiftRegistry({ guestId }: GiftRegistryProps) {
  const { t, translateGift } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gifts, setGifts] = useState<Gift[]>([])
  const [reservations, setReservations] = useState<GiftReservation[]>([])
  const [visibleGifts, setVisibleGifts] = useState<Gift[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    fetchGifts()
  }, [])

  useEffect(() => {
    if (gifts.length > 0) {
      setVisibleGifts(gifts.slice(0, ITEMS_PER_PAGE))
      setHasMore(gifts.length > ITEMS_PER_PAGE)
    }
  }, [gifts])

  const fetchGifts = async () => {
    try {
      // Check if user has RSVPed
      const guestData = localStorage.getItem('noah_shower_guest')
      if (!guestData) {
        setError('Please RSVP first to view the gift registry')
        setLoading(false)
        return
      }

      const guest = JSON.parse(guestData)
      if (guest.status !== 'attending') {
        setError('Only attending guests can view the gift registry')
        setLoading(false)
        return
      }

      // Check if user has a reserved gift
      const reservedGiftId = localStorage.getItem(RESERVED_GIFT_STORAGE_KEY)

      if (reservedGiftId) {
        // Get only the reserved gift
        const { data: gift, error: giftError } = await supabase
          .from('gifts')
          .select('*')
          .eq('id', reservedGiftId)
          .single()

        if (giftError) throw giftError
        setGifts(gift ? [gift] : [])
      } else {
        // Get all available gifts
        const { data: gifts, error: giftsError } = await supabase
          .from('gifts')
          .select('*')
          .order('name')

        if (giftsError) throw giftsError

        // Get all reservations
        const { data: reservations, error: reservationsError } = await supabase
          .from('gift_reservations')
          .select('*')

        if (reservationsError) throw reservationsError
        setReservations(reservations || [])

        setGifts(gifts || [])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReserveGift = async (giftId: string) => {
    const guestData = localStorage.getItem('noah_shower_guest')
    if (!guestData) {
      setError('Please RSVP first to reserve a gift')
      return
    }

    const guest = JSON.parse(guestData)
    if (guest.status !== 'attending') {
      setError('Only attending guests can reserve gifts')
      return
    }

    try {
      // Check if gift is already reserved
      const { data: existingReservation, error: checkError } = await supabase
        .from('gift_reservations')
        .select('guest_id')
        .eq('gift_id', giftId)
        .maybeSingle()

      if (checkError) throw checkError
      if (existingReservation) {
        setError('This gift has already been reserved by someone else.')
        return
      }

      // Create reservation
      const { error } = await supabase
        .from('gift_reservations')
        .insert([{ gift_id: giftId, guest_id: guest.id }])

      if (error) throw error

      // Save to localStorage and refresh
      localStorage.setItem(RESERVED_GIFT_STORAGE_KEY, giftId)
      await fetchGifts()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleUnreserveGift = async (giftId: string) => {
    const guestData = localStorage.getItem('noah_shower_guest')
    if (!guestData) {
      setError('Please RSVP first to unreserve a gift')
      return
    }

    const guest = JSON.parse(guestData)

    try {
      const { error } = await supabase
        .from('gift_reservations')
        .delete()
        .eq('gift_id', giftId)
        .eq('guest_id', guest.id)

      if (error) throw error

      localStorage.removeItem(RESERVED_GIFT_STORAGE_KEY)
      await fetchGifts()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const loadMore = () => {
    if (loadingMore) return

    setLoadingMore(true)
    setTimeout(() => {
      const currentLength = visibleGifts.length
      const nextGifts = gifts.slice(currentLength, currentLength + ITEMS_PER_PAGE)
      setVisibleGifts([...visibleGifts, ...nextGifts])
      setHasMore(currentLength + ITEMS_PER_PAGE < gifts.length)
      setLoadingMore(false)
    }, 500)
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
        <p className="text-gray-600">{error}</p>
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
          {t('gifts.comingSoon')}
        </h3>
        <p className="text-orange-600 font-roboto">
          {t('gifts.checkBack')}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white/90 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-orange-100 hover:border-orange-200 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-orange-100 p-3 rounded-xl">
          <FaGift className="text-orange-700 text-2xl" />
        </div>
        <h2 className="text-3xl font-bold text-orange-800 font-sour-gummy">{t('gifts.title')}</h2>
      </div>

      <p className="text-orange-700 mb-8 font-roboto">{t('gifts.subtitle')}</p>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
        </div>
      ) : gifts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-orange-700 font-roboto">{t('gifts.comingSoon')}</p>
          <p className="text-orange-600 mt-2 font-roboto">{t('gifts.checkBack')}</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleGifts.map((gift) => {
              const isReservedByCurrentUser = reservations.some(
                (reservation) => reservation.gift_id === gift.id
              );
              const isReservedBySomeoneElse = gift.status === 'reserved' && !isReservedByCurrentUser;

              return (
                <div
                  key={gift.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  {gift.image_url && (
                    <img 
                      src={gift.image_url} 
                      alt={gift.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4 flex flex-col justify-between h-full">
                    <h3 className="text-lg font-semibold text-orange-600 mb-2 font-sour-gummy">
                      {translateGift(gift.name)}
                    </h3>
                    <p className="text-orange-800 mb-4">{translateGift(gift.description)}</p>
                    
                    {isReservedByCurrentUser ? (
                      <div className="flex flex-col justify-center gap-y-2">
                        <span className="text-orange-600 w-full font-sour-gummy font-medium">{t('gifts.reservedByYou')}</span>
                        <span className="text-orange-300 text-sm">{t('gifts.changedMind')}</span>
                        <button
                          onClick={() => handleUnreserveGift(gift.id)}
                          className="text-white w-fit self-end text-sm cursor-pointer hover:text-red-700 font-medium bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300"
                        >
                          {t('gifts.unreserve')}
                        </button>
                      </div>
                    ) : isReservedBySomeoneElse ? (
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-orange-600 font-medium">{t('gifts.reservedBySomeone')}</span>
                        <button
                          disabled
                          className="bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
                        >
                          {t('gifts.reserved')}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-orange-600 font-medium">{t('gifts.available')}</span>
                        <button
                          onClick={() => handleReserveGift(gift.id)}
                          className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors duration-300"
                        >
                          {t('gifts.reserve')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-orange-700 text-white px-6 py-3 rounded-lg hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 flex items-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 