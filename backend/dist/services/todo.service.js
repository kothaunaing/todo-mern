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
exports.getAllTodosByUserId = getAllTodosByUserId;
exports.getTodo = getTodo;
exports.addTodo = addTodo;
exports.deleteTodo = deleteTodo;
exports.updateTodo = updateTodo;
const db_1 = __importDefault(require("../db/db"));
const generateUniqueId_1 = __importDefault(require("../lib/utils/generateUniqueId"));
const auth_service_1 = require("./auth.service");
const ITEMS_PER_PAGE = 20;
function getAllTodosByUserId(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, page = 1) {
        const user = yield (0, auth_service_1.getUserByUserId)(userId);
        // const offset = (page - 1) * ITEMS_PER_PAGE;
        const results = yield db_1.default.query("SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC", [user === null || user === void 0 ? void 0 : user.id]);
        const todos = results[0];
        const countInfo = yield db_1.default.query("SELECT COUNT(id) as total_todos FROM todos WHERE user_id = ? ", [user === null || user === void 0 ? void 0 : user.id]);
        const arr = countInfo[0];
        const { total_todos } = arr[0];
        const totalPages = Math.ceil(total_todos / ITEMS_PER_PAGE);
        return { page, totalPages, total_todos, todos };
    });
}
function getTodo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield db_1.default.query("SELECT * FROM todos WHERE id = ?", [id]);
        const rows = results[0];
        return rows.length > 0 ? rows[0] : null;
    });
}
function addTodo(text, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, auth_service_1.getUserByUserId)(userId);
        const id = (0, generateUniqueId_1.default)();
        yield db_1.default.query("INSERT INTO todos (id, text, user_id) VALUES (?, ?, ?)", [
            id,
            text,
            user === null || user === void 0 ? void 0 : user.id,
        ]);
        const todo = yield getTodo(id);
        return todo;
    });
}
function deleteTodo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield db_1.default.query("DELETE FROM todos WHERE id = ?", [id]);
        const resultSetHeader = result[0];
        if (resultSetHeader.affectedRows === 0) {
            return false;
        }
        return true;
    });
}
function updateTodo(id, text, completed) {
    return __awaiter(this, void 0, void 0, function* () {
        const fields = [];
        const values = [];
        if (text !== undefined) {
            fields.push("text = ?");
            values.push(text);
        }
        if (completed !== undefined) {
            fields.push("completed = ?");
            values.push(completed);
        }
        values.push(id);
        const result = yield db_1.default.query(`UPDATE todos SET ${fields.join(", ")} WHERE id = ?`, values);
        const resultSetHeader = result[0];
        if (resultSetHeader.affectedRows === 0) {
            return { updated: false, updateTodo: null };
        }
        const updatedTodo = yield getTodo(id);
        return { updatedTodo, updated: true };
    });
}
