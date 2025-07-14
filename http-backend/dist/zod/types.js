"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoomSchema = exports.signInSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(20),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(100),
    photo: zod_1.z.string().url().optional(),
});
exports.signInSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(100),
});
exports.createRoomSchema = zod_1.z.object({
    slug: zod_1.z.string().min(3).max(20),
});
