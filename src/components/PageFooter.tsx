"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParty } from '../contexts/PartyContext';
import ContactModal from './ContactModal';

interface PageFooterProps {
  showAdminLink?: boolean;
}

const PageFooter: React.FC<PageFooterProps> = ({ showAdminLink = true }) => {
  const { partyLocation } = useParty();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="footer">
      <p>
        Questions?{' '}
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-party-purple hover:underline focus:outline-none focus:underline"
        >
          Contact Sophia's parents
        </button>
      </p>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={partyLocation?.contact_email}
        primaryPhone={partyLocation?.contact_phone}
        secondaryPhone={partyLocation?.secondary_phone}
        secondaryEmail={partyLocation?.secondary_email}
        contactName={partyLocation?.contact_name}
        secondaryContactName={partyLocation?.secondary_contact_name}
      />

      {showAdminLink && (
        <div className="admin-link">
          <Link href="/admin/dashboard">Admin Dashboard</Link>
        </div>
      )}
    </div>
  );
};

export default PageFooter;
