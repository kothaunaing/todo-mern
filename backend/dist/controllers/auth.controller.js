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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.checkAuthController = checkAuthController;
const bcryptjs_1 = require("bcryptjs");
const generateToken_1 = require("../lib/utils/generateToken");
const auth_service_1 = require("../services/auth.service");
function registerController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            const isValid = (0, auth_service_1.validateFieldsRegister)(name, email, password, res);
            if (!isValid)
                return;
            const { user } = yield (0, auth_service_1.getUserByUserEmail)(email);
            if (user) {
                res.status(400).json({ success: false, msg: "User already exists" });
                return;
            }
            const { addedUser, token } = yield (0, auth_service_1.addUserToDB)(name, email, password);
            res.status(201).json({
                success: true,
                msg: "User created successfully",
                token,
                user: addedUser,
            });
        }
        catch (error) {
            console.log("Error in registerController: " + error.message);
            res.status(500).json({ success: false, msg: "Internal server error" });
        }
    });
}
function loginController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const isValid = (0, auth_service_1.validateFieldsLogin)(email, password, res);
            if (!isValid)
                return;
            const { user } = yield (0, auth_service_1.getUserByUserEmail)(email);
            if (!user) {
                res.status(400).json({ success: false, msg: "Invalid credentials" });
                return;
            }
            const isPasswordCorrect = yield (0, bcryptjs_1.compare)(password, user.password);
            if (!isPasswordCorrect) {
                res.status(400).json({ success: false, msg: "Invalid credentials" });
                return;
            }
            const token = (0, generateToken_1.generateToken)(user.user_id);
            res.status(200).json({
                success: true,
                msg: "Successfully logged in",
                token,
                user: Object.assign(Object.assign({}, user), { password: undefined }),
            });
        }
        catch (error) {
            console.log("Error in loginController: " + error.message);
            res.status(500).json({ success: false, msg: "Internal server error" });
        }
    });
}
function checkAuthController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            const user = yield (0, auth_service_1.getUserByUserId)(userId);
            res
                .status(200)
                .json({ success: true, user: Object.assign(Object.assign({}, user), { password: undefined }) });
        }
        catch (error) {
            console.log("Error in checkAuth: " + error);
            res.status(500).json({ success: false, msg: "Internal server error" });
        }
    });
}
