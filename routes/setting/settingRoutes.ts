import express from "express";
import {
  getSettingList,
  saveSettings,
} from "../../controllers/settingController";

const router = express.Router();

router.get("/", getSettingList);
router.post("/save", saveSettings);

export default router;
