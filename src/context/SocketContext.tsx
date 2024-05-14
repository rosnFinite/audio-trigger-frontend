import React from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";

export const socket: Socket = io("http://localhost:5001", {
  transports: ["websocket"],
});

// Create a context with an initial value of null
const SocketContext = React.createContext<Socket | null>(null);
export default SocketContext;
