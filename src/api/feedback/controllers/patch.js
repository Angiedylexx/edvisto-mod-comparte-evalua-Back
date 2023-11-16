import mongoose from "mongoose"; 
import StudentsFeedback from "../../../models/feedback.js"
import { schemaFeedback } from "./validation.js";

async function studentFeedback(request, response, next) {
  try {
    const id = request.params.id

    //Validación de datos
    const { error, value } = schemaFeedback.validate(request.body);

	  if (!value.feedback?.skills) {
		return response.status(400).json({ error: 'Qualification must not be empty' })
	  }

    if (error) { 
    return response.status(400).json({error: error.details[0].message}) 
    }
    
    //Validación de existencia del id de la asiganción
    if (!mongoose.isValidObjectId(id)) {
      return response.status(422).json({message: "Id Not Valid"})
    }
 
    //feedback
    const feedback = await StudentsFeedback.findByIdAndUpdate(id , {feedback:request.body.feedback, qualified:true} , {new:true});
    if (!feedback) {
      return response.status(404).json({
        message:"Delivery Not Found"})
    }
    
    return response.status(201).json({
      message:("Successfully classified project"),
      data: feedback
    })
  } catch(error) {
    next(error)
  }
}

export default studentFeedback;