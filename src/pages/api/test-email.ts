import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Test email API called');

  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not set');
    return res.status(500).json({ error: 'SENDGRID_API_KEY is not set' });
  }

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!adminEmail) {
      console.error('NEXT_PUBLIC_ADMIN_EMAIL is not set');
      return res.status(500).json({ error: 'NEXT_PUBLIC_ADMIN_EMAIL is not set' });
    }

    // Use a different format for the sender but with the same email address
    console.log('Sending test email to:', adminEmail, 'from:', adminEmail);

    const msg = {
      to: adminEmail,
      from: {
        email: adminEmail,
        name: "Sophia's Birthday RSVP"
      },
      subject: 'Test Email from Birthday RSVP App',
      text: 'This is a test email to verify that SendGrid is working correctly.',
      html: '<strong>This is a test email to verify that SendGrid is working correctly.</strong>',
    };

    const result = await sgMail.send(msg);
    console.log('Test email sent successfully:', result);

    return res.status(200).json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error sending test email:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorResponse = error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'body' in error.response &&
      'statusCode' in error.response
        ? {
            body: error.response.body,
            statusCode: error.response.statusCode as number
          }
        : null;

    if (errorResponse) {
      console.error('SendGrid API error response:', errorResponse);
    }

    return res.status(500).json({
      error: 'Failed to send test email',
      details: errorMessage,
      response: errorResponse
    });
  }
}
