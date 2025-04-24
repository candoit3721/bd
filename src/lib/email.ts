import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
console.log('Initializing SendGrid with API key present:', !!process.env.SENDGRID_API_KEY);
if (process.env.SENDGRID_API_KEY) {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('SendGrid API key set successfully');
  } catch (error) {
    console.error('Error setting SendGrid API key:', error);
  }
} else {
  console.warn('SENDGRID_API_KEY is not set. Email functionality will not work.');
}

/**
 * Send an email notification when a guest updates their RSVP status
 * @param guestName The name of the guest
 * @param guestId The ID of the guest
 * @param status The RSVP status (ACCEPTED or DECLINED)
 * @param adminEmail The email address to send the notification to
 * @param contactInfo Optional contact information provided by the guest
 */
export async function sendRsvpNotification(
  guestName: string,
  guestId: string,
  status: 'ACCEPTED' | 'DECLINED',
  recipients: string | string[],
  contactInfo?: { email?: string | null; phone?: string | null }
) {
  console.log('sendRsvpNotification called with params:', {
    guestName,
    guestId,
    status,
    recipients,
    contactInfo
  });

  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY is not set. Email notification not sent.');
    return false;
  }

  if (!recipients || (Array.isArray(recipients) && recipients.length === 0)) {
    console.warn('No recipients provided. Email notification not sent.');
    return false;
  }

  // We'll use the first recipient as the sender below

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const dashboardUrl = `${baseUrl}/admin/dashboard`;
  const guestDetailsUrl = `${baseUrl}/admin/guest/${guestId}`;

  const statusText = status === 'ACCEPTED' ? 'accepted' : 'declined';
  const statusEmoji = status === 'ACCEPTED' ? '✅' : '❌';

  // Format contact information if provided
  let contactInfoText = '';
  if (contactInfo) {
    if (contactInfo.email) {
      contactInfoText += `Email: ${contactInfo.email}\n`;
    }
    if (contactInfo.phone) {
      contactInfoText += `Phone: ${contactInfo.phone}\n`;
    }
    if (contactInfoText) {
      contactInfoText = `\nContact Information:\n${contactInfoText}`;
    }
  }

  // Format the recipients array
  const recipientsArray = Array.isArray(recipients) ? recipients : [recipients];

  // Get the first recipient to use as the sender (must be verified in SendGrid)
  const senderEmail = recipientsArray[0];

  const msg = {
    to: recipientsArray,
    from: {
      email: senderEmail,
      name: "Sophia's Birthday RSVP"
    },
    subject: `RSVP Update: ${guestName} has ${statusText} the invitation ${statusEmoji}`,
    text: `
Hello,

${guestName} has ${statusText} the invitation to Sophia's birthday party.${contactInfoText}

You can view all RSVPs on the dashboard: ${dashboardUrl}
Or view this guest's details: ${guestDetailsUrl}

This is an automated notification.
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 3px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #6B2FBE, #9733EE); padding: 25px; border-radius: 8px 8px 0 0; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px; }
    .content { padding: 30px; border: 1px solid #eaeaea; border-top: none; border-radius: 0 0 8px 8px; }
    .status { font-weight: bold; font-size: 18px; }
    .accepted { color: #4CAF50; }
    .declined { color: #F44336; }
    .guest-name { font-weight: bold; font-size: 20px; color: #333; }
    .contact-info { margin-top: 25px; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #FF4E9D; }
    .contact-info h3 { margin-top: 0; color: #555; }
    .links { margin-top: 30px; text-align: center; }
    .button { display: inline-block; background-color: #FF4E9D; color: white; padding: 12px 20px; text-decoration: none; border-radius: 50px; margin: 5px; font-weight: bold; font-size: 15px; transition: background-color 0.2s; }
    .button:hover { background-color: #E6438C; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 13px; color: #888; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>RSVP Update for Sophia's Birthday</h1>
    </div>
    <div class="content">
      <p class="guest-name">${guestName}</p>
      <p>has <span class="status ${status === 'ACCEPTED' ? 'accepted' : 'declined'}">${statusText}</span> the invitation to Sophia's birthday party. ${statusEmoji}</p>

      ${contactInfo && (contactInfo.email || contactInfo.phone) ? `
      <div class="contact-info">
        <h3>Contact Information:</h3>
        ${contactInfo.email ? `<p><strong>Email:</strong> ${contactInfo.email}</p>` : ''}
        ${contactInfo.phone ? `<p><strong>Phone:</strong> ${contactInfo.phone}</p>` : ''}
      </div>
      ` : ''}

      <div class="links">
        <a href="${dashboardUrl}" class="button">View All RSVPs</a>
        <a href="${guestDetailsUrl}" class="button">View Guest Details</a>
      </div>

      <div class="footer">
        <p>This is an automated notification from Sophia's Birthday RSVP system.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `,
  };

  try {
    console.log('Attempting to send email with SendGrid:', {
      to: msg.to,
      from: msg.from,
      subject: msg.subject
    });

    const result = await sgMail.send(msg);
    console.log(`Email notification sent for ${guestName}'s RSVP (${status})`, result);
    console.log(`IMPORTANT: Check your inbox at ${recipientsArray.join(', ')} for the notification email.`);
    console.log(`If you don't see the email, check your spam folder or email provider's filtering.`);
    console.log(`The email was sent from "${msg.from.name}" <${msg.from.email}> with subject "${msg.subject}"`);
    return true;
  } catch (error: any) {
    console.error('Error sending email notification with SendGrid:', error);
    if (error.response) {
      console.error('SendGrid API error response:', {
        body: error.response.body,
        statusCode: error.response.statusCode
      });
    }
    return false;
  }
}
