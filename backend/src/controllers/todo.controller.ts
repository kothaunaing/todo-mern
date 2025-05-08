import { Response } from "express";
import { CheckForMyTodoRequest, CustomRequest } from "../types/types";
import {
  addTodo,
  deleteTodo,
  getAllTodosByUserId,
  updateTodo,
} from "../services/todo.service";

export async function getAllTodosController(req: CustomRequest, res: Response) {
  try {
    const userId = req.userId;
    let currentPage = parseInt(req.query.page as string) || 1;

    const { todos, totalPages, total_todos, page } = await getAllTodosByUserId(
      userId!,
      currentPage
    );

    res
      .status(200)
      .json({ success: true, page, totalPages, total_todos, todos });
  } catch (error: any) {
    console.log("Error in getAllToDosController: " + error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}

export async function getOneTodoController(
  req: CheckForMyTodoRequest,
  res: Response
) {
  try {
    const todo = req.todo;

    if (!todo) {
      res.status(404).json({ success: false, msg: "No todo found" });
      return;
    }

    res.status(200).json({ success: true, todo });
  } catch (error: any) {
    console.log("Error in getOneToDoController: " + error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}

export async function addTodoController(req: CustomRequest, res: Response) {
  try {
    const { text } = req.body;
    const userId = req.userId;

    if (typeof text !== "string" || !text.trim()) {
      res.status(400).json({ success: false, msg: "text is a required field" });
      return;
    }

    const todo = await addTodo(text, userId!);

    res
      .status(201)
      .json({ success: false, msg: "Added a todo successfully", todo });
  } catch (error: any) {
    console.log("Error in addTodoController: " + error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}

export async function deleteTodoController(req: CustomRequest, res: Response) {
  try {
    const { id } = req.params;

    const deleted = await deleteTodo(id);

    if (!deleted) {
      res.status(404).json({ success: false, msg: "No todo found" });
      return;
    }

    res.status(200).json({ success: true, msg: "Delete a todo", id });
  } catch (error: any) {
    console.log("Error in deleteTodoController: " + error);

    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}

export async function updateTodoController(req: CustomRequest, res: Response) {
  try {
    const { text, completed } = req.body;
    const { id } = req.params;

    const { updatedTodo, updated } = await updateTodo(id, text, completed);

    if (!updated) {
      res.status(400).json({ success: false, msg: "No todo updated" });
      return;
    }

    res.status(201).json({
      success: false,
      msg: "Updated a todo successfully",
      todo: updatedTodo,
    });
  } catch (error: any) {
    console.log("Error in addTodoController: " + error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}
