import type { Request, Response } from "express";
import { createNewTask, getAllTasks, updateTaskStatus, deleteTask } from "../services/taskServices.js";

export const createTask = async (req: Request, res: Response) => {
    try{
        const { customerName, location, taskType, scheduledTime, notes } = req.body;

        const newTask = await createNewTask({ customerName, location, taskType, scheduledTime, notes });

        res.status(201).json({message: "Task created successfully"});
    }catch(error){
        res.status(500).json({ message: "Failed to create task", error });
    }
}

export const fetchAllTasks = async (req: Request, res: Response) => {
    try{
        const tasks = await getAllTasks();
        res.status(200).json(tasks);
    }catch(error){
        res.status(500).json({ message: "Failed to fetch tasks", error });
    }
}


export const updateTask = async (req: Request, res: Response) => {
    try{
        const taskId = String(req.params.id);
        const { completedAt } = req.body;
        await updateTaskStatus(taskId, completedAt);
        res.status(200).json({ message: "Task updated successfully" });
    }catch(error){
        res.status(500).json({ message: "Failed to update task", error });
    }
}

export const deleteGivenTask = async (req: Request, res: Response) => {
    try{
        const taskId = String(req.params.id);
        await deleteTask(taskId);
        res.status(200).json({ message: "Task deleted successfully" });
    }catch(error){
        res.status(500).json({ message: "Failed to delete task", error });
    }
}
