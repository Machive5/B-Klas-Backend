import express, { Express } from "express";
import rootRouter from "./route/root";
import PORT from "./dotenv";

const app:Express = express();

app.use(express.json());
app.use("/api",rootRouter);

app.listen(PORT); 