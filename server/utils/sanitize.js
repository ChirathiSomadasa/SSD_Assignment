// utils/sanitize.js
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// basic DOM window object using jsdom
const window = new JSDOM('').window;
//  DOMPurify instance that uses the jsdom window
const DOMPurify = createDOMPurify(window);

/**
 * Sanitizes HTML input to prevent XSS attacks.
 * @param {string} dirtyHtml - The untrusted HTML input string.
 * @returns {string} The sanitized, safe HTML string.
 */
function sanitizeHtml(dirtyHtml) {
  // Sanitize the input, allowing only a safe set of tags and attributes
  return DOMPurify.sanitize(dirtyHtml);
}

function sanitizeContact(contact) {
  return {
    ...contact,
    disease: sanitizeHtml(contact.disease),
    description: sanitizeHtml(contact.description),
    solutions: contact.solutions.map(sol => ({
      ...sol,
      solution: sanitizeHtml(sol.solution)
    }))
  };
}

module.exports = { sanitizeHtml ,sanitizeContact};