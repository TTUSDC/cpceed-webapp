import axios from 'axios';
import logger from 'logger/logger';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', //TODO(asclines): Move this to env
  timeout: 1000,
});
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export const post = (endpoint, data, onSuccess, onError) => {
  instance.post(endpoint,data)
    .then((res) => {
      logger.info(res.data, 'Recieved data');
      onSuccess(res.data);
    })
    .catch((err) => {
      logger.error(err);
      onError(err);
    })
}

export default instance;
