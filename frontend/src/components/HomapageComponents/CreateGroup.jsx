// import {
//   Box,
//   Button,
//   Flex,
//   For,
//   HStack,
//   Input,
//   Popover,
//   Stack,
//   Text,
// } from "@chakra-ui/react";
// import { ChatState } from "../../context/chatProvider";
// import React, { useEffect, useMemo, useState } from "react";
// import { Tooltip } from "../ui/tooltip";
// import { RiContactsBookFill } from "react-icons/ri";
// import { MdOutlineCreateNewFolder } from "react-icons/md";
// import { toaster } from "../ui/toaster";
// import axios from "axios";
// import { Select, createListCollection } from "@chakra-ui/react";
// import { RiArrowRightLine, RiMailLine } from "react-icons/ri";
// import {
//   Combobox,
//   Portal,
//   useFilter,
//   useListCollection,
// } from "@chakra-ui/react";
// import { IoMdCheckmark } from "react-icons/io";
// import { Collection } from "mongoose";
// import io from "socket.io-client";
// const ENDPOINT = "http://localhost:5000";
// var socket, selectedChatCompare;
// const CreateGroup = () => {
//   const [IsOpenGroupAdd, setIsOpenGroupAdd] = useState(false);
//   const [GroupUsers, setGroupUsers] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [select, setSelect] = useState(null);
//     // const [SocketConnected, setSocketConnected] = useState(false);
//   const chatState = ChatState();
//   // const { selectedChat, setSelectedChat, chats, user, setChats } = ChatState();
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
//     GroupChatName,
//     setGroupChatName,
//     userdata,
//     setUserdata,
//     groupChatbtn,
//     setGroupChatbtn,
//     refreshToken,
//     setRefreshToken,
//   } = chatState;

//   const frameworkss = [
//     { label: "React", value: "react" },
//     { label: "Solid", value: "solid" },
//     { label: "Vue", value: "vue" },
//     { label: "Angular", value: "angular" },
//     { label: "Svelte", value: "svelte" },
//     { label: "Preact", value: "preact" },
//     { label: "Qwik", value: "qwik" },
//     { label: "Lit", value: "lit" },
//     { label: "Alpine.js", value: "alpinejs" },
//     { label: "Ember", value: "ember" },
//     { label: "Next.js", value: "nextjs" },
//   ];

//   const { contains } = useFilter({ sensitivity: "base" });
//   const memoizedUsers = useMemo(() => GroupUsers, [GroupUsers]);
//   const { collection, set, filter } = useListCollection({
//     initialItems: [], // start empty
//     filter: contains,
//   });

//   useEffect(() => {
//     console.log("Collection changed:", collection.items);
//   }, [collection.items]);
//   useEffect(() => {
//     if (GroupUsers.length > 0) {
//       console.log("Setting collection items:", GroupUsers);
//       set(GroupUsers); // 👈 this updates collection.items immediately
//     }
//   }, [GroupUsers, set]);
//   // useEffect(() => {
//   //   console.log("memoizedUsers:", memoizedUsers);
//   // }, [memoizedUsers]);
//   useEffect(() => {
//     console.log("select:", select);
//   }, [select]);
//   /*
// Iternally it saves like this 
//   {
//   collection: {
//     items: [ { label: "React", value: "react" }, ... ],
//     getItem(id) { ... },
//     getItemByValue(value) { ... },
//     ...
//   },
//   filter: (query) => { ... } // filters `collection.items`
// }
//   */
 
//   // useEffect(() => {
//   //   socket = io(ENDPOINT);
//   //   // console.log("Id selected is =", selectedUserId);
//   //   // socket.emit("Setup", selectedUserId);
//   //   socket.on("connected", () => {
//   //     setSocketConnected(true);
//   //   });
//   //   return () => socket.disconnect();
//   // }, []);
//     // useEffect(() => {
//     //   if (socket && selectedUserId) socket.emit("Setup", selectedUserId);
//     // }, [selectedUserId]);
//   useEffect(() => {
//     console.log(GroupUsers, "GroupUsers");
//   }, [GroupUsers]);
//   useEffect(() => {
//     const whichUSerISPresentInGroup = async () => {
//       try {
//         toaster.dismiss();
//         toaster.create({
//           title: `Wait...`,
//           type: "loading", // show success
//         });
//         const config = {
//           headers: {
//             "Content-Type": "application/json",

//             // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
//           },
//           withCredentials: true,
//         };
//         console.log("config userList is ", config);
//         const res = await axios.get(
//           `http://localhost:5000/api/chat/fetchUserOfGroup`,
//           config
//         );

//         if (res.status === 200) {
//           console.log("res data in CreateGroup", res);
//           console.log("res.data is ", res.data);
//           const formatted = res.data.data.map((user) => ({
//             label: user.value.name, // 👈 visible label in dropdown
//             value: user.value._id, // 👈 unique identifier
//             iscommon: user.iscommon, // optional — extra info you can use later
//           }));
//           setGroupUsers(formatted);

