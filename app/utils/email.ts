import { supabase } from './supabase'

interface EmailInviteParams {
  to: string
  guestName: string
  eventDate: string
  eventTime: string
  eventLocation: string
  rsvpLink: string
}

export async function sendInviteEmail({
  to,
  guestName,
  eventDate,
  eventTime,
  eventLocation,
  rsvpLink
}: EmailInviteParams) {
  try {
    console.log('Starting email send process...')
    console.log('Using Supabase anon key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10) + '...')
    
    const response = await fetch(
      'https://aheadusgmspufqxnugts.supabase.co/functions/v1/resend-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          to,
          guestName,
          eventDate,
          eventTime,
          eventLocation,
          rsvpLink
        })
      }
    )

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
    console.log('Raw response:', responseText)
    
    let responseData
    try {
      responseData = JSON.parse(responseText)
      console.log('Parsed response data:', responseData)
    } catch (e) {
      console.error('Failed to parse response as JSON:', e)
      throw new Error('Invalid response from email service')
    }

    if (!response.ok) {
      console.error('Email service error:', responseData)
      throw new Error(responseData.error || 'Failed to send email')
    }

    return responseData
  } catch (error) {
    console.error('Error in sendInviteEmail:', error)
    throw error
  }
} 