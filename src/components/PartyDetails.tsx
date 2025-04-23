"use client";

import React from 'react';
import { useParty } from '../contexts/PartyContext';

interface PartyDetailsProps {
  showLocation?: boolean;
  showActivities?: boolean;
  showWhatToBring?: boolean;
}

const PartyDetails: React.FC<PartyDetailsProps> = ({
  showLocation = true,
  showActivities = true,
  showWhatToBring = false,
}) => {
  const { partyLocation, partyDate, partyTime, partyEndTime, refreshPartyDetails } = useParty();

  // Force refresh party details when component mounts
  React.useEffect(() => {
    console.log('PartyDetails component mounted - refreshing party details');
    refreshPartyDetails();

    // Set a timeout to try again after a short delay in case the first attempt fails
    const timeoutId = setTimeout(() => {
      console.log('PartyDetails component - trying refresh again after delay');
      refreshPartyDetails();
    }, 1000);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debug: Log party location data
  React.useEffect(() => {
    console.log('PartyDetails component - partyLocation updated:', partyLocation);
  }, [partyLocation]);

  return (
    <div className="party-details-section">
      <h3 className="section-title">
        <i className="fas fa-info-circle"></i> Party Details
      </h3>

      {/* <div className="detail-item">
        <i className="fas fa-calendar-alt"></i>
        <div className="detail-text">
          <strong>When</strong>
          <span>{`${partyDate} • ${partyTime} - ${partyEndTime}`}</span>
        </div>
      </div> */}

      {showLocation && (
        <div className="detail-item">
          <i className="fas fa-map-marker-alt location-icon"></i>
          <div className="detail-text">
            {/* Use venue_name from database */}
            <strong>
              {partyLocation && partyLocation.venue_name ? partyLocation.venue_name : 'Venue information unavailable'}
            </strong>
            <span>
              {/* Always try to use DB data first, with fallbacks for individual fields */}
              {/* Force use of database values and log for debugging */}
              {(() => {
                console.log('Rendering address with partyLocation:', partyLocation);
                if (partyLocation && Object.keys(partyLocation).length > 0) {
                  return (
                    <>
                      {partyLocation.address_line1 || ''}
                      {partyLocation.address_line2 && <>, {partyLocation.address_line2}</>}
                      {partyLocation.city ? `, ${partyLocation.city}` : ''}
                      {partyLocation.state ? `, ${partyLocation.state}` : ''}
                      {partyLocation.zip_code || ''}
                    </>
                  );
                } else {
                  return 'Address information unavailable';
                }
              })()
              }
            </span>
            {partyLocation && (partyLocation.google_maps_url || (partyLocation.venue_name && partyLocation.city)) && (
              <a
                href={partyLocation.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(partyLocation.venue_name + ' ' + partyLocation.city + ' ' + partyLocation.state)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                <i className="fas fa-directions"></i> Get Directions
              </a>
            )}
          </div>
        </div>
      )}

      {showActivities && (
        <div className="detail-item">
          <i className="fas fa-list-ul"></i>
          <div className="detail-text">
            <strong>Activities</strong>
            <span>Trampolines, Cake, Games & Fun!</span>
          </div>
        </div>
      )}

      {showWhatToBring && (
        <div className="detail-item">
          <i className="fas fa-suitcase"></i>
          <div className="detail-text">
            <strong>What to Wear</strong>
            <span>Comfortable clothing for jumping</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyDetails;
