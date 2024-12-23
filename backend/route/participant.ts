import { Router } from "express";
import { createParticipant, deleteParticipant, getAllParticipants, getParticipantById, getParticipantByName, updateParticipant } from "../controller/participantController";
import { authMidleware } from "../midleware/authMidleware";

const participantRouter = Router();

participantRouter.get("/",getAllParticipants); // get all participant

participantRouter.get("/id/:id?",getParticipantById); // get participant by id

participantRouter.get("/name/:name?",getParticipantByName); // get participant by name

participantRouter.post("/",[authMidleware],createParticipant); // create participant

participantRouter.put("/id/:id?",[authMidleware],updateParticipant); // update participant by id

participantRouter.delete("/id/:id?",[authMidleware],deleteParticipant); // delete participant by id

export default participantRouter;