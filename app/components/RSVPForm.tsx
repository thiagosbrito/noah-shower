'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Guest } from '../types/supabase'
import { FaUser, FaCheck, FaPaw, FaUserFriends } from 'react-icons/fa'
import GiftRegistry from './GiftRegistry'

interface RSVPFormProps {
  guestId?: string
}

const GUEST_STORAGE_KEY = 'noah_shower_guest'

export default function RSVPForm({ guestId }: RSVPFormProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [guest, setGuest] = useState<Guest | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    companions: 0,
    status: 'pending' as Guest['status']
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    companions: ''
  })

  useEffect(() => {
    // Check localStorage first
    const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY)
    if (savedGuest) {
      const parsedGuest = JSON.parse(savedGuest)
      setGuest(parsedGuest)
      setFormData({
        name: parsedGuest.name,
        companions: parsedGuest.companions,
        status: parsedGuest.status
      })
      setSuccess(true)
      setLoading(false)
      return
    }

    // If no saved guest, check for guestId
    if (guestId) {
      fetchGuest()
    } else {
      setLoading(false)
    }
  }, [guestId])

  const validateForm = () => {
    const errors = {
      name: '',
      companions: ''
    }
    let isValid = true

    if (!guest) {
      // Name validation
      if (!formData.name.trim()) {
        errors.name = 'Name is required'
        isValid = false
      } else if (formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters'
        isValid = false
      }

      // Companions validation
      if (formData.companions < 0) {
        errors.companions = 'Number of companions cannot be negative'
        isValid = false
      } else if (formData.companions > 5) {
        errors.companions = 'Maximum 5 companions allowed'
        isValid = false
      }
    }

    // Status validation
    if (formData.status === 'pending') {
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    // Clear error when user starts typing
    setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const fetchGuest = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', guestId)
        .single()

      if (error) throw error
      if (data) {
        setGuest(data)
        setFormData({
          name: data.name,
          companions: data.companions,
          status: data.status
        })
        // Save to localStorage
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data))
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      if (guest) {
        // Update existing guest
        const { data, error } = await supabase
          .from('guests')
          .update({
            status: formData.status,
            companions: formData.companions
          })
          .eq('id', guest.id)
          .select()
          .single()

        if (error) throw error
        if (data) {
          setGuest(data)
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data))
        }
      } else {
        // Create new guest
        const { data, error } = await supabase
          .from('guests')
          .insert([{
            name: formData.name.trim(),
            companions: formData.companions,
            status: formData.status
          }])
          .select()
          .single()

        if (error) throw error
        if (data) {
          setGuest(data)
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data))
        }
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div>
        <div className="text-center flex flex-col items-center justify-center mb-12">
          <div className="text-orange-600 text-6xl mb-4">
            <FaCheck />
          </div>
          <h3 className="text-2xl font-bold text-orange-600 mb-2 font-sour-gummy">RSVP Confirmed!</h3>
          <p className="text-orange-600 font-roboto">
            {guest 
              ? "We've updated your RSVP status."
              : "We've received your RSVP. Thank you for confirming!"}
          </p>
          {formData.status === 'attending' && (
            <button
              onClick={() => {
                localStorage.removeItem(GUEST_STORAGE_KEY)
                setSuccess(false)
                setGuest(null)
                setFormData({
                  name: '',
                  companions: 0,
                  status: 'pending'
                })
              }}
              className="mt-4 text-sm text-orange-600 hover:text-orange-700 underline"
            >
              Update my RSVP
            </button>
          )}
        </div>

        {formData.status === 'attending' && (
          <div className="mt-8">
            <GiftRegistry guestId={guest?.id} />
          </div>
        )}
      </div>
    )
  }

  const isFormValid = !guest ? 
    formData.name.trim() && formData.status !== 'pending' && !formErrors.name && !formErrors.companions
    : formData.status !== 'pending'

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 p-2 rounded-lg">
          <FaPaw className="h-6 w-6 text-orange-700" />
        </div>
        <h2 className="text-3xl font-bold text-orange-800 font-sour-gummy">RSVP</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!guest && (
          <>
            <div>
              <label htmlFor="name" className="block text-xl font-semibold text-orange-800 mb-2 font-sour-gummy">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-base text-orange-700 shadow-sm placeholder-gray-400
                focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${
                  formErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your name"
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="companions" className="block text-xl font-semibold text-orange-800 mb-2 font-sour-gummy">
                Number of Companions
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserFriends className="h-5 w-5 text-orange-400" />
                </div>
                <input
                  type="number"
                  id="companions"
                  name="companions"
                  min="0"
                  max="5"
                  value={formData.companions}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full pl-10 px-3 py-2 bg-white border rounded-md text-base text-orange-700 shadow-sm placeholder-gray-400
                  focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${
                    formErrors.companions ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
              </div>
              {formErrors.companions && (
                <p className="mt-1 text-sm text-red-600">{formErrors.companions}</p>
              )}
            </div>
          </>
        )}

        <div>
          <label className="block text-xl font-semibold text-orange-800 mb-2 font-sour-gummy">
            Will you attend?
          </label>
          <div className="mt-2 space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="attending"
                checked={formData.status === 'attending'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Guest['status'] }))}
                className="h-4 w-4 focus:ring-orange-500 border-gray-300 text-orange-600"
                required
              />
              <span className="ml-3 text-orange-700">Yes, I'll be there!</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="not_attending"
                checked={formData.status === 'not_attending'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Guest['status'] }))}
                className="h-4 w-4 focus:ring-orange-500 border-gray-300 text-orange-600"
              />
              <span className="ml-3 text-orange-700">Sorry, I can't make it</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full font-sour-gummy bg-orange-700 text-white py-2 px-4 rounded-md font-medium hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Submit RSVP'}
        </button>
      </form>
    </div>
  )
} 