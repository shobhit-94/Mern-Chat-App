import asyncHandler from "express-async-handler";
import User from "../models/usersModel.js";
import Chat from "../models/chatModel.js";
import genrateToken from "../config/genratetoken.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";

import dotenv from "dotenv";
import mongoose from "mongoose";

const registeruser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // const { name, email, password,pic } = req.body;

    // console.log("name = ", name);
    // console.log("email = ", email);
    // console.log("password = ", password);
    // console.log("pic = ", pic);
    // if (name === "" || email === "" || password === "" )
    //   throw new apiError(400, "Please enter all the details carefully");
    if (!name || !email || !password)
      throw new Error(401, "Please enter all the details carefully");

    const existedUser = await User.findOne({
      // $or: [{ name: name.trim() }, { email }],
      email: email,
    });

    if (existedUser) {
      // console.log("user already exists");
      throw new Error(400, "User with this email already registered");
    }
    //  console.log("hello");

    const piclocalpath = await req.file?.path; //multer se upload hoga or date_time ki help se piclocalpath
    // recive hoga  phir vo path ki help se clodinary pe image upload hogi
    // console.log("idher");
    if (!piclocalpath) {
      // console.log("piclocalpath doesnot exist");
      throw new Error(400, "piclocalpath doesnot exist");
    }

    const pic = await uploadoncloudinary(piclocalpath);

    const user = await User.create({
      name,
      pic: pic || "",
      email,
      password,
    });
    if (!user) {
      throw new Error(400, "Something went wrong while creating the user");
    }

    // console.log("everything is correct");
    return res
      .status(201)
      .json({ message: "User registered successfuly", user });
  } catch (error) {
    // res.status(400);
    return res
      .status(500)
      .json({ message: error.message || "Failed to register user" });
  }
});

const loginuser = asyncHandler(async (req, res) => {
   console.log("yaha tak aa gya");
  const { email, password } = req.body;
  // console.log("email = ", email);
  // console.log("password = ", password);
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  const user_present = await User.findOne({
    // $and: [{ email }],
    email,
  });
  if (!user_present) {
    // console.log("user is not present");
    return res
      .status(400)
      .json({ message: "User with this email is not present" });
  }
 
  const ispasswordcorrect = await user_present.ispasswordcorrect(password);
  if (!ispasswordcorrect) {
    return res
      .status(400)
      .json({ message: "please enter the correct password" });
    //your entered passsword is not matching with your db password
  }
  // console.log("user._id = ", user_present._id);
  const userid = user_present._id;
  // console.log("userid = ", userid);

  // const tokenupdated = await User.findByIdAndUpdate(userid, {
  //   accessToken: genrateToken(userid),
  // });
  const token = genrateToken(userid);
  if (!token) {
    throw new Error(400, "Something went wrong while creating the token");
  }
  const loggedinuser = await User.findById(userid).select("-password ");
  // console.log("token = ", token);
  // console.log("loggedinuser = ", loggedinuser);
  return res
    .status(201)
    .cookie("token", token, {
      httpOnly: false,
      secure: true, // REQUIRED on Render (HTTPS)
      sameSite: "None", // REQUIRED for cross-origin
      path: "/", // 🔥 REQUIRED
    })
    .json({
      message: "User logged in successfully",
      user: token,
      loggedinuser,
    });

});
const GetAllUsers = asyncHandler(async (req, res) => {
  const allusers = await User.find();
  // console.log("allusers", allusers);
  // return res
  //   .status(200)
  //   .json(new apiresponse(200, allusers, "All users fetched successfully"));

  try {
    const result = {};
    let length = 0;

    const filtered_result = allusers.filter((res) => {
      return res._id.toString() !== req.user._id.toString(); //muzhe meri id result me nhi chahiye
    });
    // console.log("filtered_result = ", filtered_result);

    const safeusers = filtered_result.map((res) => {
      const obj = res.toObject();
      delete obj.password;

      return obj;
    });
    // console.log("safeusers = ", safeusers);
    result.user = safeusers;
    length += safeusers.length;

    const group_name = await Chat.find({
      $and: [
        { isGroupChat: true },
        { users: { $elemMatch: { $eq: req.user._id } } },
        // { chatName: { $regex: search, $options: "i" } },
      ],
    });
    if (group_name) {
      // console.log("group_name = ", group_name);
      result.Groups = group_name;
      length += group_name.length;
    }
    const combined = [...safeusers, ...group_name];

    // length
    const totalLength = combined.length;

    if (totalLength === 0) {
      return res
        .status(404)
        .json(new apierror(404, "No users or groups found"));
    }

    return res.status(200).json(
      new apiresponse(
        200,
        {
          user: combined, // 👈 single array containing everything
          length: totalLength,
        },
        "All Users and Groups combined"
      )
    );
  } catch (error) {
    throw res
      .status(401)
      .json(
        new apierror(
          401,
          error?.message || "Something Went Wrong while seachinf the users"
        )
      );
  }
});
const getallSearchedRealatedUsers = asyncHandler(async (req, res) => {
  try {
    const { search } = req.query;
    const result = {};
    let length = 0;
    const results = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });
    if (results) {
      // throw new apierror(500, "NO results found");

      // console.log("resultt = ", results);
      const filtered_result = results.filter((res) => {
        return res._id.toString() !== req.user._id.toString(); //muzhe meri id result me nhi chahiye
      });
      // console.log("filtered_result = ", filtered_result);

      const safeusers = filtered_result.map((res) => {
        const obj = res.toObject();
        delete obj.password;

        return obj;
      });
      // console.log("safeusers = ", safeusers);
      result.user = safeusers;
      length += safeusers.length;
    }
    const group_name = await Chat.find({
      $and: [
        { isGroupChat: true },
        { users: { $elemMatch: { $eq: req.user._id } } },
        { chatName: { $regex: search, $options: "i" } },
      ],
    });
    if (group_name) {
      // console.log("group_name = ", group_name);
      result.Groups = group_name;
      length += group_name.length;
    }
    result.length = length;
    // console.log("result = ", result);

    //because find return array but accept only object so fromm above
    // returning array so this is fail because it also need users in object format
    //that's why below apprach is not working so we manullay filter by using filter() the reslt and then
    //  remove the  password filed by using map
    // const users = await User.find({ results })//
    //  Or
    // const users = await User.find({ results })
    //   .find({
    //     _id: { $ne: new mongoose.Types.ObjectId(req.user._id) },
    //   })
    //   .select("-password");
    // console.log("users = ", users);
    // if (!users) {
    //   throw new apierror(500, "NO user found");
    // }
    if (results.length === 0 && group_name.length === 0) {
      throw res
        .status(401)
        .json(new apierror(401, error?.message || "No users Found"));
    }
    return res
      .status(200)
      .json(
        new apiresponse(200, result, "All user and groups are here is here")
      );
  } catch (error) {
    throw res
      .status(401)
      .json(
        new apierror(
          401,
          error?.message || "Something Went Wrong while seachinf the users"
        )
      );
  }
});

/*
https://www.mongodb.com/docs/manual/reference/operator/query/regex/
Definition
$regex
Provides regular expression capabilities for pattern matching strings in queries.
*/
export { registeruser, loginuser, getallSearchedRealatedUsers, GetAllUsers };
