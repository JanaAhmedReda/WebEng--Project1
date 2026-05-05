export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
export const isRequired = (value) => value !== null && value !== undefined && value !== '';
export const isNonNegativeInteger = (value) => Number.isInteger(Number(value)) && Number(value) >= 0;
export const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;