import express from "express";
import { upload } from "../middlewares/multer.js";
// import { router } from 'express'
const router = express.Router();
import  verifyJWT  from "../middlewares/authMiddleware.js";

import {
  registeruser,
  loginuser,
  getallSearchedRealatedUsers,
  GetAllUsers,
} from "../Controllers/userController.js";
// router.route("/register")
//  .post(
//   upload.fields([
//     {
//       name: "pic",
//       maxcount: 1//ek bari me max kitne avatar le sakta hai
//     }
//   ]),(registeruser))
// Register route with single image upload
router.post("/register", upload.single("pic"), registeruser);
router.route("/login").post(loginuser);
// router.route("/register").post(registeruser);
router.route("/login").post(loginuser);
router.route("/").get(verifyJWT, getallSearchedRealatedUsers);
router.route("/getall").get(verifyJWT, GetAllUsers);

export default router;
