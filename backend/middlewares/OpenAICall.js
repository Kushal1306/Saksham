import OpenAI from 'openai';
import dotenv from 'dotenv';
import ConversationModel from '../models/ChatHistory.js';
import Candidate from '../models/Candidate.js';

dotenv.config();

const openai=new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
});



const getConversationHistory=async(conversationId)=>{
    try {
        const Conversation=await ConversationModel.findOne({
            conversationId:conversationId
          });
        return Conversation ? Conversation.messages:[];
        
    } catch (error) {
        console.log(error);
    }
};

const updateConversationHistory = async (conversationId, newMessage) => {
    try {
        await ConversationModel.updateOne(
            { conversationId:conversationId},
            { $push: { messages: newMessage } },
            { upsert: true }
          );
    } catch (error) {
        console.log("error occured:",error.message);
    }
    
  };
export const getJDData=async(candidate_id)=>{
    try {
        const JDdata = await Candidate.findById(candidate_id)
        .populate('campaign_id') 
        .exec();
    if(!JDdata)
        return null;
    return JDdata.campaign_id;
    } catch (error) {
        console.log("error occured:",error.message);   
        return null;
    }
}

const activeJDS = new Map();
const campaignData=new Map();

export const llmCall=async(userReply,conversationId)=>{
    try {
        let jd,questions,campaign_id;
        if(campaignData.has(conversationId)){
            campaign_id=campaignData.get(conversationId);
            const data=activeJDS.get(campaign_id);
            jd=data.jd;
            questions=data.questions;

        }
        else{
            const JDdata=await getJDData(conversationId);
            console.log("jd data is",JDdata);
            activeJDS.set(JDdata._id,{
                 jd:JDdata.job_description,
                 questions:JDdata.questions
            });
            campaignData.set(conversationId,JDdata._id)
            jd=JDdata.job_description;
            questions=JDdata.questions;
            
        }
       
        const history=await getConversationHistory(conversationId);
        // const history = await getConversationHistory(callId) || [];
        // const messages=[
        //     {role:"system",content:"You are helpful assistant."},
        //     ...history,
        //     {role:"user",content:userReply}
        // ];
        // const messages = [
        //     { role: "system", content: "You are Saksham, prescreening assistant from Kushal Consultancies. I have already introduced you to the user. Do not act like a bot. Act naturally and ask one question at a time. Please start by asking: 'What’s your experience with React and Next.js?' Then continue with: 'How comfortable are you with Node.js or Nest.js backends?' followed by 'How proficient are you in Typescript?' Ask 'Have you built UIs from scratch? Can you share an example?' next, then 'Do you have experience with Figma, Tailwind CSS, or Zustand?' Finally, ask: 'What’s your experience with Postgres/SQL and Prisma?'" },
        //     ...history,
        //     { role: "user", content: userReply }
        //   ];
        const messages = [
            { 
                role: "system", 
                content: `You are Saksham, a prescreening assistant from Kushal Consultancies. Firstly Introduce Yourselves. Act naturally, asking one question at a time, and assess the candidate on technical, behavioral, communication skills, availability, and compensation expectations. Use the job description: ${jd} as a guide. You may ask up to 10 questions total, including:
                
                1. Start by asking the candidate to introduce themselves.
                2. Ask about their relevant experience with technologies in the job description.
                3. Evaluate their problem-solving skills by discussing past challenges and resolutions.
                4. Assess communication skills by asking them to explain a complex topic simply.
                5. Ask about their experience working in teams or handling interpersonal challenges.
                6. Discuss their availability for the role and if they have any upcoming commitments.
                7. Ask about their expectations for compensation and growth.
                8. Confirm technical details like their experience with specific tools or frameworks listed in the job description.
                9. Inquire about their comfort level with potential job responsibilities and deadlines.
                10. Finally, conclude the interview by thanking them and asking if they have any questions, then let them know they can end the call.`
            },
            ...history,
            { role: "user", content: userReply }
        ];
        

        const response=await openai.chat.completions.create({
            model:"gpt-4o-mini",
            messages:messages
        });

        const assistantReply=response.choices[0].message.content;

        await updateConversationHistory(conversationId,{role:"user",content:userReply});

        await updateConversationHistory(conversationId,{role:"assistant",content:assistantReply});

        return assistantReply;

        
    } catch (error) {
        console.log(error);
    }
}
