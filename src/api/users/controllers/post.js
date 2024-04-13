import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import auth from "../../../config/firebase.js";
import UserEV from "../../../models/user.js";
import partsDate from "../../utils/date.js";
import { schemaRegister } from "./validation.js";
import bcrypt

const mongoDBEmailDuplicate = 11000;

//Registro de usuario en firebas    
async function registerFirebase(request, response) {
  try {
    const { password, email } = request.body;

    const userFirebase = await createUserWithEmailAndPassword(auth, email, password);
      const userFB = userFirebase.user;
      
      //await sendEmailVerification(userFB); 
      return userFB;
      
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      response.status(409).json({error:"email is assigned to another user"});
    } else {
      const errorMessage = error.message
      response.status(500).json({ error: errorMessage });
    } 
    return { uid: null};
  }
}

export const registerMongoDB = async (request, response, next) => { 

//Registro 
  //Validacion de datos
  const {error} = schemaRegister.validate(request.body);
  if (error) { 
    return response.status(422).json({error: error.details[0].message}) 
  }

  try {

    let isoDate;

    const { name, lastName, birthdayDate, email, password, password2, securityQuestion, securityResponse, rol, acceptedTerms } = request.body;

    const emailRegistered = await UserEV.findOne({ email });
    if (emailRegistered) {
      return response.status(409).json({error:"Email Registered"})
    }
    
    if (password != password2) {
      return response.status(409).json({error:"The password do not match"})
    } 
  
    if (birthdayDate) {
      const dateInfo = partsDate(birthdayDate);
      const {day, month, year} = dateInfo;
        isoDate =`${year}-${month}-${day}T00:00:00.000Z`;
    }

    sal = bcrypt.g

    
    
    const userFB = await registerFirebase(request, response);
    
    if(userFB && userFB.uid) {

    //Creación de usuario en MongoDB
    const userMongoDBData = {
      uid: userFB.uid,
      name: name.toUpperCase(),
      lastName: lastName.toUpperCase(),
      email, 
      securityQuestion,
      securityResponse,
      rol,
      acceptedTerms,
    }

    if (isoDate) {
      userMongoDBData.birthdayDate = new Date(isoDate);
    }
      
    const userMongoDB = new UserEV(userMongoDBData);
    
      const userCreated = await userMongoDB.save();
        response.status(201).json({
          message:"User created and stored successfully",
          data: userCreated
        })  
    }
  } catch (error) { 
    if (error.code === mongoDBEmailDuplicate || error.keyPattern || error.keyValue) {
      return response.status(409).json({error:"email is assigned to another user"});
      } else if (error.message === "Invalid date" || error.message === "Wrong date format") {
        return response.status(422).json("Invalid date.");
      } else {
      next (error)
      } 
  };
}

export default registerMongoDB;