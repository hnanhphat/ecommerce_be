const Message = require("../models/Message");
const Order = require("../models/Order");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Cart = require("../models/Cart");

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

    // CREATE ORDER
    socket.on("od.create", async (apm) => {
      const {
        customer,
        carts,
        status,
        total,
        shipping,
        phone,
        payment,
        quantity,
      } = apm;
      const order = new Order({
        customer,
        carts,
        status,
        total,
        shipping,
        phone,
        payment,
        quantity,
      });
      await order.save();

      await Promise.all(
        carts.map(async (cart) => {
          await Cart.findByIdAndUpdate(
            { _id: cart },
            { isOrdered: true },
            { new: true }
          );
        })
      );

      const saved = order ? true : false;

      io.emit("od.request", { order, saved });
    });

    // CHANGE ORDER STATUS
    socket.on("od.change", async (od) => {
      const order = await Order.findByIdAndUpdate(
        od.id,
        { status: od.status },
        { new: true }
      );

      io.emit("od.receive", order);
    });

    // GET ALL ORDERS
    socket.on("od.init", async (od) => {
      let { page, limit, sortBy, payment, ...filter } = od;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const totalOrders = await Order.countDocuments({
        payment: new RegExp(payment, "i"),
        ...filter,
      });

      const totalPages = Math.ceil(totalOrders / limit);

      const offset = (page - 1) * limit;

      const orders = await Order.find({
        payment: new RegExp(payment, "i"),
        ...filter,
      })
        .sort({ ...sortBy, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("carts")
        .populate("customer");

      io.emit("od.noti", { orders, totalPages });
    });

    // GET USER'S ORDERS
    socket.on("od.user_init", async (od) => {
      // console.log(od.id);
      let { page, limit, sortBy, payment, id, ...filter } = od;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const totalOrders = await Order.countDocuments({
        payment: new RegExp(payment, "i"),
        customer: od.id,
        ...filter,
      });

      const totalPages = Math.ceil(totalOrders / limit);

      const offset = (page - 1) * limit;

      const orders = await Order.find({
        payment: new RegExp(payment, "i"),
        customer: od.id,
        ...filter,
      })
        .sort({ ...sortBy, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("carts")
        .populate("customer");

      io.emit("od.user_noti", { orders, totalPages });
    });

    // DELETE ORDER
    socket.on("od.delete", async (od) => {
      const order = await Order.findByIdAndDelete(od.id);

      io.emit("od.deleted", order);
    });

    // CREATE APPOINTMENT
    socket.on("apm.create", async (apm) => {
      const {
        fromId,
        toId,
        serviceType,
        appointmentDate,
        clientPhone,
        position,
      } = apm;

      const targetUser = await User.findById(toId);
      if (targetUser) {
      }

      const appointment = await Appointment({
        status: "Requesting",
        from: fromId,
        to: toId,
        serviceType,
        appointmentDate,
        clientPhone,
        position,
      });
      await appointment.save();

      const sent = appointment ? true : false;

      io.emit("apm.request", { appointment, sent });
    });

    // CHANGE APPOINTMENT STATUS
    socket.on("apm.change", async (apm) => {
      const appointment = await Appointment.findByIdAndUpdate(
        apm.id,
        { status: apm.status },
        { new: true }
      );

      io.emit("apm.receive", appointment);
    });

    // GET ALL APPOINTMENTS
    socket.on("apm.init", async (apm) => {
      let { page, limit, sortBy, serviceType, ...filter } = apm;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const totalAppointment = await Appointment.countDocuments({
        serviceType: new RegExp(serviceType, "i"),
        ...filter,
      });

      const totalPages = Math.ceil(totalAppointment / limit);

      const offset = (page - 1) * limit;

      let appointments = await Appointment.find({
        serviceType: new RegExp(serviceType, "i"),
        ...filter,
      })
        .sort({ ...sortBy, createdAt: -1 })
        .skip(offset)
        .limit(limit);

      io.emit("apm.noti", { appointments, totalPages });
    });

    // GET USER'S APPOINTMENTS
    socket.on("apm.user_init", async (apm) => {
      console.log(apm.id);
      let { page, limit, sortBy, serviceType, id, ...filter } = apm;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const totalAppointment = await Appointment.countDocuments({
        serviceType: new RegExp(serviceType, "i"),
        from: apm.id,
        ...filter,
      });

      const totalPages = Math.ceil(totalAppointment / limit);

      const offset = (page - 1) * limit;

      const appointments = await Appointment.find({
        serviceType: new RegExp(serviceType, "i"),
        from: apm.id,
        ...filter,
      })
        .sort({ ...sortBy, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("from")
        .populate("to");

      // console.log(appointments);

      io.emit("apm.user_noti", { appointments, totalPages });
    });

    // DELETE ORDER
    socket.on("apm.delete", async (apm) => {
      const appointment = await Appointment.findByIdAndDelete(apm.id);

      io.emit("apm.deleted", appointment);
    });

    socket.on("disconnect", () => {
      console.log(socket.id, "is disconnected!");
    });
  });
};

module.exports = socketMethods;
