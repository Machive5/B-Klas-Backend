import express, { Express } from "express";
import rootRouter from "./route/root";
import {PORT} from "./dotenv";
import { PrismaClient } from "@prisma/client";
import { errorMidleware } from "./midleware/errorMidleware";

const app:Express = express();

app.use(express.json());
app.use("/api",rootRouter);

export const prismaClient = new PrismaClient({
    log: ["query"]
});
app.use(errorMidleware);

app.listen(PORT, () =>{console.log(`Server is running on PORT ${PORT}`)}); 