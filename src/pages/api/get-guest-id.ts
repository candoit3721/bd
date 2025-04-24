import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the first guest from the database
    const { data: guests, error } = await supabase
      .from('guests')
      .select('id, name, status')
      .limit(5);

    if (error) {
      throw error;
    }

    return res.status(200).json({ guests });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return res.status(500).json({ error: 'Failed to fetch guests' });
  }
}
