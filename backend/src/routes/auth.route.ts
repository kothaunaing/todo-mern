import { Router } from "express";
import {
  checkAuthController,
  loginController,
  registerController,
} from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/check-auth", verifyToken, checkAuthController);

export default router;
