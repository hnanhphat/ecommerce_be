const Message = require("../models/Message");

const socketMethods = (io) => {
  io.on("connect", (socket) => {
    console.log(socket.id, "is connected");

    // SEND MESSAGE
    socket.on("msg.send", async (msg) => {
      console.log(msg.body);
      // Save the message
      const message = await Message.create({
        fromUser: msg.fromUser,
        body: msg.body,
        image: msg.image,
        toUser: msg.toUser,
      });

      // Send that saved message back to frontend
      io.emit("msg.receive", message);
    });

    // LET PREVIOUS MESSAGE
    socket.on("msg.init", async (msg) => {
      let previousMessage = await Message.find({
        $or: [
          { fromUser: msg.fromUser, toUser: msg.toUser },
          { fromUser: msg.toUser, toUser: msg.fromUser },
        ],
      });

      io.emit("msg.noti", { previousMessage });
    });

    socket.on("disconnect", () => {
      console.log(socket.id, "is disconnected!");
    });
  });
};

module.exports = socketMethods;
