import { Router } from "express";
import { register, login } from "../controllers/Auth.controller.js";
import { viewUser, updateProfile } from "../controllers/User.controller.js";
import {
  viewAllNews,
  viewNewsByUser,
  viewNewsById,
  addNews,
  deleteNews,
  updateNews,
} from "../controllers/News.controller.js";
import authMiddleware from "../middleware/Auth.middleware.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

router.get("/user/", authMiddleware, viewUser);
router.put("/user/:id", authMiddleware, updateProfile);

router.get("/news", authMiddleware, viewAllNews);
router.get("/news/user/:userId", authMiddleware, viewNewsByUser);
router.get("/news/:id", authMiddleware, viewNewsById);
router.post("/news", authMiddleware, addNews);
router.put("/news/:id", authMiddleware, updateNews);
router.delete("/news/:id", authMiddleware, deleteNews);

export default router;
