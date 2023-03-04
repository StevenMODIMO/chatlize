const socketio = require("socket.io");
const passport = require("passport");
const cookieSession = require("cookie-session");
const Chat = require("./model/room-model");

const sessionMiddleware = cookieSession({
  maxAge: 24 * 60 * 60 * 5000,
  keys: [process.env.COOKIE_KEY],
});

function socketHandler(server) {
  const io = socketio(server);

  // convert a connect middleware to a Socket.IO middleware
  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);

  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  io.use((socket, next) => {
    if (socket.request.user) {
      next();
    } else {
      next(new Error("unauthorized"));
    }
  });

  // listen for connections
  io.on("connection", (socket) => {
    console.log(socket.request.user.username, "is connected");

    // Listen for room connections
    socket.on("join-room", (room) => {
      console.log("Current room is: ", room);
      socket.join(room);
      socket.currentRoom = room;
    });

    // listen for messages
    socket.on("message", (msg) => {
      io.to(socket.currentRoom).emit("chat", msg);
      console.log("Currnet: ", socket.currentRoom);
      console.log(msg);
      const rname = socket.currentRoom;
      const sender = socket.request.user.username;
      const thumbnail = socket.request.user.thumbnail;
      Chat.findOneAndUpdate(
        { room_name: rname },
        {
          $push: {
            room_chats: [{
              sender: sender,
              thumbnail: thumbnail,
              message: msg,
            }],
          },
        },
        { new: true },
        (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log(docs);
          }
        }
      );
    });

    // listen for disconnections
    socket.on("disconnect", () => {
      console.log(socket.request.user.username, "is disconnected");
    });
  });
}

module.exports = socketHandler;
