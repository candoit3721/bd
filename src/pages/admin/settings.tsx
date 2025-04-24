import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { generateGoogleMapsUrl } from '../../utils/maps';
import Head from 'next/head';
import { format } from 'date-fns';
import { formatPhoneNumber } from '../../utils/format';

interface PartySettings {
  id: number;
  venue_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  google_maps_url?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_name?: string;
  secondary_email?: string;
  secondary_phone?: string;
  secondary_contact_name?: string;
  party_date?: string;
  party_time?: string;
  party_end_time?: string;
  skyzone_waiver_url?: string;
}

export default function PartySettings() {
  const [settings, setSettings] = useState<PartySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  // Set the selected date when settings are loaded
  useEffect(() => {
    if (settings?.party_date) {
      try {
        // Parse the formatted date string (e.g., "Saturday, June 7, 2025")
        const dateString = settings.party_date;
        console.log('Parsing date string:', dateString);

        // Extract the date components using regex
        const match = dateString.match(/([A-Za-z]+),\s+([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/);

        if (match) {
          const [_, weekday, month, day, year] = match;
          console.log('Extracted date components:', { weekday, month, day, year });

          // Convert month name to month number (0-11)
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          const monthIndex = monthNames.findIndex(m => m.toLowerCase() === month.toLowerCase());

          if (monthIndex !== -1) {
            // Create a date object with time set to noon to avoid timezone issues
            // Month is 0-indexed in JavaScript Date
            const date = new Date(parseInt(year), monthIndex, parseInt(day), 12, 0, 0);
            console.log('Created date object from parsed date:', date.toString());

            // Format as YYYY-MM-DD for the date picker
            const formattedDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            console.log('Setting date picker value:', formattedDate);
            setSelectedDate(formattedDate);
          } else {
            console.error('Could not parse month:', month);
            setSelectedDate(new Date().toISOString().split('T')[0]);
          }
        } else {
          console.error('Date string does not match expected format:', dateString);
          setSelectedDate(new Date().toISOString().split('T')[0]);
        }
      } catch (e) {
        console.error('Error parsing date:', e);
        setSelectedDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [settings]);

  async function fetchSettings() {
    setLoading(true);
    try {
      // First check if the table exists
      const { error: tableError } = await supabase
        .from('party_settings')
        .select('count')
        .limit(1);

      if (tableError && (tableError.code === 'PGRST301' || tableError.message.includes('does not exist'))) {
        console.log('Table does not exist, using default settings');
        // Table doesn't exist, use default settings
        setSettings({
          id: 0,
          venue_name: 'SkyZone Trampoline Park',
          address_line1: '1234 Jump Street',
          city: 'Springfield',
          state: 'IL',
          zip_code: '62701',
          party_date: 'Saturday, June 7, 2025',
          party_time: '10:00 AM',
          party_end_time: '12:00 PM'
        });
        setLoading(false);
        return;
      }

      // Table exists, try to get settings
      const { data, error } = await supabase
        .from('party_settings')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, create default settings
          console.log('No settings found, using default settings');
          setSettings({
            id: 0,
            venue_name: 'SkyZone Trampoline Park',
            address_line1: '1234 Jump Street',
            city: 'Springfield',
            state: 'IL',
            zip_code: '62701',
            party_date: 'Saturday, June 7, 2025',
            party_time: '10:00 AM',
            party_end_time: '12:00 PM'
          });
        } else {
          throw error;
        }
      } else {
        console.log('Loaded settings from database:', data);
        setSettings(data);
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      // Always provide default settings even if there's an error
      setSettings({
        id: 0,
        venue_name: 'SkyZone Trampoline Park',
        address_line1: '1234 Jump Street',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62701',
        party_date: 'Saturday, June 7, 2025',
        party_time: '10:00 AM',
        party_end_time: '12:00 PM'
      });
      setError('Failed to load party settings. You can still enter your information below.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!settings) return;

      // Generate Google Maps URL
      const mapsUrl = generateGoogleMapsUrl(settings);
      const updatedSettings = { ...settings, google_maps_url: mapsUrl };

      // Debug: Log the settings being saved
      console.log('Saving settings:', updatedSettings);

      // First, check if the table exists and create it if needed
      const { error: tableError } = await supabase
        .from('party_settings')
        .select('count')
        .limit(1);

      if (tableError && (tableError.code === 'PGRST301' || tableError.message.includes('does not exist'))) {
        // Try to create the table using RPC (if you have a function set up)
        try {
          console.log('Attempting to create party_settings table');
          // This is a fallback that might not work depending on your Supabase setup
          // You might need to manually create the table in Supabase

          // For now, we'll just show a more helpful error message
          setError('The party_settings table does not exist. Please create it in your Supabase dashboard or contact the administrator.');
          setSaving(false);
          return;
        } catch (createError) {
          console.error('Error creating table:', createError);
          setError('Unable to create the settings table. Please contact the administrator.');
          setSaving(false);
          return;
        }
      }

      let result;
      if (settings.id) {
        // Update existing settings
        result = await supabase
          .from('party_settings')
          .update(updatedSettings)
          .eq('id', settings.id);
      } else {
        // Insert new settings
        result = await supabase
          .from('party_settings')
          .insert([updatedSettings]);
      }

      if (result.error) {
        console.error('Error saving settings:', result.error);
        throw result.error;
      }

      setSuccess('Party settings saved successfully!');
      fetchSettings(); // Refresh settings
    } catch (error: any) {
      console.error('Error saving settings:', error);
      if (error.message && error.message.includes('permission denied')) {
        setError('Permission denied. You may not have the necessary permissions to save settings.');
      } else if (error.message && error.message.includes('does not exist')) {
        setError('The settings table does not exist. Please create it in your Supabase dashboard.');
      } else {
        setError('Failed to save party settings: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setSaving(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setSettings(prev => prev ? { ...prev, [name]: value } : null);
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const dateValue = e.target.value;
    setSelectedDate(dateValue);

    try {
      // Format the date to include the weekday (e.g., "Saturday, June 7, 2025")
      // Create date with time set to noon to avoid timezone issues
      const [year, month, day] = dateValue.split('-').map(Number);
      console.log('Date components:', { year, month, day });

      // Create date with time set to noon to avoid timezone issues
      // Month is 0-indexed in JavaScript Date
      const date = new Date(year, month - 1, day, 12, 0, 0);
      console.log('Created date object:', date.toString());

      const formattedDate = format(date, 'EEEE, MMMM d, yyyy');
      console.log('Formatted date:', formattedDate);

      // Update the party_date in settings
      setSettings(prev => prev ? {
        ...prev,
        party_date: formattedDate
        // We no longer need to set party_year as it's redundant
      } : null);
    } catch (e) {
      console.error('Error formatting date:', e);
    }
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name } = e.target;
    const rawValue = e.target.value.replace(/\D/g, '');
    setSettings(prev => prev ? { ...prev, [name]: rawValue } : null);
  }

  function previewGoogleMaps() {
    if (!settings) return;

    const mapsUrl = generateGoogleMapsUrl(settings);
    window.open(mapsUrl, '_blank');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <Head>
        <title>Party Settings | Sophia's Birthday</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Party Settings</h1>
              <p className="text-gray-600 mt-1">Manage location and other party details</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="text-indigo-600 hover:text-indigo-900 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-8 w-8 mx-auto text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-500">Loading party settings...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Party Location</h2>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="venue_name" className="block text-sm font-medium text-gray-700">
                        Venue Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="venue_name"
                          id="venue_name"
                          value={settings?.venue_name || ''}
                          onChange={handleChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address_line1"
                          id="address_line1"
                          value={settings?.address_line1 || ''}
                          onChange={handleChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700">
                        Apartment, suite, etc. (Optional)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address_line2"
                          id="address_line2"
                          value={settings?.address_line2 || ''}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={settings?.city || ''}
                          onChange={handleChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={settings?.state || ''}
                          onChange={handleChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">
                        ZIP / Postal Code
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="zip_code"
                          id="zip_code"
                          value={settings?.zip_code || ''}
                          onChange={handleChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Party Date & Time</h2>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="party_date" className="block text-sm font-medium text-gray-700">
                        Party Date
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="date_picker"
                          id="date_picker"
                          value={selectedDate}
                          onChange={handleDateChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Formatted date: {settings?.party_date || 'Select a date'}
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="party_time" className="block text-sm font-medium text-gray-700">
                        Start Time (e.g., 10:00 AM)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="party_time"
                          id="party_time"
                          value={settings?.party_time || ''}
                          onChange={handleChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="party_end_time" className="block text-sm font-medium text-gray-700">
                        End Time (e.g., 12:00 PM)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="party_end_time"
                          id="party_end_time"
                          value={settings?.party_end_time || ''}
                          onChange={handleChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    {/* Party year field removed as it's redundant with the date picker */}
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">SkyZone Waiver</h2>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="skyzone_waiver_url" className="block text-sm font-medium text-gray-700">
                        SkyZone Waiver URL
                      </label>
                      <div className="mt-1">
                        <input
                          type="url"
                          name="skyzone_waiver_url"
                          id="skyzone_waiver_url"
                          value={settings?.skyzone_waiver_url || ''}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="https://www.skyzone.com/waiver"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Enter the URL for the SkyZone waiver form that guests need to complete
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h2>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">
                        Contact Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="contact_name"
                          id="contact_name"
                          value={settings?.contact_name || ''}
                          onChange={handleChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                        Contact Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="contact_email"
                          id="contact_email"
                          value={settings?.contact_email || ''}
                          onChange={handleChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
                        Contact Phone
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="contact_phone"
                          id="contact_phone"
                          value={formatPhoneNumber(settings?.contact_phone || '')}
                          onChange={handlePhoneChange}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="secondary_contact_name" className="block text-sm font-medium text-gray-700">
                        Secondary Contact Name (Optional)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="secondary_contact_name"
                          id="secondary_contact_name"
                          value={settings?.secondary_contact_name || ''}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="secondary_email" className="block text-sm font-medium text-gray-700">
                        Secondary Email (Optional)
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="secondary_email"
                          id="secondary_email"
                          value={settings?.secondary_email || ''}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="secondary_phone" className="block text-sm font-medium text-gray-700">
                        Secondary Phone (Optional)
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="secondary_phone"
                          id="secondary_phone"
                          value={formatPhoneNumber(settings?.secondary_phone || '')}
                          onChange={handlePhoneChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={previewGoogleMaps}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview on Google Maps
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Settings
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
