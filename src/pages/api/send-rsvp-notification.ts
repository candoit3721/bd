import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { sendRsvpNotification } from '../../lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Email notification API called:', req.method, req.body);

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { guestId, status } = req.body;
  console.log('Received request to send notification for guest:', guestId, 'with status:', status);

  if (!guestId || !status) {
    console.log('Missing required fields:', { guestId, status });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get guest information
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single();

    console.log('Guest lookup result:', { guest, error: guestError });

    if (guestError) {
      console.error('Error fetching guest:', guestError);
      throw guestError;
    }

    if (!guest) {
      console.log('Guest not found with ID:', guestId);
      return res.status(404).json({ error: 'Guest not found' });
    }

    // Get admin email from party settings
    const { data: settings, error: settingsError } = await supabase
      .from('party_settings')
      .select('contact_email, secondary_email')
      .order('id', { ascending: true })
      .limit(1)
      .single();

    console.log('Party settings lookup result:', { settings, error: settingsError });

    if (settingsError) {
      console.error('Error fetching party settings:', settingsError);
      throw settingsError;
    }

    // Get admin email from environment variables or party settings
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || settings?.contact_email || '';
    console.log('Admin email to use for notification:', adminEmail);

    if (!adminEmail) {
      console.error('No admin email configured in environment or party settings');
      return res.status(400).json({ error: 'Admin email not configured' });
    }

    // Get secondary email from environment variables or party settings
    const secondaryEmail = process.env.NEXT_PUBLIC_SECONDARY_EMAIL || settings?.secondary_email || '';
    console.log('Secondary email to use for notification:', secondaryEmail);

    // Send email notification
    console.log('Attempting to send email notification with params:', {
      guestName: guest.name,
      guestId: guest.id,
      status,
      adminEmail,
      secondaryEmail,
      contactInfo: { email: guest.email, phone: guest.phone }
    });

    try {
      // Create an array of recipients
      const recipients = [adminEmail];
      if (secondaryEmail && secondaryEmail !== adminEmail) {
        recipients.push(secondaryEmail);
      }

      const emailSent = await sendRsvpNotification(
        guest.name,
        guest.id,
        status,
        recipients,
        { email: guest.email, phone: guest.phone }
      );

      console.log('Email notification result:', emailSent);
      return res.status(200).json({ success: true, emailSent, recipients });
    } catch (emailError) {
      console.error('Error in sendRsvpNotification function:', emailError);
      return res.status(500).json({ error: 'Failed to send email notification', details: emailError });
    }
  } catch (error) {
    console.error('Error sending RSVP notification:', error);
    return res.status(500).json({ error: 'Failed to send notification', details: error });
  }
}
