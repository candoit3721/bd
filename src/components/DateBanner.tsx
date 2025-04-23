"use client";

import React from 'react';
import { useParty } from '../contexts/PartyContext';

const DateBanner: React.FC = () => {
  const { partyDate, partyTime, partyEndTime } = useParty();

  return (
    <div className="date-banner">
      <i className="fas fa-calendar-alt"></i>
      <p>{`${partyDate} • ${partyTime} - ${partyEndTime}`}</p>
    </div>
  );
};

export default DateBanner;
