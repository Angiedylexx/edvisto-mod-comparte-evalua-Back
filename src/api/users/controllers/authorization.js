import { signInWithRefreshToken } from "firebase/auth";
import auth from "../../../config/firebase.js";
import adminFB from "../../../config/firebaseAdmin.js";

export async function authorization(request, response, next) {

  const adminAuth = adminFB.auth();

  const idToken = request.headers.authorization;
  const refreshToken = request.headers['refresh-token'];
  let tokenVerify = null;
  console.log(request.headers);
  console.log('Received token:', idToken);
  console.log('Refresh-Token:', refreshToken);

  try {  

    if(!idToken) {
      console.log('No token provided. Unauthorized.');
      return response.status(401).json({ error: "Unauthorized."})
    }
    
    tokenVerify = await adminAuth.verifyIdToken(idToken, true);

    if(!tokenVerify) {
      console.log('No token provided. Unauthorized.');
      return response.status(401).json({ error: "Unauthorized."})
    }
 
  } catch (error) {
    console.error('Error during token verification:', error.message);
    if (error.message.includes("Decoding Firebase ID token failed")) {
      return response.status(401).json({ error: "Decoding Firebase ID token failed"});
    } else if (error.message.includes("Firebase ID token has invalid signature")) {
      return response.status(401).json({ error: "Firebase ID token has invalid signature"});
    } else if (error.code === 'auth/id-token-expired') {
      console.warn("Token de acceso expirado. Generando uno nuevo...");

      console.log("Entro al try");
      const newIdToken = await auth.signInWithRefreshToken(refreshToken);
      console.log(newIdToken);
      
      request.user = { idtoken: newToken};
      
      next();
      return;

    } else {
      console.error("Error inesperado:", error);
        return response.status(401).json({ error: "Failed to refresh token."})
    }

  }
  request.user = {idtoken: tokenVerify};
  //console.log(request);
  //console.log(request.user);
  next();
}

export default authorization

//"idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNhM2JkODk4ZGE1MGE4OWViOWUxY2YwYjdhN2VmZTM1OTNkNDEwNjgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdGVhbS05LWJhY2stYXNwIiwiYXVkIjoidGVhbS05LWJhY2stYXNwIiwiYXV0aF90aW1lIjoxNzAxODAzMDU4LCJ1c2VyX2lkIjoiUnM4c29wcVl2aGVDSTlscWx4NTZXSmlTenI1MiIsInN1YiI6IlJzOHNvcHFZdmhlQ0k5bHFseDU2V0ppU3pyNTIiLCJpYXQiOjE3MDE4MDMwNTgsImV4cCI6MTcwMTgwNjY1OCwiZW1haWwiOiJtb25pY2FzYWVuekBleGFtcGxlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJtb25pY2FzYWVuekBleGFtcGxlLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.K1017MQbhkAdyLs3j0AUW-YqPPd8mW6eDvKDu8qBECdMQO9UsfrjseU8UMmTOYsaxgvAV7vLe3T8F8y1A3QjZV_SUEePDjBEEvFBSZewaXZPnka4PtX_HX-bziFwPuiGbRXqj9tGPEA5BvHdrF-xBll16AM-DJOIJ7qtp8j67tHdx-fT75MPMWVAerSYAwQ_o3ml39JkLaLB2J_VDwXDOoxgUwQm-HlxJugghzWKrlfJLiS1NNyKwLFajvccbc-PVj9S66OH1bOPt7ZHbt2WSmyyajPOIp5Gg-I1nWgQEdg4h3ao485N6AP3VhDkKXj4a9vzdT5pyG1HZk9BpFUpmQ",
//"refreshToken": "AMf-vBw77q-2uyiegCVcU9PFwzCNwp0oz_t3GOUIF_9FPLM6iPFKYhrrdAyBEEwFALD0ZteWi1b4IBF2Ih9e-6bcn0FofCA8A51z3Pf-LFoo9eROaKRYrjCfgupjQXhTZVtEdxRLflpa_1XIc9ubC5eZBvx3Udh-p9Xomg2nRcBYYNpZZROmOd1_rCRdA19FzVkI2ZHSA2bqSzBFPks9y4IyAz225zOzgQ"

//Expirado
//"idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNhM2JkODk4ZGE1MGE4OWViOWUxY2YwYjdhN2VmZTM1OTNkNDEwNjgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdGVhbS05LWJhY2stYXNwIiwiYXVkIjoidGVhbS05LWJhY2stYXNwIiwiYXV0aF90aW1lIjoxNzAxNzk2MjQ0LCJ1c2VyX2lkIjoiUnM4c29wcVl2aGVDSTlscWx4NTZXSmlTenI1MiIsInN1YiI6IlJzOHNvcHFZdmhlQ0k5bHFseDU2V0ppU3pyNTIiLCJpYXQiOjE3MDE3OTYyNDQsImV4cCI6MTcwMTc5OTg0NCwiZW1haWwiOiJtb25pY2FzYWVuekBleGFtcGxlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJtb25pY2FzYWVuekBleGFtcGxlLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.SVPix6otVmEynYbNve03DkMyRREyBZ3hMWKDsyXYtPbDu-VbC3Ux3ks3XdZvjGlGFrHk445rOCQJWqEOu-cLDYuL3IO1umSW5-1F1UhO5aGBVj-Nf7KacUSIgGqEc2vo7Z5KOzQ7Vcaej8F_YFu705FJ7BFsfkepc0cU66iH5tFK7waDnYhUpLKMxht1zOF509biHp02_tg8blCIWMEgEj63szEDoFbDzNBh-AO8nCFQZY81mhaqvUAgNA59rKUde-vYjdl00e1l8QwFNHpbn_TWLaiUCytZCA471I_3VH3xpw7RIadMU-rXuCnlA3oLANkU9e4BylTGJsa6w1eW_g",
//"refreshToken": "AMf-vBxO2jSXXwjTut57KXFuYpovZI0LxKi4YCCVL4oV7GQBF_JvG1-XQ7WjZzUpKWHWbioOkTDpHJ6uzzM8SZYw4y6vDXU5MiAUSs1DN10XZJ1KtyzIn9XGUqbwlRmLt4c_cGRz5whpODSlf_ivlY49xKBvnr6WImwjGBpNFTQlQZxSf-fNq7MTfdFu1o4Z3e1JLgGys0cEcR5zY__hoWukbXXY078BIA"
