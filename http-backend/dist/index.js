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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cors_1 = __importDefault(require("cors"));
const checkAuth_1 = __importDefault(require("./middleware/checkAuth"));
const types_1 = require("./zod/types");
const index_1 = __importDefault(require("./db/index"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ message: "Hello World" });
}));
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = types_1.createUserSchema.safeParse(req.body);
        if (!userInfo.success) {
            res.status(401).json({
                Error: userInfo.error,
            });
            return;
        }
        const jwtSecret = process.env.JWTSECRET;
        if (!jwtSecret) {
            res.status(500).json({
                message: "JWT secret is not defined",
            });
            return;
        }
        const checkUser = yield index_1.default.user.findUnique({
            where: {
                email: userInfo.data.email,
            },
        });
        if (checkUser) {
            res.json({ message: "Account already exists" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(userInfo.data.password, 10);
        const userInfoFromDb = yield index_1.default.user.create({
            data: {
                username: userInfo.data.username,
                password: hashedPassword,
                email: userInfo.data.email,
                photo: userInfo.data.photo || "https://robohash.org/default-avatar",
            },
            select: {
                id: true,
                username: true,
            },
        });
        const userId = userInfoFromDb.id;
        const username = userInfoFromDb.username;
        const token = jsonwebtoken_1.default.sign({ userId }, jwtSecret, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });
        res.status(201).json({
            token,
            userId,
            username,
            message: "Signup successful",
        });
    }
    catch (e) {
        res.status(500).json({
            Error: e,
            message: "Internal server error from signup",
        });
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = types_1.signInSchema.safeParse(req.body);
        if (!userInfo.success) {
            res.status(400).json({
                message: "Incorrect credentials",
            });
            return;
        }
        const userInfoFromDb = yield index_1.default.user.findUnique({
            where: {
                email: userInfo.data.email,
            },
        });
        const jwtSecret = process.env.JWTSECRET;
        if (!userInfoFromDb) {
            res.status(404).json({
                message: "Incorrect credentials",
            });
            return;
        }
        const checkPass = yield bcrypt_1.default.compare(userInfo.data.password, userInfoFromDb.password);
        if (!checkPass) {
            res.status(401).json({
                message: "Incorrect credentials",
            });
            return;
        }
        const userId = userInfoFromDb.id;
        const username = userInfoFromDb.username;
        const token = jsonwebtoken_1.default.sign({ userId }, jwtSecret, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });
        res.status(200).json({
            token,
            username,
            userId,
            message: "Login successful",
        });
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
}));
app.get("/logout", checkAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "logged out succesfully" });
    }
    catch (e) {
        res.status(500).json({
            message: "Internal server error during logout",
            error: e,
        });
    }
}));
app.post("/create-room", checkAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const roomInfo = types_1.createRoomSchema.safeParse(req.body);
        console.log(roomInfo);
        if (!roomInfo.success) {
            res.status(400).json({ message: "Incorrect inputs" });
            return;
        }
        console.log(roomInfo);
        const checkRoom = yield index_1.default.room.findUnique({
            where: {
                slug: roomInfo.data.slug,
            },
        });
        if (checkRoom) {
            res.status(409).json({
                message: "Room already exists",
            });
            return;
        }
        const jwtSecret = process.env.JWTSECRET;
        const userId = req.userId;
        const newRoom = yield index_1.default.room.create({
            data: {
                slug: roomInfo.data.slug,
                admin: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
        res.status(201).json({
            roomId: newRoom.id,
            message: "Room created successfully",
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Internal server error from create Room",
        });
    }
}));
app.get("/api/ws-token", checkAuth_1.default, (req, res) => {
    const jwtSecret = process.env.JWTSECRET;
    if (!jwtSecret) {
        res.status(500).json({ message: "Server misconfigured" });
        return;
    }
    console.log("from new endpoint");
    const wsToken = jsonwebtoken_1.default.sign({ userId: req.userId }, jwtSecret, {
        expiresIn: "5m",
    });
    res.json({ wsToken });
});
app.get("/chats/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = Number(req.params.roomId);
        const messages = yield index_1.default.chat.findMany({
            where: {
                roomId,
            },
            orderBy: {
                id: "desc",
            },
            take: 50,
        });
        res.status(200).json(messages);
    }
    catch (e) {
        res.status(500).json({
            message: "Internal server error while fetching chats",
            error: e,
        });
    }
}));
app.get("/room/:slug", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slug;
        const room = yield index_1.default.room.findUnique({
            where: {
                slug,
            },
        });
        if (!room) {
            res.status(404).json({ message: "Room not found" });
            return;
        }
        res.status(200).json({ id: room.id });
    }
    catch (e) {
        res.status(500).json({
            message: "Internal server error while fetching room",
            error: e,
        });
    }
}));
