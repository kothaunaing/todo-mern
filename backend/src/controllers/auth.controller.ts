import { Request, Response } from "express";
import { CustomRequest, LoginUserType } from "../types/types";
import pool from "../db/db";
import { compare } from "bcryptjs";
import { generateToken } from "../lib/utils/generateToken";
import {
  addUserToDB,
  getUserByUserEmail,
  getUserByUserId,
  validateFieldsLogin,
  validateFieldsRegister,
} from "../services/auth.service";

export async function registerController(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body as LoginUserType;

    const isValid = validateFieldsRegister(name, email, password, res);

    if (!isValid) return;

    const { user } = await getUserByUserEmail(email);

    if (user) {
      res.status(400).json({ success: false, msg: "User already exists" });
      return;
    }

    const { addedUser, token } = await addUserToDB(name!, email, password);

    res.status(201).json({
      success: true,
      msg: "User created successfully",
      token,
      user: addedUser,
    });
  } catch (error: any) {
    console.log("Error in registerController: " + error.message);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const isValid = validateFieldsLogin(email, password, res);

    if (!isValid) return;

    const { user } = await getUserByUserEmail(email);

    if (!user) {
      res.status(400).json({ success: false, msg: "Invalid credentials" });
      return;
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ success: false, msg: "Invalid credentials" });
      return;
    }

    const token = generateToken(user.user_id);

    res.status(200).json({
      success: true,
      msg: "Successfully logged in",
      token,
      user: { ...user, password: undefined },
    });
  } catch (error: any) {
    console.log("Error in loginController: " + error.message);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}

export async function checkAuthController(req: CustomRequest, res: Response) {
  try {
    const userId = req.userId;

    const user = await getUserByUserId(userId!);

    res
      .status(200)
      .json({ success: true, user: { ...user, password: undefined } });
  } catch (error: any) {
    console.log("Error in checkAuth: " + error);

    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}
