import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/config.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Disable caching for development
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

app.use(express.static(path.join(__dirname, "public"), {
    etag: false,
    maxAge: 0
}));

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

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