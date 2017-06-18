import axios from 'axios';
import logger from 'logger/logger';

/**
 * The connection information for the server hosting the API.
 *
 * @param {string} baseURL - Base URL including the /api endpoint
 * @param {number} timeout - Time in ms that each call should take
 */
const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // TODO(asclines): Move this to env
  timeout: 5000,
});

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/**
 * Promise callback for when API call finishes
 *
 * @typedef {function} OnApiCallFinished
 * @param {Object} - Response from API
 * @param {number} - Response status code
 */

/**
 * Handles errors from API and logs them
 *
 * @param {Object} err - The error object recieved from Axios
 * @param {OnApiCallFinished} onError - Called with the correct error object
 */
const errorHandler = (err, onError) => {
  if (err.response) {
        // Server responded with a status code outside 2xx range.
    logger.error(err.response, 'Response error');
  } else if (err.request) {
        // No response recieved
    logger.error(err.request, 'No response recieved');
  } else {
        // Who knows
    logger.error(err.message, 'Request error');
  }
  onError(err);
};

/**
 * This class allows for easy building of a request to the API.
 *
 * @example
 * new Connection()
 *  .post()
 *  .users()
 *  .data(newUser)
 *  .call(() => {
 *    console.log('Connection succeeded!');
 *   }, () => {
 *    console.log('Connection failed!');
 *   });
 */
export default class Connection {

  constructor() {
    this.config = {
      data: {},
      params: {},
    };

    this.status = 0;

    this.url = '/';
    this.method = 'get';
  }

  responseHandler(response, onSuccess) {
    onSuccess(response.data);
    this.response = response;
  }

  setMethod(method) {
    this.method = method;
    return this;
  }

  setUrl(url) {
    this.url = url;
    return this;
  }

  post() { return this.setMethod('post'); }

  del() { return this.setMethod('delete'); }

  put() { return this.setMethod('put'); }

  get() { return this.setMethod('get'); }

  users() { return this.setUrl('/users'); }

  auth() { return this.setUrl('/auth'); }

  events() { return this.setUrl('/events'); }

  /**
   * Sets the body of the request object
   *
   * @param {Object} body
   * @returns {Connection}
   */
  data(body) {
    this.config.data = body;
    return this;
  }

  /**
   * Sets the query parameters of the request object
   *
   * @param query
   * @returns {Connection}
   */
  params(query) {
    this.config.params = query;
    return this;
  }

  call(onSuccess, onError) {
    this.config.url = this.url;
    this.config.method = this.method;
    instance(this.config).then((res) => {
      this.responseHandler(res, onSuccess);
    }).catch((err) => {
      errorHandler(err, onError);
    });
  }
}

