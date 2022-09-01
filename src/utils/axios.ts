import axios from "axios";

const ins = axios.create({
  baseURL: "http://localhost:5050",
  timeout: 10000,
});

export default ins;
