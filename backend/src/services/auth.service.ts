import { hash } from "bcryptjs";
import pool from "../db/db";
import { LoginUserType } from "../types/types";
import generateUniqueId from "../lib/utils/generateUniqueId";
import { generateToken } from "../lib/utils/generateToken";
import { Response } from "express";

export async function getUserByUserId(userId: string) {
  const results = await pool.query("SELECT * FROM users WHERE user_id = ?", [
    userId,
  ]);
  const rows = results[0] as LoginUserType[];

  return rows.length === 0 ? null : rows[0];
}

export async function getUserByUserEmail(email: string) {
  const results = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  const rows = results[0] as LoginUserType[];

  return { user: rows.length !== 0 ? rows[0] : null };
}

export async function addUserToDB(
  name: string,
  email: string,
  password: string
) {
  const hashedPassword = await hash(password, 10);
  const userId = generateUniqueId();
  const token = generateToken(userId);

  await pool.query(
    "INSERT INTO users (user_id, name, email, password) VALUES (?, ?, ?, ?);",
    [userId, name, email, hashedPassword]
  );

  const user = await getUserByUserId(userId);

  return { token, addedUser: user };
}

export async function validateFieldsRegister(
  name: string | undefined,
  email: string | undefined,
  password: string | undefined,
  res: Response
) {
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
}

export async function validateFieldsLogin(
  email: string | undefined,
  password: string | undefined,
  res: Response
) {
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
}
