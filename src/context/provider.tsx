import { ReactNode, useRef } from "react";
import { io } from "socket.io-client";
import { WebSocketCtx, MyWebSocket } from ".";

const WebSocketCtxProvider = (props: { children?: ReactNode }) => {
  const socketRef = useRef<MyWebSocket>(
    io("http://localhost:5001", {
      transports: ["websocket"],
    })
  );

  return (
    <WebSocketCtx.Provider value={{ socket: socketRef.current }}>
      {props.children}
    </WebSocketCtx.Provider>
  );
};

export default WebSocketCtxProvider;
