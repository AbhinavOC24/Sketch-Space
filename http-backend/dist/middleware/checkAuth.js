"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function checkAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }
    const jwtSecret = process.env.JWTSECRET;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "Invalid token",
        });
        return;
    }
}
