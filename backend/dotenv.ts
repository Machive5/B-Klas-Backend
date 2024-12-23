import dotenv from "dotenv";

dotenv.config({path: "./backend/.env"});

export const PORT = process.env.PORT;

export const SECRET_KEY = process.env.SECRET_KEY; 