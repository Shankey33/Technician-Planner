import { Schema, model, Document } from "mongoose";

export interface TaskDoc extends Document {
    customerName: String;
    location: String;
    taskType: "Installation" | "Repair" | "Maintenance" | "Inspection";
    scheduledTime: Date;
    notes?: string;
    status: "Pending" | "Completed";
    completedAt?: Date;
}


const TaskSchema = new Schema<TaskDoc>({
    
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    taskType: {
      type: String,
      enum: ["Installation", "Repair", "Maintenance", "Inspection"],
      required: true,
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Task = model<TaskDoc>("Task", TaskSchema);

export default Task;