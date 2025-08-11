export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateFileSize = (size: number, maxSize: number = 10 * 1024 * 1024): boolean => {
  return size <= maxSize;
};

export const validateFileType = (contentType: string, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(contentType);
};

export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};