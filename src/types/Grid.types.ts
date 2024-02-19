import {ContainerProps} from "@mantine/core/lib";
import {Socket} from "socket.io-client";

export interface GridElement {
  x: number,
  y: number,
  fill: string,
  stroke?: string
}

export interface GridProps extends ContainerProps{
  numCols: number,
  numRows: number,
  socket: Socket,
}