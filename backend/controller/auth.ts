import { Request,Response } from "express";

export const signup = (req:Request,res:Response) => {
    res.send("Signup Route");
}

export const signin = (req:Request,res:Response) => {
    res.send("Signin Route");
}