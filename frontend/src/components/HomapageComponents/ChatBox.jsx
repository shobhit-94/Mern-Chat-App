import React, { useEffect, useState } from "react";
import axios from "axios";
import { toaster } from "../ui/toaster";
import { ChatState } from "../../context/chatProvider";
import { Button, HStack, Text,Box } from "@chakra-ui/react";
import { RiArrowRightLine, RiMailLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
// const ChatBox = ({ chats, members, seeMembers, person, setPerson }) => {
const ChatBox = ({ chats, details }) => {
  console.log("ChatBox got details", chats);
  const [members, setMembers] = useState([]);
  const [seeMembers, setseeMembers] = useState(false);
  const [person, setPerson] = useState(null);

  //   console.log("userid inside the MyChats.jsx =", userid);
//   useEffect(() => {
//     // console.log("chats changed id =", chats);
//     if (!details) return;
//     console.log("ChatBox useEfffect run details recived = ", details);
//     // console.log(" CHatBox useEfffect run chats recived = ", chats);
//     if (details.isGroupChat) {
//       //toggle ka logic bhi isme me hai agar ek clik ho to
//       //dusre ko band ker do nahi to preview button show hi hota rahega
//       setPerson(null);
//       setMembers(details.users);
//     } else {
//       setPerson(details.users);
//       setMembers([]);
//     }
//   }, [details]);
//   const previewList = () => {
//     console.log("previewList called - members:", members);
//   };
//   const handleusers = (details) => {
//     // console.log("details recived = ", details);
//     // if (details.isGroupChat) {
//     //   //toggle ka logic bhi isme me hai agar ek clik ho to
//     //   //dusre ko band ker do nahi to preview button show hi hota rahega
//     //   setPerson(null);
//     //   setMembers(details.users);
//     // } else {
//     //   setPerson(details.users);
//     //   setMembers([]);
//     // }
//   };
//   useEffect(() => {
//     if (members.length > 0) {
//       setseeMembers(true);
//     } else {
//       setseeMembers(false);
//     }
//   }, [members]);
  return (
    <div>
      ChatBox
      {/* {seeMembers && (
        <HStack marginLeft={"75vw"} position={"absolute"} top={"5vh"} >
          <Button
            marginLeft="15vw"
            colorPalette="teal"
            variant="solid"
            size="2xs"
            onClick={() => {
              //   previewList();
            }}
          >
            <FaRegEye /> <Text fontSize="10px">See members</Text>
          </Button>
        </HStack>
      )} */}
      <Box marginLeft={"20vw"} position={"absolute"} top={"50vh"}>
        hello
      </Box>
    </div>
  );
};

export default ChatBox;
