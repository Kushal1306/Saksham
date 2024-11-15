import express from 'express';
import { getInterviewData,createCampaign,AddCandidate, inviteToInterview } from '../controllers/saksham.js';

const sakshamRouter=express.Router();

sakshamRouter.get("/interview/:candidateId",getInterviewData);

sakshamRouter.post("/campaign",createCampaign);

sakshamRouter.post("/candidate",AddCandidate);

sakshamRouter.post("/invite/:interviewId",inviteToInterview)




export default sakshamRouter;