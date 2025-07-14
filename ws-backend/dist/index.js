"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("./db/index"));
const wss = new ws_1.WebSocketServer({ port: 8080 });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const users = [];
function checkUser(token) {
    try {
        const jwtSecret = process.env.JWTSECRET;
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (typeof decoded == "string")
            return null;
        if (!decoded || !decoded.userId)
            return null;
        return decoded.userId;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
wss.on("connection", function connection(ws, request) {
    try {
        console.log("new connection");
        const url = request.url;
        if (!url) {
            return;
        }
        const queryParams = new URLSearchParams(url.split("?")[1]);
        const token = queryParams.get("token") || "";
        const userId = checkUser(token);
        if (!userId) {
            ws.close();
            return;
        }
        users.push({
            ws,
            userId,
            rooms: [],
        });
        console.log("verified");
        ws.on("message", function message(data) {
            return __awaiter(this, void 0, void 0, function* () {
                const parsedData = JSON.parse(data); //{type:"join room",roomId:1}
                if (parsedData.type === "join_room") {
                    const user = users.find((x) => x.ws === ws);
                    user === null || user === void 0 ? void 0 : user.rooms.push(parsedData.roomId);
                }
                if (parsedData.type === "leave_room") {
                    const user = users.find((x) => x.ws === ws);
                    if (!user)
                        return;
                    user.rooms = user === null || user === void 0 ? void 0 : user.rooms.filter((x) => x != parsedData.roomId);
                }
                if (parsedData.type === "mouse-move") {
                    users.forEach((user) => {
                        if (user.ws != ws) {
                            if (user.rooms.includes(parsedData.roomId)) {
                                user.ws.send(JSON.stringify(parsedData));
                            }
                        }
                    });
                }
                if (parsedData.type === "chat") {
                    const roomId = parsedData.roomId;
                    const message = parsedData.message;
                    const shapeId = JSON.parse(message).shape.shapeId;
                    const theUser = users.find((x) => x.ws === ws);
                    if (theUser === null || theUser === void 0 ? void 0 : theUser.rooms.includes(roomId)) {
                        yield index_1.default.chat.create({
                            data: {
                                message,
                                room: {
                                    connect: {
                                        id: Number(roomId),
                                    },
                                },
                                user: {
                                    connect: {
                                        id: userId,
                                    },
                                },
                                shapeId,
                            },
                        });
                        users.forEach((user) => {
                            if (user.ws != ws) {
                                if (user.rooms.includes(roomId)) {
                                    user.ws.send(JSON.stringify({ type: "chat", message: message, roomId }));
                                }
                            }
                        });
                    }
                }
                if (parsedData.type === "deleted") {
                    const roomId = parsedData.roomId;
                    const { deletedShape } = JSON.parse(parsedData.message);
                    const shapeIdsToDelete = deletedShape.map((shape) => shape.shapeId);
                    yield index_1.default.chat.deleteMany({
                        where: {
                            shapeId: {
                                in: shapeIdsToDelete,
                            },
                        },
                    });
                    users.forEach((user) => {
                        if (user.ws != ws && user.rooms.includes(roomId)) {
                            user.ws.send(JSON.stringify({
                                type: "deleted",
                                message: shapeIdsToDelete,
                                roomId,
                            }));
                        }
                    });
                }
            });
        });
    }
    catch (e) {
        console.log(e);
    }
});
