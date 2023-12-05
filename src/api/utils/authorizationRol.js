function authorizationRol(observerUser, response, idToken, refreshToken) {
  if (observerUser) {
      return response.status(200).json({
        message:"Welcome teacher",
        name:observerUser.name,
        idToken, 
        refreshToken
      }).header('Authorization', `Bearer ${idToken}`)
      .header('Refresh-Token', refreshToken);
    } else {
      return response.status(200).json({
        message:"Welcome student",
        name:observerUser.name,
        idToken, 
        refreshToken}).header('Authorization', `Bearer ${idToken}`)
        .header('Refresh-Token', refreshToken);
    }
}

export default authorizationRol;