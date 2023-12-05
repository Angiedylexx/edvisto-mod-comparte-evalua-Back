import mongoose from "mongoose"; 
import UserEV from "../../../models/user.js";
import StudentsFeedback from "../../../models/feedback.js";
import Assignment from "../../../models/assignment.js";
import { schemaDelivery } from "./validation.js";
import isValidObjectId from "../../utils/valid.js"

async function delivery (request, response, next) {

  const mongoDBEmailDuplicate = 11000;

  try {
    const { emailStudent, videoURL } = request.body;
    const assignmentId = request.params.id

    isValidObjectId(assignmentId, response);

    //Validación de datos
    const {error} = schemaDelivery.validate(request.body);
    if (error) { 
      return response.status(422).json({error: error.details[0].message}) 
    }
     
    //El estudiante esta asignado
    const isAssigned = await Assignment.findOne({
      _id:assignmentId,
      emailStudents: {$in: [emailStudent]},
    })
      .select("course title startDate finishDate")
      .exec();
    
    if (!isAssigned) {
      return response.status(404).json({
        error:"Assignment not Found or project not assigned to student"
      })
    }

    //Verificación que sea un email de estudiante
    const student = await UserEV.findOne({email:emailStudent, rol:"Soy Estudiante"});
    if (!student) {
      return response.status(404).json({
        error:"Unregistered student email"
      })
    }
        
    const currentDate = new Date(); 
     
    if (!('finishDate' in isAssigned && 'startDate' in isAssigned)) {     
      if (isAssigned.startDate !== undefined && isAssigned.finishDate !== undefined) {
        const startDate = new Date(isAssigned.startDate);
        const finishDate = new Date(isAssigned.finishDate);
        if (startDate > currentDate || currentDate > finishDate ) {
          return response.status(403).json({
          message:("Delivery out of dates")
        })
      }
      } 
    }

    //Creación de entrega
    const delivery = await new StudentsFeedback({
      assignmentId : assignmentId,
      course: isAssigned.course,
      title: isAssigned.title,
      emailStudent,
      videoURL,
      qualified: false,
    });

    //Almacenamiento de la entrega
    const saveDelivery = await delivery.save();

    return response.status(201).json({
      message:("Successfully delivered"),
      data: saveDelivery
    })

  } catch (error) { 
    if  (error.code === mongoDBEmailDuplicate) {
      return response.status(409).json({error:"URL is assigned to another user"});
    } next (error)
  }
}

export default delivery;