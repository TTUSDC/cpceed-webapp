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
export class Connection {

  constructor() {
    this.config = {
      data: {},
      params: {},
    };

    this.url = '/';
    this.method = 'get';
  }

  setMethod(method){
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
    instance.get(this.url, this.config).then(onSuccess).catch((err) => {
      errorHandler(err, onError);
    });
  }
}
/**
 * Generic method to POST to API
 *
 * @param {string} endpoint - URL after /api
 * @param {Object} data - Data that goes into the body
 * @param {Object} params - Data that goes into the query
 * @param {OnApiCallFinished} onSuccess - Called with response body
 * @param {OnApiCallFinished} onError - Called with response error
 */
export const post = (endpoint, data, params, onSuccess, onError) => {
  const config = {
    data,
    params,
  };

  instance.post(endpoint, config)
    .then((res) => {
      onSuccess(res.data);
    })
    .catch((err) => { errorHandler(err, onError); });
};

/**
 * Generic method to DELETE to API
 * This method is `del` instead of `delete` to make Node.JS happy
 *
 * @param {string} endpoint - URL after /api
 * @param {Object} data - Data that goes into the body
 * @param {Object} params - Data that goes into the query
 * @param {OnApiCallFinished} onSuccess - Called with response body
 * @param {OnApiCallFinisihed} onError - Called with response err
 */
export const del = (endpoint, data, params, onSuccess, onError) => {
  const config = {
    data,
    params,
  };

  instance.delete(endpoint, config)
    .then((res) => {
      onSuccess(res);
    })
    .catch((err) => {
      logger.error(err);
      onError(err);
    });
};

/**
 * Generic method to PUT to API
 *
 * @param {string} endpoint - URL after /api
 * @param {Object} data - Data that goes into the body
 * @param {Object} params - Data that goes into the query
 * @param {OnApiCallFinished} onSuccess - Called with response body
 * @param {OnApiCallFinisihed} onError - Called with response err
 */
export const put = (endpoint, data, params, onSuccess, onError) => {
  const config = {
    data,
    params,
  };

  instance.put(endpoint, config)
    .then((res) => {
      onSuccess(res);
    })
  .catch((err) => { errorHandler(err, onError); });
};

/**
 * Generic method to GET to API
 *
 * @param {string} endpoint - URL after /api
 * @param {Object} data - Data that goes into the body
 * @param {Object} params - Data that goes into the query
 * @param {OnApiCallFinished} onSuccess - Called with response body
 * @param {OnApiCallFinisihed} onError - Called with response err
 */
export const get = (endpoint, data, params, onSuccess, onError) => {
  const config = {
    data,
    params,
  };

  instance.get(endpoint, config).then(onSuccess).catch((err) => {
    errorHandler(err, onError);
  });
};

export default Connection;
