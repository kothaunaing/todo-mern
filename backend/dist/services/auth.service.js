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
exports.getUserByUserId = getUserByUserId;
exports.getUserByUserEmail = getUserByUserEmail;
exports.addUserToDB = addUserToDB;
exports.validateFieldsRegister = validateFieldsRegister;
exports.validateFieldsLogin = validateFieldsLogin;
const bcryptjs_1 = require("bcryptjs");
const db_1 = __importDefault(require("../db/db"));
const generateUniqueId_1 = __importDefault(require("../lib/utils/generateUniqueId"));
const generateToken_1 = require("../lib/utils/generateToken");
function getUserByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield db_1.default.query("SELECT * FROM users WHERE user_id = ?", [
            userId,
        ]);
        const rows = results[0];
        return rows.length === 0 ? null : rows[0];
    });
}
function getUserByUserEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield db_1.default.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        const rows = results[0];
        return { user: rows.length !== 0 ? rows[0] : null };
    });
}
function addUserToDB(name, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield (0, bcryptjs_1.hash)(password, 10);
        const userId = (0, generateUniqueId_1.default)();
        const token = (0, generateToken_1.generateToken)(userId);
        yield db_1.default.query("INSERT INTO users (user_id, name, email, password) VALUES (?, ?, ?, ?);", [userId, name, email, hashedPassword]);
        const user = yield getUserByUserId(userId);
        return { token, addedUser: user };
    });
}
function validateFieldsRegister(name, email, password, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof name !== "string" || !name.trim()) {
            res.status(400).json({ success: false, msg: "name is a required field" });
            return false;
        }
        if (typeof email !== "string" || !email.trim()) {
            res.status(400).json({ success: false, msg: "email is a required field" });
            return false;
        }
        if (typeof password !== "string" || !password.trim()) {
            res
                .status(400)
                .json({ success: false, msg: "password is a required field" });
            return false;
        }
        return true;
    });
}
function validateFieldsLogin(email, password, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof email !== "string" || !email.trim()) {
            res.status(400).json({ success: false, msg: "email is a required field." });
            return false;
        }
        if (typeof password !== "string" || !password.trim()) {
            res
                .status(400)
                .json({ success: false, msg: "password is a required field." });
            return false;
        }
        return true;
    });
}
