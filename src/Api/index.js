import axios from "axios";
import EndpointFactory from "axios-endpoints";
const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/",
  responseType: "json",
});
axiosInstance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (401 === error.response.status) {
    return error.response.status;
  } else {
      return Promise.reject(error);
  }
});


axiosInstance.interceptors.request.use(config => {
  config.headers.Authorization = null
  //  Storage.get('token')
  //   ? Storage.get('token').token
  //   : null
  config.headers.ContentType = "multipart/form-data";
  return config
})
const Endpoint = EndpointFactory(axiosInstance);
export default {
  login:  new Endpoint(`login`),
  retros: new Endpoint("retros"),
  getRetro: (id) => new Endpoint(`retro/${id}`),
};
