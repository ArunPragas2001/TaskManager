import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port", process.env.PORT);

}); 