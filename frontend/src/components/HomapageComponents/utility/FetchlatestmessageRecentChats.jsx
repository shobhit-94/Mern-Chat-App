import axios from "axios";
import { toaster } from "../../../components/ui/toaster";
import React, { useEffect, useRef, useState } from "react";
import API from "../../../api";

export const fetchLatestChatmessages = async (setLatest_Chats) => {
  //
  try {
    toaster.dismiss();
    // Detect full reload
    const navType = performance.getEntriesByType("navigation")[0]?.type;

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      params: { All: "true", Unread: "true", Groups: "true" },
    };

    const res = await axios.get(
      `${API}/api/message/latest-message`,
      config
    );

    if (res.status === 200) {
      toaster.dismiss();
      // Only log on page reload
      if (navType === "reload") {
        console.log(" latest chats res.data.data =", res.data.data);
      }
      setLatest_Chats(res.data.data);
    }
  } catch (error) {
    toaster.dismiss();
    toaster.create({
      title: error.response?.data?.message || "Error",
      type: "error",
    });
  }
};

export const message_read = async (setMessage_seen_ack, chatid) => {
  // if (isRequestRunning.current) return; // prevent double calls
  // isRequestRunning.current = true; // 🔒 LOCK
  // if (selectedChatId === null) return;
  try {
    const body = {
      message_ID: null,
      chat_ID: chatid,
      seen: true,
      delivered: true,
    };
    console.log("body =", body);
    const config = {
      headers: {
        "Content-Type": "application/json",

        // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
      },
      withCredentials: true,
    };

    const res = await axios.post(
      `${API}/api/message/read_By`,
      body,
      config
    );

    if (res.status === 200) {
      toaster.dismiss();
      console.log(
        " message seen in fetchlatestReccetnmessages =",
        res.data.data
      );
      setMessage_seen_ack(res.data.data)
      // setMessage_seen_ack({
      //   ...res.data.data.message.readBy[0].seenAt,

      //   seenAt: new Date().toISOString(),//adding new field in repsonse but relized that my model also containe seeAt in readBy filed
      // });

      //  socketRef.current.emit("message seen", res.data.data); //message seen confirmation to server
    }
  } catch (error) {
    toaster.dismiss();
  } finally {
    //  isRequestRunning.current = false; // 🔓 Unlock for next request
  }
};
