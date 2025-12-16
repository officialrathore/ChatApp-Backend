import jwt from "jsonwebtoken";

export const createTokenAndSaveCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,          
    sameSite: "none",      
    path: "/",             
  });

  return token;
};
