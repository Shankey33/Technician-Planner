import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    throw new Error("Connection URL is not defined in environment variables");
}

const ENV = {
    MONGO_URL: MONGO_URL,
    PORT: Number(process.env.PORT),
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    FRONTEND_URL: process.env.FRONTEND_URL,
}

export default ENV;
