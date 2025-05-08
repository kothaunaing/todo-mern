import { Request } from "express";

export interface LoginUserType {
  id?: string;
  user_id: string;
  name?: string;
  email: string;
  password: string;
}

export interface JWTUserToken {
  userId: string;
}

export interface CustomRequest extends Request {
  userId?: string;
}

export interface CheckForMyTodoRequest extends CustomRequest {
  todo?: ToDoType;
}

export interface ToDoType {
  id: number;
  text: string;
  user_id: string;
}

export interface ResultSetHeader {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}
