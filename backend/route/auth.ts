import { Router } from "express";
import { signin, signup, refresh} from "../controller/authController";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/refresh", refresh);

export default authRouter;