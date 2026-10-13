const Faculty = require('../models/Faculty');

const DEFAULT_PASSWORD = 'password@123';

/**
 * Generate a unique official CampusGrid email for a faculty member based on name
 * e.g. "Dr. Stephen Hawking" -> "stephen@campusgrid.com"
 * If duplicate exists: "stephen01@campusgrid.com", "stephen02@campusgrid.com"
 */
const generateOfficialEmail = async (fullName) => {
  // Clean name: remove prefixes like Dr., Prof., Mr., Mrs.
  const cleaned = fullName
    .replace(/^(dr\.|prof\.|mr\.|mrs\.|ms\.)\s+/i, '')
    .trim()
    .toLowerCase();

  const parts = cleaned.split(/\s+/).filter(Boolean);
  const baseName = parts[0].replace(/[^a-z0-9]/g, '');

  let candidate = `${baseName}@campusgrid.com`;
  let exists = await Faculty.findOne({ officialEmail: candidate });

  if (!exists) {
    return candidate;
  }

  // Handle collisions with 2-digit zero-padded numbers: stephen01, stephen02...
  let counter = 1;
  while (exists) {
    const pad = counter < 10 ? `0${counter}` : `${counter}`;
    candidate = `${baseName}${pad}@campusgrid.com`;
    exists = await Faculty.findOne({ officialEmail: candidate });
    counter++;
  }

  return candidate;
};

module.exports = {
  DEFAULT_PASSWORD,
  generateOfficialEmail
};
