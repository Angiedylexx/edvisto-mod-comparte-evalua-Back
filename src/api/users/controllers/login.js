import UserEV from "../../../models/user.js";
import { schemaLogin } from "./validation.js";
import auth from "../../../config/firebase.js";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import authorizationRol from "../../utils/authorizationRol.js";

const login = async (request, response, next) => {
  try {
  
    const {error} = schemaLogin.validate(request.body);
    if (error) { 
      return response.status(400).json({error: "Bad Request"});
    }
    
    const { email, password } = request.body;

    const user = await UserEV.findOne({email});

    if (!user) {
      return response.status(403).json({ error:"Unauthorized Access" });
    } 
  
    try {
      const userLogin = await signInWithEmailAndPassword(auth, email, password);

      user.attemptsFailed = 0 ;
      user.blocked = false

      await user.save();

      const observerUser = await UserEV.findOne({email});

      const idToken = await userLogin.user.getIdToken();
      const refreshToken = userLogin.user.stsTokenManager.refreshToken;

      authorizationRol(observerUser, response, idToken, refreshToken);

    } catch (error) {

      if (error.code === "auth/wrong-password") {
        const attemptsAllowed = 3;    
        user.attemptsFailed += 1;
        if (user.attemptsFailed === attemptsAllowed){

          user.blocked = true;

          await sendPasswordResetEmail(auth, email); 
          await user.save();
          return response.status(403).json({ error:"Blocked account. A password reset email has been sent"});
        }

        await user.save();
        return response.status(400).json("Wrong Password")
      }
    } 
  } catch (error) { 
   if (error.message === "auth/too-many-requests") {
     return response.status(403).json("Blocked account. A password reset email has been sent")
   } next (error);
  }

};

export default login;