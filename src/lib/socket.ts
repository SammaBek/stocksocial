import { io, Socket } from "socket.io-client";

let socket: Socket;

export function getSocket(): Socket {
  if (!socket) {
    socket = io({ path: "/api/socket/io", addTrailingSlash: false });
  }
  return socket;
}
