'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Guest } from '../types/supabase'
import { FaUser, FaUserFriends, FaCheck, FaTimes } from 'react-icons/fa'

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGuests()
  }, [])

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGuests(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: Guest['status']) => {
    switch (status) {
      case 'attending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheck className="mr-1" />
            Attending
          </span>
        )
      case 'not_attending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimes className="mr-1" />
            Not Attending
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading guests</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Guest List</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {guests.length} {guests.length === 1 ? 'guest' : 'guests'} registered
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {guests.map((guest) => (
            <li key={guest.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaUser className="h-8 w-8 text-amber-500" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{guest.name}</h4>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FaUserFriends className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{guest.companions} {guest.companions === 1 ? 'companion' : 'companions'}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {getStatusBadge(guest.status)}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <span>Registered on {new Date(guest.created_at).toLocaleDateString()}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 