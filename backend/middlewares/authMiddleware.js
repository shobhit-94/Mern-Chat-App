import { apierror } from "../utils/apierror.js";
import dotenv from "dotenv";
import User from "../models/usersModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
dotenv.config();

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const tokenProvided =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    // console.log(req.cookies);
    // console.log(tokenProvided);
    if (!tokenProvided) {
      throw new apierror(401, "Access denied No token provided");
    }
    const decodedtoken = jwt.verify(tokenProvided, process.env.JWT_SECRET);
    if (!decodedtoken) {
      throw new apierror(401, "Token is not matching");
    }
    // console.log("decodedtoken = ", decodedtoken);
    const user = await User.findById(decodedtoken?.id).select(
      "-password -token"
    );

    // console.log("user = ", user);
    if (!user) {
      throw new apierror(401, "Invalid access token");
    }
    // console.log("idher tak");
    req.user = user;

    // console.log("here");

    next();
  } catch (error) {
    throw new apierror(401, error?.message || "Invalid Access Token");
  }
});
export default verifyJWT;
