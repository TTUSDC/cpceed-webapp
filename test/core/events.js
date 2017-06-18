const categories = [
  'misc',
  'staff',
  'professor',
  'outreach',
  'other',
  'mentor',
  'firstworkshops',
  'firstother',
  'community',
  'career',
];

const locations = [
  'Library',
  'CS Building',
  'Mathematics',
  'Starbucks',
];

const titles = [
  'Studying',
  'Community Service',
  'Partying',
];

const descriptions = [
  'Studying all day, partying all night',
  'Making trash',
  'Cleaning up trash',
  'Party all day, study all night',
  'Begging teacher for an A',
  'Claiming the teacher is the reason I dont have an A',
  'Demanding teacher for an A',
  'Failing',
  'Changing majors',
  'Dropping out',
  'Do you want fries with that?',
];

/**
 * Returns a random item from an array
 *
 * @param {Object} items - The array of items
 * @returns {Object} - A random item in items
 */
const randomItem = items => items[Math.floor(Math.random() * items.length)];

/**
 * Helper method to generate event data to create an event.
 * Generates filler data for all missing data.
 *
 * @param {string} creator - User UID
 * @param {Object} [data] - Override filler data with this.
 * @property {string} [data.category]
 * @property {Date} [data.datetime]
 * @property {string} [data.location]
 * @property {string} [data.title]
 * @property {string} [data.description]
 */
export const generateEventData = (creator, data) => {
  const template = data || {};
  console.log('Generating event data');
  return {
    creator,
    category: template.category || randomItem(categories),
    datetime: template.datetime || new Date(),
    location: template.location || randomItem(locations),
    title: template.title || randomItem(titles),
    description: template.description || randomItem(descriptions),
  };
};

module.exports = { generateEventData };
