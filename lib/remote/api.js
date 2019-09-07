import axios from "axios";
import querystring from "querystring";
import { Body } from "node-fetch";

let api;

const GetHeaders = () => {
  return {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json"
  };
};

api = axios.create({
  // baseURL: this.API_URI,
  headers: GetHeaders()
});

api.interceptors.request.use(config => {
  config.data = querystring.stringify(config.data);
  return config;
});

const HandleResponse = response => Promise.resolve(response);

const HandleError = error => Promise.reject(error.response);

const Api = {
  get: (endpoint, headers = {}) =>
    api
      .get(endpoint, headers)
      .then(res => HandleResponse(res))
      .catch(error => HandleError(error)),

  post: (endpoint, payload, headers = {}) =>
    api
      .post(endpoint, payload, headers)
      .then(res => HandleResponse(res))
      .catch(error => HandleError(error)),

  patch: (endpoint, payload, headers = {}) =>
    api
      .patch(endpoint, payload, headers)
      .then(res => HandleResponse(res))
      .catch(error => HandleError(error)),

  delete: (endpoint, headers = {}) =>
    api
      .delete(endpoint, headers)
      .then(res => HandleResponse(res))
      .catch(error => HandleError(error)),

  request: (endpoint, method = "get", data = {}, headers = {}) =>
    api
      .request({
        method,
        url: endpoint,
        data: Body,
        headers
      })
      .then(res => HandleResponse(res))
      .catch(error => HandleError(error))
};

export default Api;
