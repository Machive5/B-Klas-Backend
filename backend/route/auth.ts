import { Router } from "express";
import { signin, signup } from "../controller/auth";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.get("/signin", signin);

export default authRouter;