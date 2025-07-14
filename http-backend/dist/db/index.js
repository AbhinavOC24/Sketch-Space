"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let prismaClient;
if (process.env.NODE_ENV === "production") {
    prismaClient = new client_1.PrismaClient();
}
else {
    if (!global.prismaClient) {
        global.prismaClient = new client_1.PrismaClient();
    }
    prismaClient = global.prismaClient;
}
exports.default = prismaClient;
