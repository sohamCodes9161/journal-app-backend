import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  AES_SECRET_KEY: process.env.AES_SECRET_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,

  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,

  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

if (
  !env.PORT ||
  !env.MONGO_URI ||
  !env.JWT_ACCESS_SECRET ||
  !env.JWT_REFRESH_SECRET ||
  !env.AES_SECRET_KEY
) {
  console.error(
    "Missing required environment variables. Please check your .env file."
  );
  process.exit(1);
}
