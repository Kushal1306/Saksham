import mongoose from 'mongoose';
const feedbackSchema = new mongoose.Schema({
    candidate_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Candidate', 
      required: true, 
      index: true // Index on candidate_id
    },
    campaign_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Campaign', 
      required: true, 
      index: true // Index on interview_id
    },
    interview_summary: { type: String, required: true },
    strengths: [{ type: String }],  
    weaknesses: [{ type: String }],  
    parameters: {                    
      type: Object,                 
      required: true          
    }
  });
  
  const Feedback = mongoose.model('Feedback', feedbackSchema);

  export default Feedback;