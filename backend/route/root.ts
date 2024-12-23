import { Router } from "express";
import authRouter from "./auth";
import participantRouter from "./participant";

const rootRouter = Router();

rootRouter.use("/auth",authRouter);
rootRouter.use("/participant",participantRouter);

export default rootRouter;