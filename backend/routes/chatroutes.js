import express from "express";
import { upload } from "../middlewares/multer.js";
// import { router } from 'express'
const router = express.Router();
import verifyJWT from "../middlewares/authMiddleware.js";
import {
  accessOne_on_OneChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  whichUSerISPresentInGroup,
  DeleteAllChats,
} from "../Controllers/chat.controll.js";

router.route("/").get(verifyJWT, accessOne_on_OneChat);//search
router.route("/fetchchats").get(verifyJWT, fetchChats);
// router.route("/createGroupChats").post(verifyJWT, createGroupChat);
router.route('/renameGroup').put(verifyJWT,renameGroup)
router.route('/groupremove').put(verifyJWT,removeFromGroup)
router.route("/addToGroup").put(verifyJWT, addToGroup);
router.route("/fetchUserOfGroup").get(verifyJWT, whichUSerISPresentInGroup);
router.route("/delete-All-Chats").delete(verifyJWT, DeleteAllChats);
router.post(
  "/createGroupChats",
  (req, res, next) => {
    req.setTimeout(5 * 60 * 1000); // 5 minutes
    res.setTimeout(5 * 60 * 1000); // 5 minutes
    next();
  },
  verifyJWT,
  createGroupChat
);


export default router;
