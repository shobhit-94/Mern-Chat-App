import React, { useEffect, useState } from "react";
import axios from "axios";
import { toaster } from "../ui/toaster";
import { ChatState } from "../../context/chatProvider";
import ChatBox from "./ChatBox";
import ShowGroupUser from "./ShowGroupUser";
import { Button, HStack, Text } from "@chakra-ui/react";
import { RiArrowRightLine, RiMailLine } from "react-icons/ri";
// import Chatpage_Test from "./Chatpage_Test_wrong";
import ChatSection from "../../pages/ChatSection";

const MyChats = ({ userid }) => {
  const [details, setDetails] = useState(null);
  const [openIt, setOpenIt] = useState(false);
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  //   const [members, setMembers] = useState([]);
  //   const [seeMembers, setseeMembers] = useState(false);
  //   const [person, setPerson] = useState(null);

  //   //   console.log("userid inside the MyChats.jsx =", userid);
  //   useEffect(() => {
  //     // console.log("chats changed id =", chats);
  //   }, [chats]);
  //   const previewList = () => {
  //     console.log("previewList called - members:", members);
  //   };
  //   const handleusers = (details) => {
  //     console.log("details recived = ", details);
  //     setDetails(details)
  // };
  useEffect(() => {
    console.log("MyChats useEffect details", details);
  }, [details]);
  useEffect(() => {
    // console.log("fetching chats for userid =", userid);
    const fetchChats = async () => {
      try {
        toaster.dismiss();
        toaster.create({
          title: `loading chat ,Please wait`,
          //   description: "Failed to load the chats, please try again later.",
          type: "loading",
        });
        const userinfo = localStorage.getItem("userInfo");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(userinfo).user}`, //y to tye likh lo nahi to withcredaditals true
          },
          //   withCredentials: true,
        };
        // console.log("config is ", config);
        // console.log(
        //   "JSON.parse(userinfo).token is ",
        //   JSON.parse(userinfo).user
        // );

        const res = await axios.get(
          `http://localhost:5000/api/chat?userid=${userid}`,

          //   params: { userid },
          config
        );

        if (res.status === 200) {
          setChats(res.data);
          //   setIsOpen(false);

          console.log("chats !!!!!!!!!!!found", res.data);
          setChats(res.data);
          setDetails(res.data.data);
          toaster.dismiss();
          toaster.create({
            title: `Chats found`,
            type: "success",
          });
          //   handleusers(res.data.data);
        }
      } catch (error) {
        console.error(error);
        toaster.create({
          title: `No Chats found`,
          description: "Failed to load the chats, please try again later.",
          type: "error",
        });
      }
    };

    if (userid) fetchChats();
  }, [userid]);
  return (
    <div>
      MyChats
      {chats && (
        // <ChatBox details={chats} members={members} seeMembers={seeMembers} person={person} setPerson={setPerson}  details={details}
        // <ChatBox chats={chats} />
        <ChatSection chats={chats} openIt={openIt} />
      )}
      {/* vaise chats ko prop ki jaise bhezne ki zarurat ni thi ChatBox me kyuki  [Chats setChats] contexapi,chatprovider.js me hai */}
      {/* {seeMembers && (
        <HStack>
          <Button
            colorPalette="teal"
            variant="solid"
            size="2xs"
            onClick={() => {
              previewList()
            }}
          >
            <FaRegEye /> <Text fontSize="10px">See members</Text>
          </Button>
        </HStack>
      )} */}
    </div>
  );
};

export default MyChats;
