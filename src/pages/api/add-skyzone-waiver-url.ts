import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // First, check if the column already exists
    const { data: columns, error: checkError } = await supabase
      .from('party_settings')
      .select('skyzone_waiver_url')
      .limit(1);

    if (checkError && checkError.message.includes('column "skyzone_waiver_url" does not exist')) {
      // Column doesn't exist, let's add it by updating a record with the new field
      // This will implicitly add the column in Supabase
      const { data: settings, error: getError } = await supabase
        .from('party_settings')
        .select('id')
        .limit(1)
        .single();

      if (getError) {
        throw getError;
      }

      if (settings) {
        // Update the record with the new field
        const { error: updateError } = await supabase
          .from('party_settings')
          .update({ skyzone_waiver_url: 'https://www.skyzone.com/waiver' })
          .eq('id', settings.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // No settings found, create a new record
        const { error: insertError } = await supabase
          .from('party_settings')
          .insert([{
            venue_name: 'SkyZone',
            address_line1: '1234 Jump Street',
            city: 'Springfield',
            state: 'IL',
            zip_code: '62701',
            skyzone_waiver_url: 'https://www.skyzone.com/waiver'
          }]);

        if (insertError) {
          throw insertError;
        }
      }

      return res.status(200).json({ success: true, message: 'Column added successfully' });
    } else if (checkError) {
      throw checkError;
    } else {
      // Column already exists
      return res.status(200).json({ success: true, message: 'Column already exists' });
    }
  } catch (error) {
    console.error('Error adding column:', error);
    return res.status(500).json({ error: 'Failed to add column', details: error });
  }
}
