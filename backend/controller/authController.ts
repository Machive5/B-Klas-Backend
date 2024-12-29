import { compareSync, hashSync } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { ErrorCodes, HttpException } from "../exception/httpException";
import { userSchema } from "../schema/auth";
import * as jwt from "jsonwebtoken";
import { REFRESH_KEY, ACCESS_KEY } from "../dotenv";
import { AuthException } from "../exception/authException";

export const signup = async (req:Request,res:Response,next:NextFunction) => {
    console.log(req.body);

    const request = userSchema.safeParse(req.body);
    if (!request.success) {
        next(new HttpException(400,"Invalid data",ErrorCodes.INVALID_DATA,request.error));
        return;
    }
    let user = await prismaClient.user.findFirst({where: {username:request.data?.username}});
    if (user) {
        next(new HttpException(400,"User already exists",ErrorCodes.USER_ALREADY_EXISTS,null));
        return;
    }
    
    try {
        user = await prismaClient.user.create({
            data: {
                username: request.data.username,
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
        user = await prismaClient.user.findFirst({where: {username: request.data?.username}});
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
        let refreshToken = jwt.sign({
            id: user.id,
            username: user.username,
            tokenType: "refresh token",
        },REFRESH_KEY as string,{expiresIn: "7d", algorithm: "HS256"});

        let accessToken = jwt.sign({
            id: user.id,
            username: user.username,
            tokenType: "access token"
        }, ACCESS_KEY as string, {expiresIn: "15m", algorithm: "HS256"});

        refreshToken = encodeURIComponent(refreshToken);
        accessToken = encodeURIComponent(accessToken);

        res.cookie('refreshToken',refreshToken,{
            expires: new Date(Date.now() + 7*24*3600000),
            httpOnly: true,
            secure: true,
        }).cookie('accessToken',accessToken, {
            expires: new Date(Date.now() + 15*600000),
            secure: true,
        });

        res.send({
            message: "login success"
        })

    } catch (error) {
        next(new HttpException(500,"Internal server error",ErrorCodes.INTERNAL_SERVER_ERROR,error));
        return;
        
    }
}

export const refresh = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            next(new AuthException("Token not found",null));
            return
        }
        
        const payload:any = jwt.verify(token, REFRESH_KEY as string);

        const user = await prismaClient.user.findFirst({where: {id: payload.id}});

        if (!user) {
            next(new AuthException("User not found",null));
            return;
        }

        let accessToken = jwt.sign({
            id: user.id,
            username: user.username,
            tokenType: "access token"
        }, ACCESS_KEY as string, {expiresIn: "15m", algorithm: "HS256"});
        accessToken = encodeURIComponent(accessToken);

        res.cookie('accessToken',accessToken, {
            expires: new Date(Date.now() + 15*600000),
            secure: true,
        });

        res.send({
            message: "access token updated"
        })


    } catch (error) {
        throw error;
        return;
    }
}