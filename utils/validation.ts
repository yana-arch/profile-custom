export const isValidUrl = (urlString: string): boolean => {
  // Allow empty strings, as required validation is separate.
  if (!urlString) return true; 
  try {
    // Check if the URL is valid and has a protocol
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

export const isValidEmail = (emailString: string): boolean => {
  if (!emailString) return true; // Allow empty fields
  // A simple regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailString);
};
