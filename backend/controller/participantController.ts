import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { ErrorCodes, HttpException } from "../exception/httpException";
import { allPropertySchema, idPropertySchema, namePropertySchema } from "../schema/participant";
import { authMidleware } from "../midleware/authMidleware";

export const createParticipant = async (req:Request, res:Response, next:NextFunction)=>{
    const request = allPropertySchema.safeParse(req.body);

    if (!request.success){
        next(new HttpException(400,"Invalid data",ErrorCodes.INVALID_DATA,request.error));
        return;
    }

    try {
        await prismaClient.participant.create({
            data: {
                name: request.data.name,
                origin: request.data.origin,
                performance: request.data.performance,
                skor: request.data.skor,
                vote: request.data.vote,
                performed: request.data.performed
            }
        });
        res.status(200).send({ 
            message: "Participant created successfully",
        }).json();
    } catch (error) {
        
    }
}

export const getAllParticipants = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const participants = await prismaClient.participant.findMany();
        res.status(200).send({ 
            participants,
        }).json();
    }
    catch (error) {
        next(new HttpException(500,"Internal server error",ErrorCodes.INTERNAL_SERVER_ERROR,error));
    }
}

export const getParticipantByName = async (req: Request, res:Response, next:NextFunction) => {
    let request = namePropertySchema.safeParse(req.params);
    if (!request.success) {
        next(new HttpException(400,"Invalid data",ErrorCodes.INVALID_DATA,request.error));
        return;
    }

    try {
        const participants = await prismaClient.participant.findMany({where: 
            {name: {
                contains: request.data?.name,
                mode: "insensitive",
            }}});
        res.status(200).send({ 
            participants,
        }).json();
    }
    catch (error) {
        next(new HttpException(500,"Internal server error",ErrorCodes.INTERNAL_SERVER_ERROR,error));
    }
}

export const getParticipantById = async (req: Request, res:Response, next:NextFunction) => {
    let request = idPropertySchema.safeParse({
        id:parseInt(req.params.id)
    });

    if (!request.success) {
        next(new HttpException(400,"Invalid data",ErrorCodes.INVALID_DATA,request.error));
        return;
    }

    try {
        const participant = await prismaClient.participant.findUnique({where: {id: request.data?.id}});
        res.status(200).send({ 
            participant,
        }).json();
    }
    catch (error) {
        next(new HttpException(500,"Internal server error",ErrorCodes.INTERNAL_SERVER_ERROR,error));
    }
}

export const updateParticipant = async (req:Request, res:Response, next:NextFunction) => {
    let id = idPropertySchema.safeParse({
        id:parseInt(req.params.id)
    });
    let request = allPropertySchema.safeParse(req.body);

    if (!request.success) {
        next(new HttpException(400,"Invalid data",ErrorCodes.INVALID_DATA,request.error));
        return;
    }

    if (!id.success) {
        next(new HttpException(400,"Invalid data",ErrorCodes.INVALID_DATA,id.error));
        return;
    }

    try {
        await prismaClient.participant.update({
            where: {
                id: id.data?.id
            }, 
            data:{
                name: request.data.name,
                origin: request.data.origin,
                performance: request.data.performance,
                performed: request.data.performed,
                skor: request.data.skor,
                vote: request.data.vote,
            }
        });
        res.status(200).send({ 
            message: "update success",
        }).json();
    }
    catch (error) {
        next(new HttpException(500,"Internal server error",ErrorCodes.INTERNAL_SERVER_ERROR,error));
    }
}

export const deleteParticipant = async (req: Request, res:Response, next:NextFunction) => {
    let request = idPropertySchema.safeParse({
        id: parseInt(req.params.id)
    });

    if (!request.success) {
        next(new HttpException(400,"Invalid data",ErrorCodes.INVALID_DATA,request.error));
        return;
    }

    try {
        await prismaClient.participant.delete({
            where: {
                id: request.data?.id
            }
        });
        res.status(200).send({ 
            message: "delete success",
        }).json();
    }
    catch (error) {
        next(new HttpException(500,"Internal server error",ErrorCodes.INTERNAL_SERVER_ERROR,error));
    }
}
