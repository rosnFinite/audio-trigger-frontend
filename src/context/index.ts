import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

export type MyWebSocket = Socket;

export interface WebSocketCtxState {
  socket: MyWebSocket;
}

export const WebSocketCtx = createContext<WebSocketCtxState>(
  {} as WebSocketCtxState
);

export const useWebSocketCtx = () => useContext(WebSocketCtx);
