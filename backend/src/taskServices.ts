import Task, { type TaskDoc } from "./models/task.js";


export const createNewTask = async (taskData: Partial<TaskDoc>): Promise<void> => {
    
    const task = new Task(taskData);

    if (!task) {
        throw new Error("Failed to initialize task");
    }
    
    const validationError = task.validateSync();
    if (validationError) {
        throw validationError;
    }

    await task.save()
    .then(() => console.log("Task created successfully"))
    .catch(err => console.error("Error creating task: ", err));
}

export const getAllTasks = async (): Promise<TaskDoc[]> => {
    try{
        const tasks = await Task.find();
        return tasks;
    } catch (err) {
        throw new Error("Error fetching tasks: " + err);
    }
}

export const updateTaskStatus = async (taskId: string, completedAt: Date): Promise<void> => {
    
    const task = await Task.findById(taskId);
    if(!task){
        throw new Error("Task not found");
    }
    
    task.status = "Completed";
    task.completedAt = completedAt;

    task.save()
    .then(() => console.log("Task status updated successfully"))
    .catch( err => console.error("Error updating task status: ", err));
}


export const deleteTask = async (taskId: string): Promise<void> => {
    Task.findById(taskId)
    .then( task => {
        if(!task || task.status !== "Completed"){
            throw new Error("Task not found or not completed");
        }
        return Task.findByIdAndDelete(taskId);
    })
    .catch( err => console.error("Error deleting task: ", err));
}