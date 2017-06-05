import axios from 'axios';
import logger from 'logger.js';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // TODO(asclines): Move this to env
  timeout: 5000,
});
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export const post = (endpoint, data, onSuccess, onError) => {
  instance.post(endpoint, data)
    .then((res) => {
      onSuccess(res.data);
    })
    .catch((err) => {
      logger.error(err);
      onError(err);
    });
};

// Because delete is a non fun word to use
export const del = (endpoint, data, onSuccess, onError) => {
  instance.delete(endpoint, data)
    .then((res) => {
      onSuccess(res);
    })
    .catch((err) => {
      logger.error(err);
      onError(err);
    });
};

export default instance;
