import axios from 'axios';
import { get, post } from '../_helper/ApiBase';
import Cookies from 'js-cookie';

export function setHeader() {
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

export const callAPI = (method, url, params, cb) => {
  if (method == 'GET') {
    get(url, {
      params: params, paramsSerializer: (params) => {
        // Sample implementation of query string building
        let result = '';
        Object.keys(params).forEach((key) => {
          result += `${key}=${encodeURIComponent(params[key])}&`;
        });
        return result.substr(0, result.length - 1);
      },
    }, (response) => {
      try {
        let res;
        if (response.code == 200) {
          res = {
            status: true,
            data: response.data['_data'],
            message: response.data['_message'],
          };
        } else {
          res = {
            status: false,
            data: {},
            message: response.data['_message'],
          };
        }
        cb(res);
      } catch (err) {
        throw err;
        // cb(err)
      }
    });
  } else {
    post(url, params, (response) => {
      try {
        let res;
        if (response?.response?.status == 401) {
          res = {
            status: false,
            data: {},
            message: 'unauthorized',
          };
        } else {
          if (response.code == 200) {
            res = {
              status: true,
              data: response.data['_data'],
              message: response.data['_message'],
            };
          } else {
            res = {
              status: false,
              data: {},
              message: response.data?.['_message'],
            };
          }
        }
        cb(res);
      } catch (err) {
        throw err;
        // cb(err)
      }
    });
  }
};

export const callPostAPI = async (url, params) => {
  let res;
  await axios.post(`${process.env.BASE_API_URL}${url}`, params, setHeader()).then((result) => {
    if (result?.result?.status == 401) {
      res = {
        status: false,
        data: {},
        message: 'unauthorized',
      };
    } else {
      const response = result.data;
      if (response.code == 200) {
        res = {
          status: true,
          data: response.data['_data'],
          message: response.data['_message'],
        };
      } else {
        res = {
          status: false,
          data: {},
          message: response.data['_message'],
        };
      }
    }
  }).catch((err) => {
    res = {
      status: false,
      data: {},
      message: err,
    };
  });
  return res;
}

