import express, { Application, Express } from "express";
import rootRouter from "./route/root";
import {PORT} from "./dotenv";
import { PrismaClient } from "@prisma/client";
import { errorMidleware } from "./midleware/errorMidleware";
import cors, { CorsOptions } from "cors";
import mutler from "multer";
import cookieParser from "cookie-parser"

const app:Application = express();
const upload = mutler(); //use mutler to enable get form request

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOption:CorsOptions = {
    origin: true, // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true
}

app.use("/api",upload.none(),cors(corsOption),rootRouter); //cors and mutler must used here

export const prismaClient = new PrismaClient({
    log: ["query"]
});

app.use(errorMidleware);

app.listen(PORT, () =>{console.log(`Server is running on PORT ${PORT}`)}); 