const { Server } = require("socket.io");

const io = new Server(process.env.PORT || 3000, {
  cors: true,
});

const emailToSocketId = new Map();
const socketIdToEmail = new Map();

io.on("connection", (socket) => {
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketId.set(email, socket.id);
    socketIdToEmail.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  socket.on("user:left", ({ to }) => {
    io.to(to).emit("user:left");
  })
});
