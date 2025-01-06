import axios from 'axios';
import logger from './logService';
import { toast } from 'react-toastify';

// axios.defaults.baseURL = 'http://localhost:3800/api';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    logger.log(error);
    toast.error('An unexpected error occurrred.');
  }
  return Promise.reject(error);
});

export function setJwt(jwt) {
  axios.defaults.headers.common['x-auth-token'] = jwt;
}

var http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};

export default http;
