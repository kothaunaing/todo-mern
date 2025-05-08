import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import {
  CheckForMyTodoRequest,
  CustomRequest,
  JWTUserToken,
} from "../types/types";
import { getUserByUserId } from "../services/auth.service";
import { getTodo } from "../services/todo.service";

export function verifyToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      res.status(400).json({ success: false, msg: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTUserToken;

    if (!decoded) {
      res.status(401).json({
        success: false,
        msg: "Invalid token - You are not authorized",
      });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    console.log("Error in verifyToken: " + error);
    res.status(500).json({ success: false, msg: "Invalid or expired token" });
  }
}

export async function checkForMyTodo(
  req: CheckForMyTodoRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const userId = req.userId;

  const user = await getUserByUserId(userId!);
  const todo = await getTodo(id);

  if (!todo) {
    res.status(404).json({ success: false, msg: "No todo found" });
    return;
  }

  if (user?.id !== todo?.user_id) {
    res.status(400).json({ success: false, msg: "This is not your todo" });
    return;
  }

  req.todo = todo!;

  next();
}
