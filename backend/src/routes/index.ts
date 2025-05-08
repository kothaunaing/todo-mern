import { Router } from "express";
import authRoutes from "./auth.route";
import todoRoutes from "./todo.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/todo", todoRoutes);

export default router;
