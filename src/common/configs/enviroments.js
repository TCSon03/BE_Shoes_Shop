import dotenv from "dotenv";
dotenv.config();

export const { DB_URI, HOST, PORT } = process.env;
