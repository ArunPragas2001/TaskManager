import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/config.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/tasks", taskRoutes);

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