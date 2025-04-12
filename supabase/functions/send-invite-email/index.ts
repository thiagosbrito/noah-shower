import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/resend'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    const { to, guestName, eventDate, eventTime, eventLocation, rsvpLink } = await req.json()

    const { data, error } = await resend.emails.send({
      from: 'Noah\'s Baby Shower <no-reply@yourdomain.com>',
      to: [to],
      subject: `You're Invited to Noah's Baby Shower!`,
      html: `
        <div style="
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">
          <h1 style="
            color: #92400e;
            font-size: 24px;
            text-align: center;
            margin-bottom: 20px;
          ">You're Invited!</h1>
          
          <p style="color: #78350f; font-size: 16px;">Dear ${guestName},</p>
          
          <p style="color: #78350f; font-size: 16px;">
            We're excited to invite you to celebrate the upcoming arrival of baby Noah!
          </p>
          
          <div style="
            background-color: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          ">
            <h2 style="
              color: #92400e;
              font-size: 18px;
              margin-bottom: 15px;
            ">Event Details:</h2>
            
            <ul style="
              list-style: none;
              padding: 0;
              margin: 0;
              color: #92400e;
            ">
              <li style="margin-bottom: 10px;">📅 Date: ${eventDate}</li>
              <li style="margin-bottom: 10px;">⏰ Time: ${eventTime}</li>
              <li style="margin-bottom: 10px;">📍 Location: ${eventLocation}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${rsvpLink}" style="
              display: inline-block;
              background-color: #f59e0b;
              color: white;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
            ">RSVP Now</a>
          </div>
          
          <p style="
            color: #78350f;
            font-size: 16px;
            text-align: center;
            margin-top: 30px;
          ">
            We can't wait to celebrate with you!
          </p>
          
          <p style="
            color: #92400e;
            font-size: 14px;
            text-align: center;
            margin-top: 20px;
          ">
            Best regards,<br>
            The Hosts
          </p>
        </div>
      `,
    })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 