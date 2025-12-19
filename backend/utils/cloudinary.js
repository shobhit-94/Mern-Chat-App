import User from "../models/usersModel.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
// console.log("Cloudinary Config:", cloudinary.config());
const uploadoncloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) {
      console.log("please provide localfilepath to uplaod pic on cloudinary");
    }
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    console.log(`Response is ${response.url}`);

    return response.url;
  } catch (error) {
    throw new Error(
      400,
      error?.message || "something went wrong on uploading pic on cloudinary"
    );
  }
};
const deletefromcloudinary=async(public_id)=>{
    if(!public_id){
        console.log("please provide public_id to delete pic from cloudinary")
    }
    await cloudinary.uploader.destroy(public_id)
}

export {uploadoncloudinary,deletefromcloudinary}
