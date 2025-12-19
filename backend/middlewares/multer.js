import multer from "multer";
import path from "path";
// import path from "../uploads/";


//Read this
// https://expressjs.com/en/resources/middleware/multer.html
try {
    var storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/"); //yaha pe apna public_temp me temp ka path dedo
      },
      
      filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.fieldname + path.extname(file.originalname);
        cb(null, uniqueName);
      },
    });
} catch (error) {
    console.error("Error setting up multer storage:", error);
}
export const upload = multer({ storage });

