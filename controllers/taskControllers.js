import Task from "../models/taskModel.js";

export const createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            user: req.user._id
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        
        if (!task) {
            return res.status(404).json({ message: "Task not found or not authorized" });
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

        if (!task) {
            return res.status(404).json({ message: "Task not found or not authorized" });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}