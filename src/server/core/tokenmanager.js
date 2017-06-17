/**
 * Key used in localstorage where value is the token
 */
export const tokenKey = 'sessiontoken';

/**
 * Decodes a token to get the stored key, value pairs inside
 *
 * @param {string} token - The JWT token to be decoded
 * @return {Object} - The result of the decoding
 * @property {string} email
 * @property {string} role - `student` or `admin`
 * @property {boolean} isApproved
 * @property {string} id - UID of user
 */
export function decode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

/**
 * Saves the token to local storage
 *
 * @param {string} token - The token to be saved
 */
export function saveToken(token) {
  localStorage.setItem(tokenKey, token);
}

/**
 * Removes the token from local storage
 * Useful for when logging out
 */
export function removeToken() {
  localStorage.removeItem(tokenKey);
}

/**
 * Retrieves the token from localstorage.
 *
 * @return {string} - Token, null if none
 */
export function getToken() {
  return localStorage.getItem(tokenKey);
}
