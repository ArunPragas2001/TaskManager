import Task from "../models/taskModel.js";

export const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    }
    catch (error) {
        res.status(201).json({ message: error });
    }
};

export const getTasks = async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);

};

export const updateTask = async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);

};

export const deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
}