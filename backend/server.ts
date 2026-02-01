import connectDB from "./src/config/db.js";
import express from "express";
import cors from "cors";
import ENV from "./src/lib/env.js";
import taskRouter from "./src/routes/taskRoutes.js";

const app = express();

app.use(cors({ origin: ENV.FRONTEND_URL}));
app.use(express.json());

app.use("/api/tasks", taskRouter);

app.get('/health', (_, res) => {
    res.status(200).json({ message: "Server is up and running" });
})

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`Backend Server started at http://localhost:${ENV.PORT}`);
        })
    } catch (err: any) {
        console.log("Error starting the server: ", err);
        process.exit(1);
    }
}

startServer();