import axios from "axios";
//object
export default axios.create({
  baseURL: "https://acbd-2001-ee0-22d-66eb-d822-afcb-d274-b848.ngrok-free.app",

  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
});
