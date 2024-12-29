import dotenv from "dotenv";

dotenv.config({path: "./backend/.env"});

export const PORT = process.env.PORT;

export const REFRESH_KEY = process.env.REFRESH_KEY; 
export const ACCESS_KEY = process.env.ACCESS_KEY;