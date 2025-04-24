import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import PartyDetails from '../components/PartyDetails';
import PhotoGallery from '../components/PhotoGallery';
import PageFooter from '../components/PageFooter';
import Decorations from '../components/Decorations';
import DateBanner from '../components/DateBanner';
import { useParty } from '../contexts/PartyContext';
import { formatPhoneNumber } from '../utils/format';

function formatDateForCalendar(date: string, startTime: string, endTime: string): string {
  // Example input: "Saturday, June 7, 2025" "2:00 PM" "4:30 PM"
  // Parse the date
  const [, month, day, year] = date.match(/(\w+)\s+(\d+),\s+(\d+)/) || [];

  // Convert to Date objects
  const startDate = new Date(`${month} ${day}, ${year} ${startTime}`);
  const endDate = new Date(`${month} ${day}, ${year} ${endTime}`);

  // Format for Google Calendar (YYYYMMDDTHHMMSSZ)
  const formatToCalendarString = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d+/g, '');
  };

  return `${formatToCalendarString(startDate)}/${formatToCalendarString(endDate)}`;
}

export default function InvitationPage() {
  const router = useRouter();
  const { id } = router.query;

  const [guest, setGuest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null);
  const [editingResponse, setEditingResponse] = useState(false);
  // We'll still keep this state for backward compatibility during refactoring
  const [partyLocation, setPartyLocation] = useState<any>(null);
  // Track if this is a fresh acceptance to show the special confirmation message
  const [justAccepted, setJustAccepted] = useState(false);

  // Get party details from context
  const { partyLocation: contextPartyLocation, partyDate, partyTime, partyEndTime } = useParty();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  useEffect(() => {
    if (id) {
      fetchGuest(id as string);
      fetchPartyLocation();
    }
  }, [id]);

  // Reset justAccepted flag when component is mounted
  useEffect(() => {
    // This ensures the special confirmation message only shows right after accepting
    const timer = setTimeout(() => {
      if (justAccepted) {
        setJustAccepted(false);
      }
    }, 5000); // Reset after 5 seconds to ensure user sees the message

    return () => clearTimeout(timer);
  }, [justAccepted]);

  async function fetchGuest(guestId: string) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', guestId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setGuest(data);
        if (data.status === 'ACCEPTED' || data.status === 'DECLINED') {
          setRsvpStatus(data.status);
        }
      } else {
        setError('Invitation not found');
      }
    } catch (error) {
      console.error('Error fetching guest:', error);
      setError('Error loading invitation');
    } finally {
      setLoading(false);
    }
  }

  // This function is kept for backward compatibility
  async function fetchPartyLocation() {
    try {
      // Always use the party context data, even if it's the default
      if (contextPartyLocation) {
        console.log('Using party location from context:', contextPartyLocation);
        setPartyLocation(contextPartyLocation);
      } else {
        console.log('No party location in context, fetching from database directly');
        // Fallback to direct database query if context doesn't have data yet
        const { data, error } = await supabase
          .from('party_settings')
          .select('*')
          .order('id', { ascending: true })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching party location:', error);
          throw error;
        } else if (data) {
          console.log('Got party location from DB:', data);
          setPartyLocation(data);
        }
      }
    } catch (error) {
      console.error('Error setting party location from context:', error);
      throw error;
    }
  }

  // Create confetti effect
  const createConfetti = () => {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);

    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confetti.style.animationDelay = Math.random() * 2 + 's';

      // Random colors
      const colors = ['#9733EE', '#FF4E9D', '#4FB3FF', '#FFD700'];
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      // Random shapes
      const shapes = ['circle', 'triangle', 'square'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      if (shape === 'circle') {
        confetti.style.borderRadius = '50%';
      } else if (shape === 'triangle') {
        confetti.style.width = '0';
        confetti.style.height = '0';
        confetti.style.borderLeft = '5px solid transparent';
        confetti.style.borderRight = '5px solid transparent';
        confetti.style.borderBottom = '10px solid ' + colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = 'transparent';
      }

      confettiContainer.appendChild(confetti);

      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }

    // Remove container after all animations
    setTimeout(() => {
      confettiContainer.remove();
    }, 7000);
  };

  const handleRSVP = async (status: 'ACCEPTED' | 'DECLINED') => {
    setLoading(true);
    try {
      // First, update the status immediately
      const { error } = await supabase
        .from('guests')
        .update({ status })
        .match({ id: id as string });

      if (error) throw error;

      // Update local state
      setRsvpStatus(status);
      if (guest) {
        setGuest({
          ...guest,
          status
        });
      }

      // If accepting, always show contact form to allow updating contact info
      if (status === 'ACCEPTED') {
        // Pre-populate contact fields if guest already has contact info
        setContactEmail(guest?.email || '');
        setContactPhone(guest?.phone || '');
        setShowContactForm(true);
      } else {
        setEditingResponse(false); // Reset editing state after successful update
      }

      // Set justAccepted flag if the status is ACCEPTED
      if (status === 'ACCEPTED') {
        setJustAccepted(true);

        // Create confetti effect for accepted RSVPs
        setTimeout(() => {
          createConfetti();
        }, 300);
      } else {
        setJustAccepted(false);
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
      alert('There was an error updating your RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Only update contact info, status is already saved
      const { error } = await supabase
        .from('guests')
        .update({
          email: contactEmail || null,
          phone: contactPhone || null
        })
        .match({ id: id as string });

      if (error) throw error;

      // Update the guest object with the new contact info
      if (guest) {
        setGuest({
          ...guest,
          email: contactEmail || null,
          phone: contactPhone || null
        });
      }

      // Hide contact form
      setShowContactForm(false);
      setEditingResponse(false);
      setJustAccepted(true); // Set the flag to show the special confirmation message
    } catch (error) {
      console.error('Error updating contact info:', error);
      alert('There was an error saving your contact information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipContact = async () => {
    setLoading(true);
    try {
      // Just update status without contact info
      const { error } = await supabase
        .from('guests')
        .update({ status: 'ACCEPTED' })
        .match({ id: id as string });

      if (error) throw error;

      // Update the guest object with the new status
      if (guest) {
        setGuest({
          ...guest,
          status: 'ACCEPTED'
        });
      }

      // Hide contact form and show confirmation
      setShowContactForm(false);
      setEditingResponse(false); // Make sure editing mode is off
      setRsvpStatus('ACCEPTED');
      setJustAccepted(true); // Set the flag to show the special confirmation message

      // Create confetti effect
      setTimeout(() => {
        createConfetti();
      }, 300);
    } catch (error) {
      console.error('Error updating RSVP:', error);
      alert('There was an error updating your RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Store raw value but display formatted
    const rawValue = e.target.value.replace(/\D/g, '');
    setContactPhone(rawValue);
  };

  // Only show loading state if we're loading the guest data
  // We don't need to wait for party context to load since it has default values
  if (loading && !guest) {
    return (
      <div className="min-h-screen flex justify-center bg-party-cream pt-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-party-pink mb-4"></div>
          <h1 className="text-2xl font-bold text-party-purple mb-2">Loading...</h1>
          <p className="text-gray-600">Preparing your invitation</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center bg-party-cream p-4 pt-8">
        <div className="card max-w-md w-full">
          <div className="header rounded-t-lg">
            <h1 className="font-fredoka">Sophia's 10th Birthday!</h1>
            <p>Join us for a fun celebration!</p>
          </div>

          <div className="content">
            <div className="text-center mb-8">
              <h2 className="text-3xl text-party-purple mb-4">Oops!</h2>
              <p className="text-lg text-gray-700 mb-4">We couldn't find this invitation</p>
              <p className="text-sm text-gray-500 mb-6">{error}</p>

              <div className="mt-8">
                <p className="text-gray-600 mb-4">You can still see the party details below!</p>
              </div>
            </div>

            {/* Date Banner */}
            <DateBanner />

            {/* Party Details */}
            <PartyDetails />

            <div className="mt-8 text-center">
              <a href="/" className="btn btn-yes">Go to Homepage</a>
            </div>
          </div>

          <PageFooter showAdminLink={false} />
        </div>
      </div>
    );
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL;

  return (
    <div className="min-h-screen bg-party-cream relative overflow-hidden">
      <Head>
        <title>Sophia's Birthday Party - RSVP</title>
        <meta name="description" content="RSVP for Sophia's 10th Birthday Party" />
        <meta property="og:title" content="Sophia's Birthday Party - RSVP" />
        <meta property="og:description" content="Please let us know if you can join Sophia's 10th Birthday Party!" />
        <meta property="og:url" content={`${baseUrl}/${id}`} />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      {/* Floating decorations */}
      <Decorations />

      <div className="flex justify-center min-h-screen p-4 pt-8">
        <div className="card max-w-md w-full">
          {/* Header */}
          <PageHeader />

          <div className="content">
            {/* Greeting */}
            <div className="greeting">
              <h2>Hi <span className="name">{guest?.name || 'Friend'}</span>!</h2>
              <p>You're invited to Sophia's birthday party at SkyZone!</p>
            </div>

            {/* Time */}
            <DateBanner />

            {/* Party Details */}
            <PartyDetails />

            {/* Confirmation Messages */}
            {rsvpStatus && !editingResponse && (
              <div>
                {rsvpStatus === 'ACCEPTED' ? (
                  <div className="confirmation yes">
                    <i className="fas fa-check-circle"></i>
                    {justAccepted ? (
                      <>
                        <p>Awesome! Your spot is confirmed!</p>
                        <p className="secondary">{`We look forward to celebrating with you on ${partyDate}.`}</p>
                      </>
                    ) : (
                      <>
                        <p>Thank you for your RSVP!</p>
                        <p className="secondary">{`We're excited to celebrate with you on ${partyDate}!`}</p>
                      </>
                    )}
                    <div className="flex flex-col space-y-3 mt-4">
                      <a
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sophia's+10th+Birthday+Party&dates=${encodeURIComponent(
                          formatDateForCalendar(partyDate, partyTime, partyEndTime)
                        )}&details=${encodeURIComponent(
                          `Join us for Sophia's birthday celebration at ${contextPartyLocation?.venue_name}!

Friendly reminder: To save time on the day, please fill out the SkyZone waiver online before the party: ${contextPartyLocation?.skyzone_waiver_url || 'https://www.skyzone.com/waiver'}

Location: ${contextPartyLocation?.venue_name}, ${contextPartyLocation?.address_line1}, ${contextPartyLocation?.city}, ${contextPartyLocation?.state} ${contextPartyLocation?.zip_code}
                          `
                        )}&location=${encodeURIComponent(
                          `${contextPartyLocation?.venue_name}, ${contextPartyLocation?.address_line1}, ${contextPartyLocation?.city}, ${contextPartyLocation?.state} ${contextPartyLocation?.zip_code}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="calendar-link"
                      >
                        <i className="fas fa-calendar-plus"></i>
                        Add to Calendar
                      </a>

                      {contextPartyLocation?.skyzone_waiver_url && (
                        <a
                          href={contextPartyLocation.skyzone_waiver_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="waiver-link"
                        >
                          <i className="fas fa-file-signature"></i>
                          Sign SkyZone Waiver
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="confirmation no">
                    <i className="fas fa-heart"></i>
                    <p>Thanks for letting us know. We'll miss you!</p>
                    <p className="secondary">You can still change your mind if your plans change.</p>
                  </div>
                )}
                <div className="mt-6 text-center">
                  {rsvpStatus === 'ACCEPTED' ? (
                    <button
                      onClick={() => {
                        setEditingResponse(true);
                        setShowContactForm(false);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200"
                    >
                      <i className="fas fa-edit mr-2 text-gray-500"></i>
                      Need to Update?
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingResponse(true);
                        setShowContactForm(false);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-party-purple hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-party-purple transition-all duration-200"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Change My Response
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Contact Form */}
            {showContactForm && (
              <div className="contact-form-section bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">Contact Information</h3>
                <p className="text-gray-600 mb-4">Would you like to provide or update your contact information? This helps us reach you with any party updates.</p>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="shadow-sm focus:ring-party-purple focus:border-party-purple block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="name@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="contactPhone"
                      value={formatPhoneNumber(contactPhone)}
                      onChange={handlePhoneChange}
                      className="shadow-sm focus:ring-party-purple focus:border-party-purple block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div className="pt-4 flex flex-col space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-yes"
                    >
                      <i className="fas fa-check"></i>
                      {loading ? 'Saving...' : 'Save Contact Info'}
                    </button>

                    <button
                      type="button"
                      onClick={handleSkipContact}
                      disabled={loading}
                      className="btn btn-cancel"
                    >
                      Skip for now
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* RSVP Section */}
            {(!rsvpStatus || editingResponse) && guest && !showContactForm && (
              <div className="rsvp-section">
                <h3 className="rsvp-title">{editingResponse ? 'Change Your Response' : 'Will you join us?'}</h3>
                <div className="rsvp-buttons">
                  <button
                    className="btn btn-yes"
                    onClick={() => handleRSVP('ACCEPTED')}
                    disabled={loading}
                  >
                    <i className="fas fa-check"></i>
                    {loading ? 'Submitting...' : 'Yes, I\'ll be there!'}
                  </button>
                  <button
                    className="btn btn-no"
                    onClick={() => handleRSVP('DECLINED')}
                    disabled={loading}
                  >
                    <i className="fas fa-times"></i>
                    {loading ? 'Submitting...' : 'Sorry, can\'t make it'}
                  </button>

                  {editingResponse && (
                    <button
                      className="btn btn-cancel mt-3"
                      onClick={() => setEditingResponse(false)}
                      disabled={loading}
                    >
                      <i className="fas fa-arrow-left"></i>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            <PhotoGallery />
          </div>

          <PageFooter />
        </div>
      </div>
    </div>
  );
}
