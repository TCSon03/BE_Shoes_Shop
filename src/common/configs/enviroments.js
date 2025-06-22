import dotenv from "dotenv";
dotenv.config();

export const { DB_URI, HOST, PORT, JWT_SECRET, JWT_EXPIRATION, JWT_SECRET_KEY_FOR_EMAIL, JWT_EXPIRES_IN_FOR_EMAIL, EMAIL_PASSWORD } = process.env;
