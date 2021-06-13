import axios from "axios";
import EndpointFactory from "axios-endpoints";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  responseType: "json",
});
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (401 === error.response.status) {
      return error.response.status;
    } else {
      return Promise.reject(error);
    }
  }
);

axiosInstance.interceptors.request.use((config) => {
  //localStorage.getItem("token") ? localStorage.getItem("token").token : null;
  let token = localStorage.getItem("token");
   if(token){
     config.headers.Authorization = token
   }else{
  config.headers.Authorization = null;
   }

  config.headers["Accept"] = "application/json";
  config.headers["testkey"] = "randomdata";
  config.headers.ContentType = "multipart/form-data";
  return config;
});
const Endpoint = EndpointFactory(axiosInstance);
export default {
  login: new Endpoint(`authenticate`),
  retros: new Endpoint("retros"),
  getRetro: (id) => new Endpoint(`retro/${id}`),
};
