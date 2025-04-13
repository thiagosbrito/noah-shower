'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Guest } from '../types/supabase'
import { FaUser, FaCheck, FaPaw, FaUserFriends, FaTimes, FaSpinner, FaEdit, FaPaperPlane } from 'react-icons/fa'
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
        <FaSpinner className="animate-spin text-4xl text-orange-600" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="animate-fade-in">
        <div className="text-center flex flex-col items-center justify-center mb-12">
          <div className="text-orange-600 text-6xl mb-4 animate-bounce-once">
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
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all duration-300"
            >
              <FaEdit className="text-sm" />
              {t('rsvp.update')}
            </button>
          )}
        </div>

        {formData.status === 'attending' && (
          <div className="mt-8 animate-fade-in">
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
    <div className="bg-white/90 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-orange-100 hover:border-orange-200 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-orange-100 p-3 rounded-xl transform transition-transform hover:scale-110 duration-300">
          <FaPaw className="text-orange-700 text-2xl" />
        </div>
        <h2 className="text-3xl font-bold text-orange-800 font-sour-gummy">{t('rsvp.title')}</h2>
      </div>

      <p className="text-orange-700 mb-8 font-roboto">{t('rsvp.subtitle')}</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="group">
          <label htmlFor="name" className="block text-orange-900 font-sour-gummy mb-2 transition-colors group-focus-within:text-orange-900">
            {t('rsvp.name')}
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 transition-colors group-focus-within:text-orange-600" />
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('rsvp.namePlaceholder')}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border text-orange-600 ${
                formErrors.name ? 'border-red-300 focus:ring-red-200' : 'border-orange-200 focus:ring-orange-200'
              } focus:outline-none focus:ring-4 focus:border-transparent transition-all duration-300 placeholder:text-orange-300`}
              disabled={!!guest}
            />
            {formData.name && !formErrors.name && (
              <FaCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            )}
          </div>
          {formErrors.name && (
            <p className="mt-2 text-red-500 text-sm flex items-center gap-1">
              <FaTimes className="text-xs" />
              {formErrors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-orange-900 font-sour-gummy mb-4">
            {t('rsvp.status')}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`relative flex items-center p-4 cursor-pointer bg-white rounded-xl border-2 ${
              formData.status === 'attending' 
                ? 'border-orange-600 bg-orange-50/50' 
                : 'border-orange-100 hover:border-orange-300'
            } transition-all duration-300`}>
              <input
                type="radio"
                name="status"
                value="attending"
                checked={formData.status === 'attending'}
                onChange={() => handleInputChange('status', 'attending')}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${
                  formData.status === 'attending'
                    ? 'border-orange-600 bg-orange-600'
                    : 'border-orange-300'
                }`}>
                  <FaCheck className={`text-white transform transition-transform duration-300 ${
                    formData.status === 'attending' ? 'scale-100' : 'scale-0'
                  }`} />
                </div>
                <div>
                  <span className={`block font-medium transition-colors duration-300 ${
                    formData.status === 'attending' ? 'text-orange-900' : 'text-orange-800'
                  }`}>{t('rsvp.attending')}</span>
                  <span className="text-sm text-orange-500">{t('rsvp.attendingDesc')}</span>
                </div>
              </div>
            </label>

            <label className={`relative flex items-center p-4 cursor-pointer bg-white rounded-xl border-2 ${
              formData.status === 'not_attending' 
                ? 'border-orange-600 bg-orange-50/50' 
                : 'border-orange-100 hover:border-orange-300'
            } transition-all duration-300`}>
              <input
                type="radio"
                name="status"
                value="not_attending"
                checked={formData.status === 'not_attending'}
                onChange={() => handleInputChange('status', 'not_attending')}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${
                  formData.status === 'not_attending'
                    ? 'border-orange-600 bg-orange-600'
                    : 'border-orange-300'
                }`}>
                  <FaCheck className={`text-white transform transition-transform duration-300 ${
                    formData.status === 'not_attending' ? 'scale-100' : 'scale-0'
                  }`} />
                </div>
                <div>
                  <span className={`block font-medium transition-colors duration-300 ${
                    formData.status === 'not_attending' ? 'text-orange-900' : 'text-orange-800'
                  }`}>{t('rsvp.notAttending')}</span>
                  <span className="text-sm text-orange-500">{t('rsvp.notAttendingDesc')}</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        {formData.status === 'attending' && (
          <div className="animate-fade-in">
            <label className="block text-orange-900 font-sour-gummy mb-2">
              {t('rsvp.companions')}
            </label>
            <div className="relative">
              <FaUserFriends className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" />
              <input
                type="number"
                min="0"
                max="5"
                value={formData.companions}
                onChange={(e) => handleInputChange('companions', parseInt(e.target.value) || 0)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border text-orange-600 ${
                  formErrors.companions ? 'border-red-300 focus:ring-red-200' : 'border-orange-200 focus:ring-orange-200'
                } focus:outline-none focus:ring-4 focus:border-transparent transition-all duration-300`}
              />
            </div>
            {formErrors.companions && (
              <p className="mt-2 text-red-500 text-sm flex items-center gap-1">
                <FaTimes className="text-xs" />
                {formErrors.companions}
              </p>
            )}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-fit flex items-center justify-center gap-2 py-3 px-12 rounded-lg text-white font-sour-gummy transition-all duration-300
              ${isFormValid && !loading
                ? 'bg-orange-600 hover:bg-orange-700 active:transform active:scale-[0.98]'
                : 'bg-orange-300 cursor-not-allowed'
              }`}
          >
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 