// src/utils/validators.js

// Postal code regex per country
export const postalPatterns = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,
    GB: /^[A-Za-z]{1,2}\d{1,2} ?\d[A-Za-z]{2}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    AU: /^\d{4}$/,
    IN: /^\d{6}$/,
  };
  
  // Step 1: first & last name
  export function validateStep1({ first, last }) {
    const errors = {};
    if (!first.trim()) errors.first = 'First name is required';
    if (!last.trim()) errors.last = 'Last name is required';
    return errors;
  }
  
  // Step 2: username, contact, address, street, postal
  export function validateStep2({
    username,
    contactCode,
    contact,
    address,
    street,
    postalCode,
    country,
  }) {
    const errors = {};
    if (!username.trim()) errors.username = 'Username is required';
    if (!/^\+?\d{1,4}$/.test(contactCode))
      errors.contactCode = 'Invalid country code';
    if (!/^\d{7,15}$/.test(contact))
      errors.contact = 'Invalid phone number';
    if (!address.trim()) errors.address = 'Address is required';
    if (!street.trim()) errors.street = 'Street is required';
    const pattern = postalPatterns[country];
    if (!pattern.test(postalCode))
      errors.postalCode = `Invalid postal code for ${country}`;
    return errors;
  }
  
  // Step 3: email and passwords
  export function validateStep3({ email, password, confirm }) {
    const errors = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      errors.email = 'Invalid email address';
    if (password.length < 8)
      errors.password = 'Password must be at least 8 characters';
    if (password !== confirm)
      errors.confirm = 'Passwords must match';
    return errors;
  }
  