import { io } from 'socket.io-client';

const isSecure = window.location.protocol === 'https:';
const baseURL = isSecure
    ? 'https://negevnerds.cs.bgu.ac.il'
    : 'http://localhost:5001';

const socket = io(baseURL, {
    transports: ["websocket"],
    auth: {
        token: localStorage.getItem("access_token"),
    },
    withCredentials: false,
});

export default socket;