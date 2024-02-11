import { Router } from "express";
import { register, login } from "../controllers/Auth.controller.js";
import {
  viewProfile,
  updateProfile,
} from "../controllers/Profile.controller.js";
import authMiddleware from "../middleware/Auth.middleware.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

router.get("profile/viewProfile", authMiddleware, viewProfile);
router.put("profile/updateProfile/:id", authMiddleware, updateProfile);

export default router;
