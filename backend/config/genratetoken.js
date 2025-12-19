import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const genrateToken = (id) => {
  // console.log("id recived",id)
  return jwt.sign(
    // { id:id }, // payload
    { id}, // payload
    process.env.JWT_SECRET, // secret key (must exist in .env)
    { expiresIn: "2d" } // options
  );
};
export default genrateToken;
