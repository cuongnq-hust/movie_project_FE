import axios from 'axios';

export default axios.create({
    baseURL: 'https://2adb-2001-ee0-22b-2fa6-cda9-1de6-4635-36fe.ngrok-free.app',
    headers: { "ngrok-skip-browser-warning": "true" }
});