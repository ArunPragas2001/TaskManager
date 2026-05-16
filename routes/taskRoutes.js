import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} from "../controllers/taskControllers.js"

const router = express.Router();

router.post("/create", protect, createTask);
router.get("/", protect, getTasks);
router.put("/:id", protect, updateTask)
router.delete("/:id", protect, deleteTask);

export default router;