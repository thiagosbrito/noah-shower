'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { FaGift, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa'
import EditGiftForm from './EditGiftForm'

interface Gift {
  id: string
  name: string
  description: string
  status: 'available' | 'reserved'
}

export default function GiftList() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingGift, setEditingGift] = useState<Gift | null>(null)

  useEffect(() => {
    fetchGifts()
  }, [])

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGifts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGift = async (giftId: string) => {
    if (!confirm('Are you sure you want to delete this gift?')) return

    try {
      const { error } = await supabase
        .from('gifts')
        .delete()
        .eq('id', giftId)

      if (error) throw error
      setGifts(gifts.filter(gift => gift.id !== giftId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleGiftUpdated = () => {
    setEditingGift(null)
    fetchGifts()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
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
    <div className="space-y-4">
      {gifts.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No gifts added yet
        </div>
      ) : (
        <div className="grid gap-4">
          {gifts.map((gift) => (
            <div key={gift.id} className="bg-gray-800 rounded-lg p-4">
              {editingGift?.id === gift.id ? (
                <EditGiftForm
                  gift={gift}
                  onGiftUpdated={handleGiftUpdated}
                  onCancel={() => setEditingGift(null)}
                />
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaGift className="text-pink-500" />
                      <h3 className="text-lg font-medium text-gray-200">{gift.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingGift(gift)}
                        className="text-gray-400 hover:text-pink-500 transition-colors"
                        title="Edit gift"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteGift(gift.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete gift"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-400">{gift.description}</p>
                  <div className="flex items-center space-x-2">
                    {gift.status === 'reserved' ? (
                      <>
                        <FaCheck className="text-green-500" />
                        <span className="text-green-500">Reserved</span>
                      </>
                    ) : (
                      <>
                        <FaTimes className="text-gray-500" />
                        <span className="text-gray-500">Available</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 