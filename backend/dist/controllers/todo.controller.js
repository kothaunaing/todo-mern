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
exports.getAllTodosController = getAllTodosController;
exports.getOneTodoController = getOneTodoController;
exports.addTodoController = addTodoController;
exports.deleteTodoController = deleteTodoController;
exports.updateTodoController = updateTodoController;
const todo_service_1 = require("../services/todo.service");
function getAllTodosController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            let currentPage = parseInt(req.query.page) || 1;
            const { todos, totalPages, total_todos, page } = yield (0, todo_service_1.getAllTodosByUserId)(userId, currentPage);
            res
                .status(200)
                .json({ success: true, page, totalPages, total_todos, todos });
        }
        catch (error) {
            console.log("Error in getAllToDosController: " + error);
            res.status(500).json({ success: false, msg: "Internal server error" });
        }
    });
}
function getOneTodoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const todo = req.todo;
            if (!todo) {
                res.status(404).json({ success: false, msg: "No todo found" });
                return;
            }
            res.status(200).json({ success: true, todo });
        }
        catch (error) {
            console.log("Error in getOneToDoController: " + error);
            res.status(500).json({ success: false, msg: "Internal server error" });
        }
    });
}
function addTodoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { text } = req.body;
            const userId = req.userId;
            if (typeof text !== "string" || !text.trim()) {
                res.status(400).json({ success: false, msg: "text is a required field" });
                return;
            }
            const todo = yield (0, todo_service_1.addTodo)(text, userId);
            res
                .status(201)
                .json({ success: false, msg: "Added a todo successfully", todo });
        }
        catch (error) {
            console.log("Error in addTodoController: " + error);
            res.status(500).json({ success: false, msg: "Internal server error" });
        }
    });
}
function deleteTodoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const deleted = yield (0, todo_service_1.deleteTodo)(id);
            if (!deleted) {
                res.status(404).json({ success: false, msg: "No todo found" });
                return;
            }
            res.status(200).json({ success: true, msg: "Delete a todo", id });
        }
        catch (error) {
            console.log("Error in deleteTodoController: " + error);
            res.status(500).json({ success: false, msg: "Internal server error" });
        }
    });
}
function updateTodoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { text, completed } = req.body;
            const { id } = req.params;
            const { updatedTodo, updated } = yield (0, todo_service_1.updateTodo)(id, text, completed);
            if (!updated) {
                res.status(400).json({ success: false, msg: "No todo updated" });
                return;
            }
            res.status(201).json({
                success: false,
                msg: "Updated a todo successfully",
                todo: updatedTodo,
            });
        }
        catch (error) {
            console.log("Error in addTodoController: " + error);
            res.status(500).json({ success: false, msg: "Internal server error" });
        }
    });
}
