import jwt from "jsonwebtoken";

export const checkToken = (token: string, secret: string) => {
  try{
    const decodedToken: any = jwt.verify(token, secret);
    if (decodedToken.exp * 1000 < Date.now()) {
      return true;
    } else {
      return false;
    }
  }catch(e){
    return true;
  }
};
