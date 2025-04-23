import React from 'react';
import { formatPhoneNumber } from '../utils/format';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  secondaryEmail?: string;
  contactName?: string;
  secondaryContactName?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  email,
  primaryPhone,
  secondaryPhone,
  secondaryEmail,
  contactName,
  secondaryContactName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        <h2 className="text-xl font-medium text-gray-800 mb-6">Contact Information</h2>
        
        <div className="space-y-6">
          {/* Primary Contact */}
          {(contactName || email || primaryPhone) && (
            <div>
              {contactName && (
                <div className="font-medium text-lg text-gray-800 mb-3">{contactName}</div>
              )}
              <div className="grid gap-3">
                {email && (
                  <a href={`mailto:${email}`} className="flex items-center text-gray-600 hover:text-party-purple transition-colors">
                    <i className="fas fa-envelope w-6"></i>
                    <span className="ml-3">{email}</span>
                  </a>
                )}
                {primaryPhone && (
                  <a href={`tel:${primaryPhone}`} className="flex items-center text-gray-600 hover:text-party-purple transition-colors">
                    <i className="fas fa-phone w-6"></i>
                    <span className="ml-3">{formatPhoneNumber(primaryPhone)}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Secondary Contact */}
          {(secondaryContactName || secondaryEmail || secondaryPhone) && (
            <div className="pt-4 border-t border-gray-200">
              {secondaryContactName && (
                <div className="font-medium text-lg text-gray-800 mb-3">{secondaryContactName}</div>
              )}
              <div className="grid gap-3">
                {secondaryEmail && (
                  <a href={`mailto:${secondaryEmail}`} className="flex items-center text-gray-600 hover:text-party-purple transition-colors">
                    <i className="fas fa-envelope w-6"></i>
                    <span className="ml-3">{secondaryEmail}</span>
                  </a>
                )}
                {secondaryPhone && (
                  <a href={`tel:${secondaryPhone}`} className="flex items-center text-gray-600 hover:text-party-purple transition-colors">
                    <i className="fas fa-phone w-6"></i>
                    <span className="ml-3">{formatPhoneNumber(secondaryPhone)}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ContactModal;