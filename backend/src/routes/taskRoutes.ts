import { Router } from "express";
import { createTask, fetchAllTasks, updateTask, deleteGivenTask } from "../controller/taskController.js";

const taskRouter = Router();



taskRouter.post("/", createTask);
taskRouter.get("/", fetchAllTasks);
taskRouter.patch("/:id", updateTask);
taskRouter.delete("/:id", deleteGivenTask);


export default taskRouter;