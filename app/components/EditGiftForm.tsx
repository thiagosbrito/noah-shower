'use client'

import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { FaGift, FaFileAlt } from 'react-icons/fa'

interface Gift {
  id: string
  name: string
  description: string
  status: 'available' | 'reserved'
}

interface EditGiftFormProps {
  gift: Gift
  onGiftUpdated: () => void
  onCancel: () => void
}

export default function EditGiftForm({ gift, onGiftUpdated, onCancel }: EditGiftFormProps) {
  const [name, setName] = useState(gift.name)
  const [description, setDescription] = useState(gift.description)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('gifts')
        .update({ 
          name, 
          description
        })
        .eq('id', gift.id)

      if (error) throw error

      onGiftUpdated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      <div>
        <label className="block text-gray-200 mb-2 font-medium">Gift Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaGift className="text-gray-400" />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-pink-500 text-gray-200 placeholder-gray-400"
            required
            placeholder="Enter gift name"
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-200 mb-2 font-medium">Description</label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <FaFileAlt className="text-gray-400" />
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-pink-500 text-gray-200 placeholder-gray-400 min-h-[100px]"
            required
            placeholder="Enter gift description"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  )
} 