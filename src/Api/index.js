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
      return error.response;
    } else {
      return Promise.reject(error);
    }
  }
);

axiosInstance.interceptors.request.use((config) => {
  let retro = JSON.parse(localStorage.getItem("retro"));
  if(retro){
    let token = retro.token
     if(token){
       config.headers.Authorization = token
     }else{
        config.headers.Authorization = null;
     }
  }
  config.headers["Accept"] = "application/json";
  config.headers["testkey"] = "randomdata";
  config.headers.ContentType = "multipart/form-data";
  return config;
});
const Endpoint = EndpointFactory(axiosInstance);
export default {
  login: new Endpoint("authenticate"),
  retros: new Endpoint("retros"),
  cards: new Endpoint("cards"),
  editDeleteCard: (id) => new Endpoint(`cards/${id}`),
  editRetro: (id) => new Endpoint(`retros/${id}`),
  getRetro: (id) => new Endpoint(`retros/${id}`),
  retrosByUser:(user_id) => new Endpoint(`users/${user_id}`),
};
