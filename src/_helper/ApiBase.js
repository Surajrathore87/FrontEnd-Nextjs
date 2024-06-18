import Axios from 'axios';
import Cookies from 'js-cookie';
// import { encrypt } from '_helper/EncrDecrypt';

function setHeader() {
  const _headers = {
    headers: {
      'Content-Type': 'application/json',
      'api-version': 'v1',
    },
  };
  if (Cookies.get('user_token')) {
    _headers['headers']['Authorization'] = `Bearer ${Cookies.get('user_token')}`;
  }
  if (Cookies.get('access_token')) {
    _headers['headers']['Authorization'] = `Bearer ${Cookies.get('access_token')}`;
  }

  return _headers;
}

export function get(url, params, cb) {
  Axios.get(`${process.env.BASE_API_URL}${url}`, params, setHeader()).then((response, err) => {
    // return response['data'];
    cb(response['data'], err);
  }).catch((err) => {
    cb({}, err);
  });
}

export function post(url, params, cb) {
  Axios.post(`${process.env.BASE_API_URL}${url}`, params, setHeader()).then((response, err) => {
    cb(response['data'], err);
  }).catch((err) => {
    cb(err);
  });
}


