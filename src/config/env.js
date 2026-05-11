import dotenv from "dotenv";

dotenv.config();


export const env = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGO_URI: process.env.MONGO_URI,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET, 
};

if(!env.PORT || !env.MONGO_URI || !env.JWT_ACCESS_SECRET || !env.JWT_REFRESH_SECRET) {
    console.error("Missing required environment variables. Please check your .env file.");
    process.exit(1);
}   