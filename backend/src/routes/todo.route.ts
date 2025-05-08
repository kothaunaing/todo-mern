import { Router } from "express";
import { checkForMyTodo, verifyToken } from "../middlewares/auth.middleware";
import {
  addTodoController,
  deleteTodoController,
  getAllTodosController,
  getOneTodoController,
  updateTodoController,
} from "../controllers/todo.controller";

const router = Router();

router.get("/all-todos", verifyToken, getAllTodosController);

router.post("/add", verifyToken, addTodoController);

router.put("/:id", verifyToken, checkForMyTodo, updateTodoController);

router.delete("/:id", verifyToken, checkForMyTodo, deleteTodoController);

router.get("/:id", verifyToken, checkForMyTodo, getOneTodoController);

export default router;
