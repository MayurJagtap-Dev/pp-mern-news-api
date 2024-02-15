import { Router } from "express";
import { register, login, sendMails } from "../controllers/Auth.controller.js";
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
import redisCache from "../config/redis.config.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/sendmail", authMiddleware, sendMails);

router.get("/user/", authMiddleware, viewUser);
router.put("/user/:id", authMiddleware, updateProfile);

router.get("/news", authMiddleware, redisCache.route("news"), viewAllNews);
router.get("/news/user/:userId", authMiddleware, viewNewsByUser);
router.get("/news/:id", authMiddleware, viewNewsById);
router.post("/news", authMiddleware, addNews);
router.put("/news/:id", authMiddleware, updateNews);
router.delete("/news/:id", authMiddleware, deleteNews);

export default router;
