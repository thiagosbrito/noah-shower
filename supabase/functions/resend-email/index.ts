// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore
import { Resend } from 'https://esm.sh/resend'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  guestName: string
  eventDate: string
  eventTime: string
  eventLocation: string
  rsvpLink: string
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    const body = await req.json() as EmailRequest

    const { data, error } = await resend.emails.send({
      from: 'Noah\'s Baby Shower <noah-shower@resend.dev>',
      to: [body.to],
      subject: `You're Invited to Noah's Baby Shower!`,
      reply_to: 'noah-shower@resend.dev',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Baby Shower Invitation</title>
          </head>
          <body style="
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          ">
            <div style="
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            ">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="
                  color: #92400e;
                  font-size: 28px;
                  margin-bottom: 10px;
                ">You're Invited!</h1>
                <p style="color: #78350f; font-size: 18px;">To Noah's Baby Shower</p>
              </div>
              
              <p style="color: #78350f; font-size: 16px;">Dear ${body.guestName},</p>
              
              <p style="color: #78350f; font-size: 16px;">
                We're excited to invite you to celebrate the upcoming arrival of baby Noah! 
                Please join us for an afternoon of joy, laughter, and celebration.
              </p>
              
              <div style="
                background-color: #fef3c7;
                padding: 25px;
                border-radius: 8px;
                margin: 25px 0;
              ">
                <h2 style="
                  color: #92400e;
                  font-size: 20px;
                  margin-bottom: 20px;
                  text-align: center;
                ">Event Details</h2>
                
                <ul style="
                  list-style: none;
                  padding: 0;
                  margin: 0;
                  color: #92400e;
                ">
                  <li style="margin-bottom: 15px; display: flex; align-items: center;">
                    <span style="margin-right: 10px;">📅</span>
                    <span><strong>Date:</strong> ${body.eventDate}</span>
                  </li>
                  <li style="margin-bottom: 15px; display: flex; align-items: center;">
                    <span style="margin-right: 10px;">⏰</span>
                    <span><strong>Time:</strong> ${body.eventTime}</span>
                  </li>
                  <li style="margin-bottom: 15px; display: flex; align-items: center;">
                    <span style="margin-right: 10px;">📍</span>
                    <span><strong>Location:</strong> Gromadzka 63/5</span>
                  </li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${body.rsvpLink}" style="
                  display: inline-block;
                  background-color: #f59e0b;
                  color: white;
                  text-decoration: none;
                  padding: 15px 30px;
                  border-radius: 8px;
                  font-weight: bold;
                  font-size: 18px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
              
              <div style="
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #f3f4f6;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
              ">
                <p>If you have any questions, please reply to this email.</p>
                <p style="margin-top: 10px;">© 2024 Noah's Baby Shower</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 