'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Guest } from '../types/supabase'
import { FaUser, FaCheck, FaPaw, FaUserFriends, FaTimes, FaSpinner } from 'react-icons/fa'
import GiftRegistry from './GiftRegistry'
import { useLanguage } from '../contexts/LanguageContext'

interface RSVPFormProps {
  guestId?: string
}

const GUEST_STORAGE_KEY = 'noah_shower_guest'

export default function RSVPForm({ guestId }: RSVPFormProps) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [guest, setGuest] = useState<Guest | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    status: 'pending' as 'attending' | 'not_attending' | 'pending',
    companions: 0
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
        status: parsedGuest.status,
        companions: parsedGuest.companions || 0
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

  const fetchGuest = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', guestId)
        .single()

      if (error) throw error

      setGuest(data)
      setFormData({
        name: data.name,
        status: data.status,
        companions: data.companions || 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (field === 'name') {
      setFormErrors(prev => ({
        ...prev,
        name: ''
      }))
    } else if (field === 'companions') {
      setFormErrors(prev => ({
        ...prev,
        companions: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {
      name: '',
      companions: ''
    }

    if (!guest && !formData.name.trim()) {
      errors.name = t('rsvp.nameRequired')
    }

    if (formData.status === 'attending' && formData.companions < 0) {
      errors.companions = t('rsvp.companionsInvalid')
    }

    setFormErrors(errors)
    return !errors.name && !errors.companions
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      if (guest) {
        // Update existing guest
        const { error } = await supabase
          .from('guests')
          .update({
            status: formData.status,
            companions: formData.status === 'attending' ? formData.companions : 0
          })
          .eq('id', guest.id)

        if (error) throw error
      } else {
        // Create new guest
        const { data, error } = await supabase
          .from('guests')
          .insert([{
            name: formData.name,
            status: formData.status,
            companions: formData.status === 'attending' ? formData.companions : 0
          }])
          .select()
          .single()

        if (error) throw error

        // Save guest data to localStorage
        localStorage.setItem('noah_shower_guest', JSON.stringify(data))
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
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
          <h3 className="text-2xl font-bold text-orange-600 mb-2 font-sour-gummy">{t('rsvp.success')}</h3>
          <p className="text-orange-600 font-roboto">
            {guest 
              ? t('rsvp.updated')
              : t('rsvp.received')}
          </p>
          {formData.status === 'attending' && (
            <button
              onClick={() => {
                setSuccess(false)
                setLoading(false)
              }}
              className="mt-4 text-sm text-orange-600 hover:text-orange-700 underline"
            >
              {t('rsvp.update')}
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
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-orange-800 font-medium mb-2">
            {t('rsvp.name')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-orange-400" />
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={t('rsvp.namePlaceholder')}
              disabled={!!guest}
            />
          </div>
          {formErrors.name && (
            <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-orange-800 font-medium mb-2">
            {t('rsvp.status')}
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="status"
                value="attending"
                checked={formData.status === 'attending'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="text-orange-600 focus:ring-orange-500"
              />
              <span className="text-orange-800">
                <FaCheck className="inline mr-2" />
                {t('rsvp.attending')}
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="status"
                value="not_attending"
                checked={formData.status === 'not_attending'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="text-orange-600 focus:ring-orange-500"
              />
              <span className="text-orange-800">
                <FaTimes className="inline mr-2" />
                {t('rsvp.notAttending')}
              </span>
            </label>
          </div>
        </div>

        {formData.status === 'attending' && (
          <div>
            <label className="block text-orange-800 font-medium mb-2">
              {t('rsvp.companions')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserFriends className="text-orange-400" />
              </div>
              <input
                type="number"
                min="0"
                max="5"
                value={formData.companions}
                onChange={(e) => handleInputChange('companions', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            {formErrors.companions && (
              <p className="text-red-600 text-sm mt-1">{formErrors.companions}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" />
              {t('rsvp.submitting')}
            </div>
          ) : (
            t('rsvp.submit')
          )}
        </button>
      </form>
    </div>
  )
} 