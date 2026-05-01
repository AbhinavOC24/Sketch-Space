"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createClient = () => {
    const pool = new pg_1.default.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const adapter = new adapter_pg_1.PrismaPg(pool);
    return new client_1.PrismaClient({ adapter });
};
let prismaClient;
if (process.env.NODE_ENV === "production") {
    prismaClient = createClient();
}
else {
    if (!global.prismaClient) {
        global.prismaClient = createClient();
    }
    prismaClient = global.prismaClient;
}
exports.default = prismaClient;
