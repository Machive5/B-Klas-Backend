import * as jwt from "jsonwebtoken";
import { AuthException } from "../exception/authException";
import { prismaClient } from "..";
import { NextFunction, Request, Response } from "express";
import { ACCESS_KEY } from "../dotenv";

export const authMidleware = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = decodeURIComponent(req.headers.authorization?.split(" ")[1] || "");
        console.log(token);
        

        if (!token) {
            next(new AuthException("Token not found",null));
            return
        }
        
        const payload:any = jwt.verify(token, ACCESS_KEY as string);

        const user = await prismaClient.user.findFirst({where: {id: payload.id}});

        if (!user) {
            next(new AuthException("User not found",null));
            return;
        }

        next();
    } catch (error) {
        console.log(error);
        
        next(new AuthException("Invalid token",error));
        return;
    }
}