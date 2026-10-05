import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { config } from "../config/env.js";
import { findAuthenticatedUser } from "../services/auth.service.js";
import { SOCKET_EVENTS, SOCKET_ROOMS } from "./constants.js";

let io;

function getCookieValue(header, name) {
  const entry = header?.split(";").map((value) => value.trim()).find((value) => value.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
}

export function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: config.frontendOrigin, credentials: true },
  });

  io.use(async (socket, next) => {
    try {
      const token = getCookieValue(socket.handshake.headers.cookie, config.authCookieName);
      if (!token) return next(new Error("Authentication required."));
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await findAuthenticatedUser(payload.sub);
      if (!user) return next(new Error("Authentication required."));

      socket.user = user;
      return next();
    } catch {
      return next(new Error("Authentication required."));
    }
  });

  io.on("connection", (socket) => {
    if (socket.user.role !== "platformAdmin" && socket.user.brokerageId) {
      socket.join(SOCKET_ROOMS.brokerage(socket.user.brokerageId.toString()));
    }
  });

  return io;
}

export function emitLeadUpdated(brokerageId, payload) {
  if (!io || !brokerageId) return;
  io.to(SOCKET_ROOMS.brokerage(brokerageId.toString())).emit(SOCKET_EVENTS.LEAD_UPDATED, payload);
}
