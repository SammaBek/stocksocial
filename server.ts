import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";

const httpServer = createServer();
const app = next({ dev, httpServer });
const handle = app.getRequestHandler();

const io = new Server(httpServer, {
  path: "/api/socket/io",
  addTrailingSlash: false,
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);
  });

  socket.on("leave-room", (roomId: string) => {
    socket.leave(roomId);
  });

  socket.on("send-message", (data: { roomId: string; message: object }) => {
    socket.to(data.roomId).emit("receive-message", data.message);
  });
});

app.prepare().then(() => {
  httpServer.on("request", (req, res) => {
    if (req.url?.startsWith("/api/socket/io")) return;
    handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Server running at http://localhost:${port}`);
  });
});
