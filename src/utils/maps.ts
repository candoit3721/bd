/**
 * Generates a Google Maps URL from an address
 * @param address The address components
 * @returns A Google Maps URL for the address
 */
export function generateGoogleMapsUrl(address: {
  venue_name?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
}): string {
  // Format the address for the URL
  const addressParts = [
    address.address_line1,
    address.address_line2,
    address.city,
    address.state,
    address.zip_code
  ].filter(Boolean); // Remove empty values
  
  const formattedAddress = encodeURIComponent(addressParts.join(', '));
  
  // Generate the Google Maps URL
  return `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
}

/**
 * Formats an address for display
 * @param address The address components
 * @returns A formatted address string
 */
export function formatAddress(address: {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
}): string[] {
  const lines = [
    address.address_line1,
    address.address_line2,
    `${address.city}, ${address.state} ${address.zip_code}`
  ].filter((line): line is string => Boolean(line)); // Type predicate to ensure string[]
  
  return lines;
}
