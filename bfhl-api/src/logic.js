const { USER } = require('./config');

/**
 * Generates the user_id based on fullName and dob:
 * - lowercase full name
 * - trim spaces
 * - replace spaces with underscores
 * - append underscore + dob
 */
function generateUserId(fullName, dob) {
  const namePart = (fullName || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
  const dobPart = (dob || "").trim();
  return `${namePart}_${dobPart}`;
}

/**
 * Checks if value is a pure integer string.
 * Regex: /^-?\d+$/
 */
function isNumberString(value) {
  return /^-?\d+$/.test(String(value));
}

/**
 * Checks if value is alphabet-only.
 * Regex: /^[a-zA-Z]+$/
 */
function isAlphabetString(value) {
  return /^[a-zA-Z]+$/.test(String(value));
}

/**
 * Processes the input data array, filtering numbers and alphabets.
 * Order is preserved, and items that don't match are ignored.
 */
function processData(data) {
  const numbers = [];
  const alphabets = [];

  if (Array.isArray(data)) {
    for (const item of data) {
      if (item === null || item === undefined) continue;
      const itemStr = String(item);
      if (isNumberString(itemStr)) {
        numbers.push(itemStr);
      } else if (isAlphabetString(itemStr)) {
        alphabets.push(itemStr);
      }
    }
  }

  return { numbers, alphabets };
}

/**
 * Builds the final response payload structure.
 */
function buildResponse(data, isSuccess) {
  const { numbers, alphabets } = isSuccess ? processData(data) : { numbers: [], alphabets: [] };
  
  return {
    is_success: isSuccess,
    user_id: generateUserId(USER.fullName, USER.dob),
    email: USER.email,
    roll_number: USER.rollNumber,
    numbers,
    alphabets
  };
}

module.exports = {
  generateUserId,
  isNumberString,
  isAlphabetString,
  processData,
  buildResponse
};
