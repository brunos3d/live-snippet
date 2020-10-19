import io from "socket.io-client";

const HOST = process.env["HOST"] as string;

const socket = io(HOST);

export default socket;
