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
exports.verifyToken = verifyToken;
exports.checkForMyTodo = checkForMyTodo;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("../services/auth.service");
const todo_service_1 = require("../services/todo.service");
function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith("Bearer")
            ? authHeader.split(" ")[1]
            : null;
        if (!token) {
            res.status(400).json({ success: false, msg: "No token provided" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({
                success: false,
                msg: "Invalid token - You are not authorized",
            });
            return;
        }
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.log("Error in verifyToken: " + error);
        res.status(500).json({ success: false, msg: "Invalid or expired token" });
    }
}
function checkForMyTodo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const userId = req.userId;
        const user = yield (0, auth_service_1.getUserByUserId)(userId);
        const todo = yield (0, todo_service_1.getTodo)(id);
        if (!todo) {
            res.status(404).json({ success: false, msg: "No todo found" });
            return;
        }
        if ((user === null || user === void 0 ? void 0 : user.id) !== (todo === null || todo === void 0 ? void 0 : todo.user_id)) {
            res.status(400).json({ success: false, msg: "This is not your todo" });
            return;
        }
        req.todo = todo;
        next();
    });
}
