import express from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import cors from "cors";
import checkAuth from "./middleware/checkAuth";
import { createRoomSchema, createUserSchema, signInSchema } from "./zod/types";
import prismaClient from "./db/index";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World" });
});

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const userInfo = createUserSchema.safeParse(req.body);

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
    const checkUser = await prismaClient.user.findUnique({
      where: {
        email: userInfo.data.email,
      },
    });

    if (checkUser) {
      res.json({ message: "Account already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(userInfo.data.password, 10);
    const userInfoFromDb = await prismaClient.user.create({
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
    const token = jwt.sign({ userId }, jwtSecret, {
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
  } catch (e) {
    res.status(500).json({
      Error: e,
      message: "Internal server error from signup",
    });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const userInfo = signInSchema.safeParse(req.body);
    if (!userInfo.success) {
      res.status(400).json({
        message: "Incorrect credentials",
      });
      return;
    }
    const userInfoFromDb = await prismaClient.user.findUnique({
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
    const checkPass = await bcrypt.compare(
      userInfo.data.password,
      userInfoFromDb.password
    );
    if (!checkPass) {
      res.status(401).json({
        message: "Incorrect credentials",
      });
      return;
    }

    const userId = userInfoFromDb.id;
    const username = userInfoFromDb.username;
    const token = jwt.sign({ userId }, jwtSecret as string, {
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
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

app.get("/logout", checkAuth, async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "logged out succesfully" });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error during logout",
      error: e,
    });
  }
});

app.post("/create-room", checkAuth, async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const roomInfo = createRoomSchema.safeParse(req.body);
    console.log(roomInfo);
    if (!roomInfo.success) {
      res.status(400).json({ message: "Incorrect inputs" });
      return;
    }
    console.log(roomInfo);
    const checkRoom = await prismaClient.room.findUnique({
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
    const newRoom = await prismaClient.room.create({
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
  } catch (e) {
    res.status(500).json({
      message: "Internal server error from create Room",
    });
  }
});
app.get("/api/ws-token", checkAuth, (req: Request, res: Response) => {
  const jwtSecret = process.env.JWTSECRET;

  if (!jwtSecret) {
    res.status(500).json({ message: "Server misconfigured" });
    return;
  }
  console.log("from new endpoint");
  const wsToken = jwt.sign({ userId: req.userId }, jwtSecret, {
    expiresIn: "5m",
  });

  res.json({ wsToken });
});

app.get("/chats/:roomId", async (req: Request, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);

    const messages = await prismaClient.chat.findMany({
      where: {
        roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    res.status(200).json(messages);
  } catch (e) {
    res.status(500).json({
      message: "Internal server error while fetching chats",
      error: e,
    });
  }
});

app.get("/room/:slug", async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const room = await prismaClient.room.findUnique({
      where: {
        slug,
      },
    });

    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }
    res.status(200).json({ id: room.id });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error while fetching room",
      error: e,
    });
  }
});
