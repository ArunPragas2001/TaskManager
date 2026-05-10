import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/config.js";
import taskRoutes from "./routes/taskRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/tasks", taskRoutes);

// Connect DB then start server
connectDB()
    .then(() => {
        console.log("MongoDB Connected");

        app.listen(PORT, () => {
            console.log("Server is running on port", PORT);
        });
    })
    .catch((err) => {
        console.log("DB Connection Error:", err);
    });