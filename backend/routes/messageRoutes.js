import express from "express";
const router = express.Router();
import verifyJWT from "../middlewares/authMiddleware.js";

import {
  sendMessage,
  edit_message,
  delete_message,
  fetchMessages,
  Alllatestmessage,
  read_By,
} from "../Controllers/messageController.js";

router.route("/send-message").post(verifyJWT, sendMessage);
router.route("/edit-message").post(verifyJWT, edit_message);
router.route("/delete-message").delete(verifyJWT, delete_message);
// router.route("/read-By-message").patch(verifyJWT, read_By);
router.route("/fetch-messages").get(verifyJWT, fetchMessages);
router.route("/latest-message").get(verifyJWT, Alllatestmessage);
router.route("/read_By").post(verifyJWT, read_By);

export default router;
