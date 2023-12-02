import { signInWithCustomToken } from "@firebase/auth";

import auth from "../../../config/firebase.js";
import adminFB from "../../../config/firebaseAdmin.js";

export async function authorization(request, response, next) {

  const idToken = request.headers.authorization
  let tokenVerify = null;


  try {  

    if(!idToken) {
      return response.status(401).json({ error: "Unauthorized."})
    }
    
    tokenVerify = await verifyIdToken(idToken);
  
  } catch (error) {
    if (error.message === "Token expired") {
      const refreshToken = request.headers["refresh-token"]
      const newIdToken = await signInWithCustomToken (auth, refreshToken);
      const uevoToken = await user.getIdToken();

      return uevoToken;


      request.user = { idtoken: newIdToken};
    }
  }

  request.user = {idtoken: tokenVerify };

  next();
};