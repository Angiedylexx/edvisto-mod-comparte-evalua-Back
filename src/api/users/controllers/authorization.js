import auth from "../../../config/firebase.js";
import adminFB from "../../../config/firebaseAdmin.js";

export async function authorization(request, response, next) {

  const adminAuth = adminFB.auth();

  const idToken = request.headers.authorization;
  let tokenVerify = null;

  try {  

    if(!idToken) {
       return response.status(401).json({ error: "Unauthorized."})
    }
    
    tokenVerify = await adminAuth.verifyIdToken(idToken, true);

    if(!tokenVerify) {
      return response.status(401).json({ error: "Unauthorized."})
    }
 
  } catch (error) {
    if (error.message.includes("Decoding Firebase ID token failed")) {
      return response.status(401).json({ error: "Decoding Firebase ID token failed"});
    } else if (error.message.includes("Firebase ID token has invalid signature")) {
      return response.status(401).json({ error: "Firebase ID token has invalid signature"});
    } else  {
      return response.status(401).json({ error: "Failed to refresh token. Log in again"})
    }

  }
  request.user = {idtoken: tokenVerify};
  next();
}

export default authorization