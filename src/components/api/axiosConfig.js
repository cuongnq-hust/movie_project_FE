import axios from "axios";
//object
export default axios.create({
  baseURL: "https://4f6a-2001-ee0-210-6183-ec4f-31db-b44e-87b8.ngrok.io",

  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
});
