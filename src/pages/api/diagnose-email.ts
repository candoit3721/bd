import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Email diagnosis API called');

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

    // Try different combinations of sender and recipient
    const testResults = [];

    // Test 1: Send from admin to admin with name
    try {
      console.log('Test 1: Sending from admin to admin with name');
      const msg1 = {
        to: adminEmail,
        from: {
          email: adminEmail,
          name: "Sophia's Birthday RSVP"
        },
        subject: 'Test 1: Admin to Admin with Name',
        text: 'This is test 1: sending from admin to admin with a display name.',
        html: '<strong>This is test 1: sending from admin to admin with a display name.</strong>',
      };

      const result1 = await sgMail.send(msg1);
      testResults.push({ test: 1, success: true, statusCode: result1[0].statusCode });
    } catch (error) {
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

      testResults.push({
        test: 1,
        success: false,
        error: errorMessage,
        response: errorResponse
      });
    }

    // Test 2: Send from secondary to admin
    const secondaryEmail = process.env.NEXT_PUBLIC_SECONDARY_EMAIL;
    if (secondaryEmail && secondaryEmail !== adminEmail) {
      try {
        console.log('Test 2: Sending from secondary to admin');
        const msg2 = {
          to: adminEmail,
          from: {
            email: secondaryEmail,
            name: "Sophia's Birthday RSVP"
          },
          subject: 'Test 2: Secondary to Admin',
          text: 'This is test 2: sending from secondary email to admin.',
          html: '<strong>This is test 2: sending from secondary email to admin.</strong>',
        };

        const result2 = await sgMail.send(msg2);
        testResults.push({ test: 2, success: true, statusCode: result2[0].statusCode });
      } catch (error) {
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

        testResults.push({
          test: 2,
          success: false,
          error: errorMessage,
          response: errorResponse
        });
      }
    }

    // Test 3: Send from admin to secondary
    if (secondaryEmail && secondaryEmail !== adminEmail) {
      try {
        console.log('Test 3: Sending from admin to secondary');
        const msg3 = {
          to: secondaryEmail,
          from: {
            email: adminEmail,
            name: "Sophia's Birthday RSVP"
          },
          subject: 'Test 3: Admin to Secondary',
          text: 'This is test 3: sending from admin to secondary email.',
          html: '<strong>This is test 3: sending from admin to secondary email.</strong>',
        };

        const result3 = await sgMail.send(msg3);
        testResults.push({ test: 3, success: true, statusCode: result3[0].statusCode });
      } catch (error) {
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

        testResults.push({
          test: 3,
          success: false,
          error: errorMessage,
          response: errorResponse
        });
      }
    }

    // Test 4: Send to both admin and secondary
    if (secondaryEmail && secondaryEmail !== adminEmail) {
      try {
        console.log('Test 4: Sending to both admin and secondary');
        const msg4 = {
          to: [adminEmail, secondaryEmail],
          from: {
            email: adminEmail,
            name: "Sophia's Birthday RSVP"
          },
          subject: 'Test 4: To Both Admin and Secondary',
          text: 'This is test 4: sending to both admin and secondary email.',
          html: '<strong>This is test 4: sending to both admin and secondary email.</strong>',
        };

        const result4 = await sgMail.send(msg4);
        testResults.push({ test: 4, success: true, statusCode: result4[0].statusCode });
      } catch (error) {
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

        testResults.push({
          test: 4,
          success: false,
          error: errorMessage,
          response: errorResponse
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Email diagnosis tests completed',
      tests: testResults,
      adminEmail,
      secondaryEmail,
      note: "If tests show success but you're not receiving emails, check your spam folder or email provider's filtering."
    });
  } catch (error) {
    console.error('Error in email diagnosis:', error);

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

    return res.status(500).json({
      error: 'Failed to complete email diagnosis',
      details: errorMessage,
      response: errorResponse
    });
  }
}