//           toaster.dismiss();
//           toaster.create({
//             title: `found`,
//             type: "success", // show success
//           });
//         }
//       } catch (error) {
//         console.log("fetching user failed = ", error);
//         // setLoading(false); // hide loader
//         toaster.dismiss();
//         toaster.create({
//           title: `search result 0`,
//           type: "error", // show success
//         });
//       }
//     };
//     whichUSerISPresentInGroup();
//   }, []);

//   const AddToGroup = async () => {
//     // if
//     try {
//       toaster.dismiss();
//       toaster.create({
//         title: `Wait...`,
//         type: "loading", // show success
//       });
//       const body = {
//         userids: select,
//         OnlyAdmin: false,
//       };
//       const config = {
//         headers: {
//           "Content-Type": "application/json",

//           // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
//         },
//         withCredentials: true,
//       };
//       console.log("config userList is ", config);
//       const res = await axios.put(
//         `http://localhost:5000/api/chat/addToGroup`,
//         body,
//         config
//       );

//       if (res.status === 200) {
//         console.log("res data in AddToGRoup", res);
//         console.log("res.data is ", res.data.message);
//         toaster.dismiss();
//         toaster.create({
//           title: `${res.data.message}`,
//           type: "success", // show success
//         });
//          setRefreshToken(refreshToken + 1);
//       }
//     } catch (error) {
//       console.log("Adding person = ", error);
//       // setLoading(false); // hide loader
//       toaster.dismiss();
//       toaster.create({
//         title: `${error.response.data.message}`,
//         type: "error", // show success
//       });
//     }
//   };
//   return (
//     <div>
//       <Box ml={{ base: "1vw", md: "5vw" }} style={{}}>
//         <Button
//           colorPalette="teal"
//           variant="outline"
//           size={{ base: "2xs", md: "md" }}
//           onClick={() => setIsOpenGroupAdd(!IsOpenGroupAdd)}
//         >
//           <MdOutlineCreateNewFolder />
//           <Text fontSize={{ base: "2xs", md: "md" }}>Add to Group</Text>
//         </Button>

//         {IsOpenGroupAdd && (
//           <Combobox.Root
//             collection={collection}
//             onInputValueChange={(e) => {
//               filter(e.inputValue);
//               if (!e.inputValue) {
//                 console.log("Input cleared — resetting selection");
//                 setSelect(null); // ✅ guaranteed to trigger a React re-render
//               }
//             }}
//             // onInputValueChange={(e) => setInputValue(e.inputValue)}
//             onValueChange={(e) => {
//               console.log("e.value", e.value);
//               if (e.value.length === 0) setSelect(null);
//               if (e.value.length > 0) {
//                 //kyuki e.value  array ki form me dal raha hai chahe humne usestate me "" ya null rakho ho tabhi bhi asa hi check kerna hoga yaha
//                 console.log("inide e.value", e.value);
//                 setSelect(e.value); // works for both click and Enter
//               }
//             }}
//             width="220px"
//             // onOpenChange={(open) => {
//             //   console.log("Combobox open state changed");
//             // }}
//           >
//             {/* <Combobox.Label>Select framework</Combobox.Label> */}
//             <Combobox.Control>
//               <Combobox.Input
//                 placeholder="Your contacts"
//                 onKeyDown={(e) => {
//                   if (e.key === "Backspace") setSelect(null);
//                 }}
//               />
//               <Combobox.IndicatorGroup>
//                 <Combobox.ClearTrigger
//                   onClick={() => {
//                     console.log("Clear Trigger Clicked ");
//                     setSelect("");
//                   }}
//                 />
//                 <Combobox.Trigger />
//               </Combobox.IndicatorGroup>
//             </Combobox.Control>
//             <Portal>
//               <Combobox.Positioner>
//                 <Combobox.Content>
//                   <Combobox.Empty>No items found</Combobox.Empty>
//                   {collection.items.map((item) => (
//                     <Combobox.Item
//                       item={item}
//                       key={item.value}
//                       // onClick={() => setSelect(item.label)} Onvalue change ker defa mouse and keyboard kaa kaam
//                     >
//                       {item.label}
//                       {/* <Combobox.ItemIndicator /> */}
//                     </Combobox.Item>
//                   ))}
//                 </Combobox.Content>
//               </Combobox.Positioner>
//             </Portal>
//           </Combobox.Root>
//         )}
//         {isOpenRecent && (
//           <Button
//             colorPalette="teal"
//             variant="solid"
//             size={{ base: "2xs", md: "sm" }}
//             mx={{ base: "10px", md: "0" }}
//             onClick={() => AddToGroup()}
//             disabled={select === null}
//             opacity={select === null ? 0.5 : 1}
//             cursor={select === null ? "not-allowed" : "pointer"}
//             // loading={}
//             // loadingText="Adding..."
//           >
//             <IoMdCheckmark />{" "}
//             <Text fontSize={{ base: "xs", md: "md" }}>Add</Text>
//           </Button>
//         )}
//       </Box>
//     </div>
//   );
// };
// export default CreateGroup;
