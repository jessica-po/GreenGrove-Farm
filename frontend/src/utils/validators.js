
/**
 * validateEmail function to validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email && re.test(email.toLowerCase());
  };
  
/**
 * validatePhone function to validate phone format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const validatePhone = (phone) => {
const re = /^\+?[\d\s-()]{10,}$/;
return !phone || re.test(phone);
};