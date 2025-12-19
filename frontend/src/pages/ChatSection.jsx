// import React from "react";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { ChatState } from "../context/chatProvider";
// import { Box, Center, HStack, Text } from "@chakra-ui/react";
// import MyChats from "../components/HomapageComponents/MyChats";
// import ChatBox from "../components/HomapageComponents/ChatBox";
// import { useNavigate } from "react-router-dom";
// import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
// import { FaRegEye } from "react-icons/fa";

// const ChatSection = () => {
//   const chatState = ChatState();
//   const {
//     selectedChat,
//     setSelectedChat,
//     chats,
//     user,
//     setChats,
//     IsGroup,
//     setIsGroup,
//     members,
//     setMembers,
//     seeMembers,
//     setseeMembers,
//     person,
//     setPerson,
//     showList,
//     setShowList,
//   } = ChatState();
//   // const { user } = chatState;
// //   const [members, setMembers] = useState([]);
// //   const [seeMembers, setseeMembers] = useState(false);
// //   const [person, setPerson] = useState(null);
// //   const [showList, setShowList] = useState(false);

//   useEffect(() => {
//     // console.log("chats changed id =", chats);
//     if (!chats) return;
//     console.log("ChatBox useEfffect run chats recived = ", chats.data);
//     // console.log(" CHatBox useEfffect run chats recived = ", chats);
//     if (chats.data.isGroupChat) {
//       //toggle ka logic bhi isme me hai agar ek clik ho to
//       //dusre ko band ker do nahi to preview button show hi hota rahega
//       setPerson(null);
//       setShowList(false);
//       setIsGroup(true);
//       setMembers(chats.data.users);
//     } else {
//       setPerson(chats.data.users);
//       setMembers([]);
//     }
//   }, [chats]);
//   useEffect(() => {
//     if (members.length > 0) {
//       setseeMembers(true);
//     } else {
//       setseeMembers(false);
//     }
//   }, [members]);
//   //   useEffect(() => {

//   //   }, []);
// //   const uniqueMemberArray = [
// //     ...new Map(members.map((member) => [member._id, member])).values(),
// //   ];
//   return (
//     <div style={{ width: "100px" }}>
//       {/* <Box
//         marginLeft={"19vw"}
//         position="fixed"
//         top={"8vh"}
//         display="flex"
//         justifyContent="space-between"
//         // alignItems={Center}//This cause maximum callstack problem don't write Center because it is a prop in chakra ui
//         //use css inside the double-quotes "center"
//         alignItems="center"
//         width="79vw"
//         height="91vh"
//         backgroundColor="blackAlpha.400"
//       > */}
//         kkkkkk
//         {seeMembers && (
//             <></>


            
//         //   <HStack position={"absolute"} marginLeft={"12vw"} top={"1vh"}>
//         //     <Button
//         //       marginLeft="15vw"
//         //       colorPalette="teal"
//         //       variant="solid"
//         //       size="2xs"
//         //       onClick={() => {
               
//         //         setShowList(!showList);
//         //       }}
//         //     >
//         //       {/* <FaRegEye /> <Text fontSize="10px">See members</Text> */}
//         //     </Button>
//         //     {showList && (
//         //       <Box>
//         //         {
//         //           //   <h3 key={see._id}>{see.email}</h3>
//         //           uniqueMemberArray.map((user) => (
//         //             <h3 key={user._id}>{user.email}</h3>
//         //           ))
//         //         }
//         //       </Box>
//         //     )}
//         //   </HStack>
//         )}
//         {/* <ViewMembers/> */}
//         {/* {user && <MyChats />} */}
//         {/* {user && <ChatBox />} */}
//       {/* </Box> */}
//     </div>
//   );
// };

// export default ChatSection;
