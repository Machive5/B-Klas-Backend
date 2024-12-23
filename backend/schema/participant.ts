import { z } from "zod";

export const idPropertySchema = z.object({
    id: z.number(),
});

export const namePropertySchema = z.object({
    name: z.string(),
});

export const getParticipantSchema = z.object({
    limit: z.number(),
    offset: z.number(),
});

export const allPropertySchema = z.object({
    name: z.string(),
    origin: z.string(),
    performance: z.string(),
    skor: z.number(),
    vote: z.number(),
    performed: z.boolean(),
});

