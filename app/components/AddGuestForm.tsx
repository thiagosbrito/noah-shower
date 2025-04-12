'use client'

import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { sendInviteEmail } from '../utils/email'
import { FaUser, FaEnvelope, FaInfoCircle } from 'react-icons/fa'

interface AddGuestFormProps {
  onGuestAdded: () => void
}

export default function AddGuestForm({ onGuestAdded }: AddGuestFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    setInfo(null)

    try {
      // First, check if guest already exists
      const { data: existingGuest } = await supabase
        .from('guests')
        .select('id, name')
        .eq('email', email)
        .single()

      if (existingGuest) {
        setError(`Guest with email ${email} already exists (${existingGuest.name})`)
        setLoading(false)
        return
      }

      const { data: guest, error: insertError } = await supabase
        .from('guests')
        .insert([{ name, email, status: 'pending' }])
        .select()
        .single()

      if (insertError) throw insertError

      // For testing purposes, only send email to your address
      const testEmail = 'thiago83brito@hotmail.com'
      const rsvpLink = `${window.location.origin}/?guestId=${guest.id}`

      try {
        await sendInviteEmail({
          to: testEmail,
          guestName: name,
          eventDate: 'April 20, 2024',
          eventTime: '2:00 PM',
          eventLocation: 'Gromadzka 63/5',
          rsvpLink
        })
        setInfo(`Test email sent to ${testEmail} (Resend testing mode)`)
      } catch (emailError: any) {
        console.error('Failed to send invite email:', emailError)
        setInfo('Note: Emails are currently in testing mode. To send to other recipients, please verify a domain with Resend.')
      }

      setSuccess('Guest added successfully!')
      setName('')
      setEmail('')
      onGuestAdded()
    } catch (err: any) {
      console.error('Error inserting guest:', err)
      setError(err.message || 'Failed to add guest')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaUser className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Guest name"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="guest@example.com"
            required
          />
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

      {info && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">{info}</h3>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{success}</h3>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : 'Add Guest'}
      </button>
    </form>
  )
} 