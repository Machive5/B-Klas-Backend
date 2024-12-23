import * as cryptoJS from "crypto-js";
import * as jwt from "jsonwebtoken";
import { AuthException } from "../exception/authException";
import { prismaClient } from "..";
import { NextFunction, Request, Response } from "express";

export const authMidleware = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            next(new AuthException("Token not found",null));
            return
        }

        const byte = cryptoJS.AES.decrypt(token, process.env.SECRET_KEY as string);    
        const decrypt = byte.toString(cryptoJS.enc.Utf8);
        
        const payload:any = jwt.verify(decrypt, process.env.SECRET_KEY as string);

        const user = await prismaClient.user.findFirst({where: {id: payload.id}});

        if (!user) {
            next(new AuthException("User not found",null));
            return;
        }

        next();
    } catch (error) {
        next(new AuthException("Invalid token",error));
        return;
    }
}