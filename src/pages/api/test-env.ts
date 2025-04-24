import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Return environment variables (redacted for security)
  res.status(200).json({
    SENDGRID_API_KEY_EXISTS: !!process.env.SENDGRID_API_KEY,
    SENDGRID_API_KEY_LENGTH: process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.length : 0,
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV
  });
}
