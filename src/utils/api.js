import axios from "axios";

const api = axios.create({
  baseURL: "https://warm-earth-04408.herokuapp.com/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default api;
