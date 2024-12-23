import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exception/httpException";

export const errorMidleware = (err:HttpException, req:Request, res:Response, next:NextFunction) => {
    res.status(err.status).json({
        message: err.message,
        errorCode: err.errorCode,
        error: err.error,
    });
}