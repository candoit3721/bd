"use client";

// Client-side components
import PageHeader from "../components/PageHeader";
import PartyDetails from "../components/PartyDetails";
import PhotoGallery from "../components/PhotoGallery";
import PageFooter from "../components/PageFooter";
import Decorations from "../components/Decorations";
import DateBanner from "../components/DateBanner";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating decorations */}
      <Decorations />

      <div className="flex justify-center min-h-screen p-4 pt-8">
        <div className="card max-w-md w-full">
          {/* Header */}
          <PageHeader />

          <div className="content">
            {/* Date Banner */}
            <DateBanner />

            {/* Party Details */}
            <PartyDetails showActivities={true} />

            {/* RSVP Section */}
            <div className="rsvp-section">
              <h3 className="rsvp-title">RSVP</h3>
              <p className="mb-4">Please scan the QR code on your invitation to access your personalized RSVP page!</p>
              <div className="flex justify-center items-center gap-4 mb-4">
                <i className="fas fa-mobile-alt text-4xl text-party-purple"></i>
                <i className="fas fa-arrow-right text-2xl text-gray-400"></i>
                <i className="fas fa-qrcode text-4xl text-party-purple"></i>
                <i className="fas fa-arrow-right text-2xl text-gray-400"></i>
                <div className="flex flex-col items-center">
                  <i className="fas fa-check-circle text-4xl text-green-500"></i>
                  <span className="text-xs mt-1">RSVP</span>
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <PhotoGallery />
          </div>

          <PageFooter />
        </div>
      </div>
    </div>
  );
}
