'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { FaTrash, FaSync, FaGift } from 'react-icons/fa'

interface Gift {
  id: string
  name: string
  description: string
  created_at: string
}

interface GiftReservation {
  gift_id: string
  guest_id: string
}

export default function GiftList() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [reservations, setReservations] = useState<GiftReservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('GiftList component mounted')
    fetchGifts()

    // Set up polling every 30 seconds
    const interval = setInterval(fetchGifts, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const fetchGifts = async () => {
    console.log('Attempting to fetch gifts...')
    setError(null)
    
    try {
      const { data: gifts, error: giftsError } = await supabase
        .from('gifts')
        .select('*')
        .order('created_at', { ascending: false })

      if (giftsError) {
        console.error('Supabase error:', giftsError)
        throw giftsError
      }

      const { data: reservations, error: reservationsError } = await supabase
        .from('gift_reservations')
        .select('*')

      if (reservationsError) {
        console.error('Supabase error:', reservationsError)
        throw reservationsError
      }

      if (!gifts) {
        console.log('No data received from Supabase')
        setGifts([])
        return
      }

      console.log('Setting gifts with data:', gifts)
      setGifts(gifts)
      setReservations(reservations || [])
    } catch (err) {
      console.error('Error in fetchGifts:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while fetching gifts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gifts')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Refresh the list after deletion
      fetchGifts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-300">
        <FaSync className="animate-spin text-2xl mx-auto mb-2" />
        Loading gifts...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <button 
          onClick={fetchGifts}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
        >
          <FaSync className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Gift List</span>
        </button>
      </div>
      <div className="bg-gray-700 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-600">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gift</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {gifts.map((gift) => (
              <tr key={gift.id} className="hover:bg-gray-600/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaGift className="text-pink-400 mr-2" />
                    <span className="text-gray-200">{gift.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-200">
                  <div className="max-w-md">{gift.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    reservations.some(r => r.gift_id === gift.id)
                      ? 'bg-pink-900/50 text-pink-200 border border-pink-500'
                      : 'bg-green-900/50 text-green-200 border border-green-500'
                  }`}>
                    {reservations.some(r => r.gift_id === gift.id) ? 'reserved' : 'available'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(gift.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Delete Gift"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 