import express from "express";
import authRoutes from "./auth/authRoutes";
import settingRoutes from "./setting/settingRoutes";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/setting", settingRoutes);

export default router;
