import express from "express";

import {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} from "../controllers/taskControllers.js"

const router = express.Router();

router.post("/create", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask)
router.delete("/:id", deleteTask);


export default router;