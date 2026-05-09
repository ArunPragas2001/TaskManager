import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const Task = mongoose.model("Task", taskSchema);

export default Task;    