const axios = require("axios");
const querystring = require("querystring");
const { logInfo, logError } = require("../../common/logger");

let API_URI = process.env.API_URI;

const GetHeaders = {
  "Content-Type": "application/x-www-form-urlencoded",
  Accept: "application/json"
};

const api = axios.create({
  baseURL: API_URI,
  headers: GetHeaders
});

api.interceptors.request.use(
  config => {
    var url = config.url;
    var index = url.indexOf("/");
    config.headers["HOST"] = url.substring(0, index).toUpperCase();
    config.url = url.substring(index);
    config.data = querystring.stringify(config.data);
    return config;
  }
);

const HandleResponse = response => Promise.resolve(response)

const HandleError = error => Promise.reject(error.response)

const Request = {
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
      .catch(error => HandleError(error))
};

module.exports = Request;
