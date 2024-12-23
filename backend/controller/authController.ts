import { compareSync, hashSync } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { ErrorCodes, HttpException } from "../exception/httpException";
import { userSchema } from "../schema/auth";
import * as jwt from "jsonwebtoken";
import * as cryptoJs from "crypto-js";
import { SECRET_KEY } from "../dotenv";

export const signup = async (req:Request,res:Response,next:NextFunction) => {

    const request = userSchema.safeParse(req.body);
    if (!request.success) {
        next(new HttpException(400,"Invalid data",ErrorCodes.INVALID_DATA,request.error));
        return;
    }
    let user = await prismaClient.user.findFirst({where: {name:request.data?.name}});
    if (user) {
        next(new HttpException(400,"User already exists",ErrorCodes.USER_ALREADY_EXISTS,null));
        return;
    }
    
    try {
        user = await prismaClient.user.create({
            data: {
                name: request.data.name,
                password: hashSync(request.data.password, 10),
            }
        });
    } catch (error) {
        next(new HttpException(500,"Internal server error",ErrorCodes.INTERNAL_SERVER_ERROR,error));
        return;
        
    }

    res.status(200).send({ 
        message: "User created successfully",
    }).json();
}

export const signin = async (req:Request,res:Response,next:NextFunction) => {
    const request = userSchema.safeParse(req.body);
    if (!request.success) {
        next(new HttpException(400,"Invalid data",ErrorCodes.INVALID_DATA,request.error));
        return;
    }
    let user;
    try {
        user = await prismaClient.user.findFirst({where: {name: request.data?.name}});
    } catch (error) {
        next(new HttpException(500,"Internal server error",ErrorCodes.INTERNAL_SERVER_ERROR,error));
        return;
    }

    if (!user) {
        next(new HttpException(404,"User not found",ErrorCodes.USER_NOT_FOUND,null));
        return;
    }

    if(user && !compareSync(request.data.password,user.password)){
        next(new HttpException(401,"Invalid password",ErrorCodes.INVALID_PASSWORD,null));
        return;
    }

    try {
        let token = jwt.sign({
            id: user.id,
            name: user.name,
        },SECRET_KEY as string,{expiresIn: "48h", algorithm: "HS256"});

        token = cryptoJs.AES.encrypt(token,SECRET_KEY as string).toString();

        res.json({
            user,
            token: token,
        });
    } catch (error) {
        next(new HttpException(500,"Internal server error",ErrorCodes.INTERNAL_SERVER_ERROR,error));
        return;
        
    }
}