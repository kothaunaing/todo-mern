import { ResultSetHeader } from "mysql2";
import pool from "../db/db";
import generateUniqueId from "../lib/utils/generateUniqueId";
import { ToDoType } from "../types/types";
import { getUserByUserId } from "./auth.service";

const ITEMS_PER_PAGE = 20;

export async function getAllTodosByUserId(userId: string, page: number = 1) {
  const user = await getUserByUserId(userId);
  // const offset = (page - 1) * ITEMS_PER_PAGE;

  const results = await pool.query(
    "SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC",
    [user?.id]
  );

  const todos = results[0] as ToDoType[];
  const countInfo = await pool.query(
    "SELECT COUNT(id) as total_todos FROM todos WHERE user_id = ? ",
    [user?.id]
  );
  const arr = countInfo[0] as { total_todos: number }[];
  const { total_todos } = arr[0];

  const totalPages = Math.ceil(total_todos / ITEMS_PER_PAGE);

  return { page, totalPages, total_todos, todos };
}

export async function getTodo(id: string) {
  const results = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
  const rows = results[0] as ToDoType[];

  return rows.length > 0 ? rows[0] : null;
}

export async function addTodo(text: string, userId: string) {
  const user = await getUserByUserId(userId);
  const id = generateUniqueId();

  await pool.query("INSERT INTO todos (id, text, user_id) VALUES (?, ?, ?)", [
    id,
    text,
    user?.id,
  ]);

  const todo = await getTodo(id);

  return todo;
}

export async function deleteTodo(id: string) {
  const result = await pool.query("DELETE FROM todos WHERE id = ?", [id]);

  const resultSetHeader = result[0] as ResultSetHeader;

  if (resultSetHeader.affectedRows === 0) {
    return false;
  }

  return true;
}

export async function updateTodo(id: string, text: string, completed: string) {
  const fields: string[] = [];
  const values: any[] = [];

  if (text !== undefined) {
    fields.push("text = ?");
    values.push(text);
  }

  if (completed !== undefined) {
    fields.push("completed = ?");
    values.push(completed);
  }

  values.push(id);

  const result = await pool.query(
    `UPDATE todos SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  const resultSetHeader = result[0] as ResultSetHeader;

  if (resultSetHeader.affectedRows === 0) {
    return { updated: false, updateTodo: null };
  }
  const updatedTodo = await getTodo(id);

  return { updatedTodo, updated: true };
}
