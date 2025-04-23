"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface PartyLocation {
  id?: number;
  venue_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  google_maps_url?: string;
  contact_email?: string;
  contact_phone?: string;
  party_date?: string;
  party_time?: string;
  party_end_time?: string;
  party_year?: string;
}

export default function LocationAdmin() {
  const [location, setLocation] = useState<PartyLocation>({
    venue_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    google_maps_url: '',
    contact_email: '',
    contact_phone: '',
    party_date: 'Saturday, June 7, 2025',
    party_time: '10:00 AM',
    party_end_time: '12:00 PM',
    party_year: '2025'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLocation() {
      try {
        const { data, error } = await supabase
          .from('party_settings')
          .select('*')
          .order('id', { ascending: true })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching location:', error);
          setError('Failed to load location data');
        } else if (data) {
          console.log('Loaded location data:', data);
          setLocation(data);
        }
      } catch (err) {
        console.error('Exception:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchLocation();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocation(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      let result;

      if (location.id) {
        // Update existing record
        result = await supabase
          .from('party_settings')
          .update(location)
          .eq('id', location.id);
      } else {
        // Insert new record
        result = await supabase
          .from('party_settings')
          .insert([location]);
      }

      if (result.error) {
        console.error('Error saving location:', result.error);
        setError(`Failed to save: ${result.error.message}`);
      } else {
        setMessage('Location saved successfully!');

        // Refresh data
        const { data } = await supabase
          .from('party_settings')
          .select('*')
          .order('id', { ascending: true })
          .limit(1)
          .single();

        if (data) {
          setLocation(data);
        }
      }
    } catch (err) {
      console.error('Exception:', err);
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Party Settings</h1>
      <p className="text-gray-600 mb-6">Manage location, date, and time information for the party</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Venue Name</label>
            <input
              type="text"
              name="venue_name"
              value={location.venue_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
            <input
              type="text"
              name="address_line1"
              value={location.address_line1}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
            <input
              type="text"
              name="address_line2"
              value={location.address_line2 || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={location.city}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={location.state}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
            <input
              type="text"
              name="zip_code"
              value={location.zip_code}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Google Maps URL</label>
            <input
              type="url"
              name="google_maps_url"
              value={location.google_maps_url || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              name="contact_email"
              value={location.contact_email || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input
              type="tel"
              name="contact_phone"
              value={location.contact_phone || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <hr className="my-6 border-t border-gray-300" />
          <h2 className="text-xl font-bold mb-4">Party Date & Time Settings</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">Party Date (e.g., Saturday, June 7, 2025)</label>
            <input
              type="text"
              name="party_date"
              value={location.party_date || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time (e.g., 10:00 AM)</label>
              <input
                type="text"
                name="party_time"
                value={location.party_time || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Time (e.g., 12:00 PM)</label>
              <input
                type="text"
                name="party_end_time"
                value={location.party_end_time || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Party Year (e.g., 2025)</label>
            <input
              type="text"
              name="party_year"
              value={location.party_year || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {saving ? 'Saving...' : 'Save Party Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
