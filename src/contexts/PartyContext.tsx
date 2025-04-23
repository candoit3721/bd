"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface PartyLocation {
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
  party_year?: string;
}

interface PartyContextType {
  partyLocation: PartyLocation | null;
  partyDate: string;
  partyTime: string;
  partyEndTime: string;
  partyYear: string;
  loading: boolean;
  error: string | null;
  refreshPartyDetails: () => Promise<void>;
}

// Default values
const DEFAULT_PARTY_LOCATION: PartyLocation = {
  venue_name: 'Urban Air Trampoline Park',
  address_line1: '123 Air Park Way',
  city: 'San Jose',
  state: 'CA',
  zip_code: '95134',
  contact_name: "Sophia's Parents",
  contact_email: 'henry215@gmail.com',
  google_maps_url: 'https://maps.google.com/?q=Urban+Air+Trampoline+Park+San+Jose'
};

const DEFAULT_PARTY_DATE = 'Saturday, June 7, 2025';
const DEFAULT_PARTY_TIME = '10:00 AM';
const DEFAULT_PARTY_END_TIME = '12:00 PM';
const DEFAULT_PARTY_YEAR = '2025';

const PartyContext = createContext<PartyContextType>({
  partyLocation: DEFAULT_PARTY_LOCATION,
  partyDate: DEFAULT_PARTY_DATE,
  partyTime: DEFAULT_PARTY_TIME,
  partyEndTime: DEFAULT_PARTY_END_TIME,
  partyYear: DEFAULT_PARTY_YEAR,
  loading: false,
  error: null,
  refreshPartyDetails: async () => {},
});

export const useParty = () => useContext(PartyContext);

export const PartyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [partyLocation, setPartyLocation] = useState<PartyLocation | null>(DEFAULT_PARTY_LOCATION);
  const [partyDate, setPartyDate] = useState<string>(DEFAULT_PARTY_DATE);
  const [partyTime, setPartyTime] = useState<string>(DEFAULT_PARTY_TIME);
  const [partyEndTime, setPartyEndTime] = useState<string>(DEFAULT_PARTY_END_TIME);
  const [partyYear, setPartyYear] = useState<string>(DEFAULT_PARTY_YEAR);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPartyDetails = async () => {
    setLoading(true);
    try {
      // Fetch party location from database
      const { data, error } = await supabase
        .from('party_settings')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single();

      console.log('Raw data from party_settings:', data);

      if (error) {
        console.error('Error fetching party location:', error);
        // Use default values if there's an error
        setPartyLocation(DEFAULT_PARTY_LOCATION);
        setPartyDate(DEFAULT_PARTY_DATE);
        setPartyTime(DEFAULT_PARTY_TIME);
        setPartyEndTime(DEFAULT_PARTY_END_TIME);
        setPartyYear(DEFAULT_PARTY_YEAR);
      } else if (data) {
        // Create a clean object with only the fields we need
        const validatedLocation: PartyLocation = {
          venue_name: data.venue_name || '',
          address_line1: data.address_line1 || '',
          address_line2: data.address_line2 || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zip_code || '',
          google_maps_url: data.google_maps_url || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          contact_name: data.contact_name || '',
          secondary_email: data.secondary_email || '',
          secondary_phone: data.secondary_phone || '',
          secondary_contact_name: data.secondary_contact_name || '',
          party_date: data.party_date || '',
          party_time: data.party_time || '',
          party_end_time: data.party_end_time || '',
          party_year: data.party_year || ''
        };
        console.log('Setting party location from DB:', validatedLocation);
        setPartyLocation(validatedLocation);

        // Set date and time from database if available, otherwise use defaults
        setPartyDate(data.party_date || DEFAULT_PARTY_DATE);
        setPartyTime(data.party_time || DEFAULT_PARTY_TIME);
        setPartyEndTime(data.party_end_time || DEFAULT_PARTY_END_TIME);
        setPartyYear(data.party_year || DEFAULT_PARTY_YEAR);
        console.log('Setting party date/time from DB:', {
          date: data.party_date || DEFAULT_PARTY_DATE,
          time: data.party_time || DEFAULT_PARTY_TIME,
          endTime: data.party_end_time || DEFAULT_PARTY_END_TIME,
          year: data.party_year || DEFAULT_PARTY_YEAR
        });
      } else {
        // If data is null or undefined, use empty values for location and defaults for date/time
        console.log('No data from DB, using empty location and default date/time');
        setPartyLocation({
          venue_name: '',
          address_line1: '',
          city: '',
          state: '',
          zip_code: ''
        });
        setPartyDate(DEFAULT_PARTY_DATE);
        setPartyTime(DEFAULT_PARTY_TIME);
        setPartyEndTime(DEFAULT_PARTY_END_TIME);
        setPartyYear(DEFAULT_PARTY_YEAR);
      }
    } catch (err) {
      console.error('Error in fetchPartyDetails:', err);
      setError('Failed to load party details');
      // Ensure we still have default values in case of error
      setPartyLocation(DEFAULT_PARTY_LOCATION);
      setPartyDate(DEFAULT_PARTY_DATE);
      setPartyTime(DEFAULT_PARTY_TIME);
      setPartyEndTime(DEFAULT_PARTY_END_TIME);
      setPartyYear(DEFAULT_PARTY_YEAR);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch party details immediately when the context is created
    console.log('PartyContext mounted - fetching party details');
    fetchPartyDetails();

    // Set up an interval to refresh the data every 5 minutes
    const intervalId = setInterval(() => {
      console.log('PartyContext interval - refreshing party details');
      fetchPartyDetails();
    }, 5 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Force a refresh when the window gains focus
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleFocus = () => {
        console.log('Window focused - refreshing party details');
        fetchPartyDetails();
      };

      window.addEventListener('focus', handleFocus);

      return () => {
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, []);

  const refreshPartyDetails = async () => {
    await fetchPartyDetails();
  };

  return (
    <PartyContext.Provider
      value={{
        partyLocation,
        partyDate,
        partyTime,
        partyEndTime,
        partyYear,
        loading,
        error,
        refreshPartyDetails,
      }}
    >
      {children}
    </PartyContext.Provider>
  );
};
