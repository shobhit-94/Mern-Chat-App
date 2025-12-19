import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  useDisclosure,
  Group,
  Input,
  HStack,
  Text,
  Drawer,
  Menu,
  Avatar,
  Stack,
  SkeletonCircle,
  SkeletonText,
  Skeleton,
  Flex,
  useFilter,
  Combobox,
  useListCollection,
} from "@chakra-ui/react";
import { RiArrowRightLine, RiMailLine } from "react-icons/ri";
import { IoIosMenu } from "react-icons/io";
import { Box, Image } from "@chakra-ui/react";
import axios from "axios";
import { toaster } from "../ui/toaster";
import UserList from "./UserList";
import { MdCreateNewFolder } from "react-icons/md";
import CreateGroup from "./CreateGroup";
import { ChatState } from "../../context/chatProvider";
import io from "socket.io-client";

import { IoMdCheckmark } from "react-icons/io";
import { useBreakpointValue } from "@chakra-ui/react";
import { fetchLatestChatmessages,message_read } from "../HomapageComponents/utility/FetchlatestmessageRecentChats";
import { TiContacts } from "react-icons/ti";
import { Tooltip } from "../ui//tooltip";
const ENDPOINT = "http://localhost:5000";

var socket, selectedChatCompare;
{
  window.addEventListener("error", (e) => {
    if (
      e.message ===
      "ResizeObserver loop completed with undelivered notifications."
    ) {
      e.stopImmediatePropagation();
    }
  });
}
const Recent_chats = ({ isOpenRecent, setIsOpenRecent }) => {
  const chatState = ChatState();
  // const { selectedChat, setSelectedChat, chats, user, setChats } = ChatState();
  const {
    selectedChat,
    setSelectedChat,
    chats,
    user,
    setChats,
    IsGroup,
    setIsGroup,
    members,
    setMembers,
    seeMembers,
    setseeMembers,
    person,
    setPerson,
    showList,
    setShowList,
    GroupChatName,
    setGroupChatName,
    userdata,
    setUserdata,
    groupChatbtn,
    setGroupChatbtn,
    refreshToken,
    setRefreshToken,
    selectedChatId,
    setSelectedChatId,
    selectedUserId,
    setSelectedUserId,
    selectedID,
    setSelectedID,
    isOpenRecentChats,
    setIsOpenRecentChats,
    latest_Chats,
    setLatest_Chats,
    undreadTextMessage,
    setUndreadTextMessage,
    unreadRef,
    forceUpdate,
    trigger,
    message_seen_ack,
    setMessage_seen_ack,
  } = chatState;

  const [search, setSearch] = useState();

  const inputRef = useRef();
  // const [selectedUserId, setSelectedUserId] = useState(null);
  // const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [SocketConnected, setSocketConnected] = useState(false);
  const [isOpen_Latest_Chats, setIsOpen_Latest_Chats] = useState(false);

  const [select, setSelect] = useState(null);
  const [users, setUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [isOpenComboBox, setIsOpenComboBox] = useState(false);
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const tosaterfun = (length, status, error = null) => {
    toaster.dismiss();
    if (error) {
      toaster.create({
        title: "Failed to fetch users",
        description: error?.message || "Something went wrong",
        type: "error",
      });
      return;
    }

    if (length === undefined) {
      toaster.create({
        title: "Finding results...",
        type: "loading", // show spinner / pending
      });
    } else if (length > 0) {
      toaster.create({
        title: `${length} users found`,
        type: "success", // show success
      });
    } else if (length === 0) {
      toaster.create({
        title: `No users found`,
        type: "error", // show success
      });
    }
  };
  // let firstreload = 0;
  const combineresults = ({ user, Groups }) => {
    const combinedArray = [...user, ...Groups];
    setUserdata(combinedArray);
    // console.log("combinedArray in combineresults", combinedArray);
  };
  const UnreadTextRef = useRef("");

  // useEffect(() => {
  //   socket = io(ENDPOINT);
  //   // console.log("Id selected is =", selectedUserId);
  //   // socket.emit("Setup", selectedUserId);
  //   socket.on("connected", () => {
  //     setSocketConnected(true);
  //   });
  //   return () => socket.disconnect();
  // }, []);

  // useEffect(() => {
  //   if (socket && selectedUserId) {
  //     socket.emit("Setup", selectedUserId);
  //     socket.on("connection", () => setSocketConnected(true));
  //   }
  // }, []);

  const handleSearch = async () => {
    // console.log("e.target.value is ", inputRef.current.value);
    if (inputRef.current.value === "") {
      toaster.dismiss();
      toaster.create({
        title: `write something to search`,
        type: "error", // show success
      });
      return;
    }
    // setSearch(inputRef.current.value);
    try {
      //   setStatus("loading");
      setLoading(true);
      tosaterfun(undefined, "loading");
      const config = {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
        },
        withCredentials: true,
      };
      // console.log("config userList is ", config);
      const res = await axios.get(
        `http://localhost:5000/api/user/?search=${inputRef.current.value}`,
        config
      );

      if (res.status === 200) {
        // console.log("search user data", res);
        // console.log("res.data.data is ", res.data.data);
        combineresults(res.data.data);

        toaster.dismiss();
        toaster.create({
          title: `found`,
          type: "success", // show success
        });
        setLoading(false); // hide loader
      }
    } catch (error) {
      console.log("fetching user failed = ", error);
      // setLoading(false); // hide loader
      toaster.dismiss();
      toaster.create({
        title: `search result 0`,
        type: "error", // show success
      });
    }
  };
  // useEffect(() => {
  //   const fetchLatestChatmessages = async () => {
  //     // if (person === null) return; // exit if person or _id is null
  //     try {
  //       toaster.dismiss();

  //       const config = {
  //         headers: {
  //           "Content-Type": "application/json",

  //           // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
  //         },
  //         withCredentials: true,
  //         params: {
  //           // Use params for GET requests because get request don't accept req.body in frontend
  //           All: "true",
  //           Unread: "true",
  //           Groups: "true",
  //         },
  //       };
  //       // const body = {
  //       //   All: "true",
  //       //   Unread: "true",
  //       //   Groups: "true",
  //       // };
  //       // console.log("body is ", body);
  //       const res = await axios.get(
  //         `http://localhost:5000/api/message/latest-message`,
  //         // body,because get request don't accept req.body in frontend
  //         config
  //       );

  //       if (res.status === 200) {
  //         toaster.dismiss();

  //         console.log(res.data.data, "latestchat messages");
  //         setLatest_Chats(res.data.data);
  //       }
  //     } catch (error) {
  //       toaster.dismiss();
  //       toaster.create({
  //         title: `${error.response.data.message}`,
  //         type: "error", // show success
  //       });
  //     }
  //   };
  //   Promise.resolve().then(() => {
  //     // console.log("fetch latest running messages");
  //     fetchLatestChatmessages();
  //   });
  // }, []);
  // useEffect(() => {
  //   console.log("selectedChatId changed:", selectedChatId);
  // }, [selectedChatId]);
  useEffect(() => {
    if (!latest_Chats || latest_Chats.length === 0) return; // ⛔ don't run yet
    if (firstLoadDone) return;
    if (isMobile) {
      setIsOpenRecentChats(true);
    }

    // console.log("latest_Chats = ", latest_Chats);
    // await fetchLatestChatmessages(setLatest_Chats);
    // console.log("firstreload = ", firstreload);
    const chat = latest_Chats[0];
    // console.log("chat = ", chat);
    // console.log("latest_Chats = ", latest_Chats[0]);
    // console.log("chat._id", chat._id);
    setSelectedChatId(chat._id);
    setSelectedID(chat._id);
    setIsOpenRecent((prev) => !prev);
    setSelectedUserId(chat.users[0]._id);

    chat.isGroupChat ? setPerson(chat) : setPerson(chat.users[0]);
    // setRefreshToken((prev) => prev + 1);

    chat.isGroupChat
      ? setGroupChatName(chat.chatName)
      : setGroupChatName(chat.users[0].name);

    setGroupChatbtn(chat.isGroupChat);
    setseeMembers(chat.isGroupChat);
    setFirstLoadDone(true);
  }, [latest_Chats]); // <-- runs ONLY when axios updates latest_Chats

  useEffect(() => {
    // fetchLatestChatmessages(setLatest_Chats);

    Promise.resolve()
      .then(() => {
        fetchLatestChatmessages(setLatest_Chats);
      })
      .catch((error) => {
        toaster.dismiss();
        toaster.create({
          title: "Failed to fetch latest chats",
          description: error?.message || "Something went wrong",
          type: "error",
        });
      });
  }, [refreshToken]);

  const { contains } = useFilter({ sensitivity: "base" });
  const { collection, set, filter } = useListCollection({
    initialItems: [], // start empty
    filter: contains,
  });
  useEffect(() => {
    if (users.length > 0) {
      // console.log("Setting collection items:", users);
      set(users); // 👈 this updates collection.items immediately
    }
  }, [users, set]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        toaster.dismiss();
        toaster.create({
          title: `Wait...`,
          type: "loading", // show success
        });
        const config = {
          headers: {
            "Content-Type": "application/json",

            // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
          },
          withCredentials: true,
        };
        // console.log("config userList is ", config);
        const res = await axios.get(
          `http://localhost:5000/api/user/getall`,
          config
        );

        if (res.status === 200) {
          // console.log("res data in RecentChat", res);
          // console.log("res.data ", res.data);
          const formatted = res.data.data.user.map((user) => ({
            // label: user.name, // 👈 visible label in dropdown
            label: user.name ? user.name : user.chatName, // 👈 visible label in dropdown
            value: user._id, // 👈 unique identifier
            pic: user.pic, // optional — extra info you can use later
            // pic: user.pic, // optional — extra info you can use later
            userData: user, // store full user if needed
          }));
          setUsers(formatted);
          // console.log("formatted users in RecentChat", formatted);
          toaster.dismiss();
          toaster.create({
            title: `found`,
            type: "success", // show success
          });
        }
      } catch (error) {
        console.log("fetching user failed = ", error);
        // setLoading(false); // hide loader
        toaster.dismiss();
        toaster.create({
          title: `search result 0`,
          type: "error", // show success
        });
      }
    };
    Promise.resolve().then(() => {
      getAllUsers();
    });
  }, [refreshToken]);
  // useEffect(() => {
  //   console.log(isOpenComboBox, " = isOpenComboBox");
  // }, [isOpenComboBox]);
  // useEffect(() => {
  //   console.log(isOpenRecentChats, " = isOpenRecentChats");
  // }, [isOpenRecentChats]);

  function formatMessageDate(isoDateString) {
    const date = new Date(isoDateString);
    const now = new Date();

    // Strip time part to compare only dates
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffInDays = Math.floor((nowOnly - dateOnly) / (1000 * 60 * 60 * 24));

    // Format time in 12-hour format
    const formatTime = (date) => {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;

      return `${hours}:${minutes} ${ampm}`;
    };

    const timeString = formatTime(date);

    // 🟢 If today - return time only
    if (diffInDays === 0) {
      return `Today at ${timeString}`;
    }

    // 🟡 If yesterday - return "Yesterday at HH:MM AM/PM"
    if (diffInDays === 1) {
      return `Yesterday at ${timeString}`;
    }

    // 🟣 If same year → format as "Mon DD at HH:MM AM/PM"
    if (date.getFullYear() === now.getFullYear()) {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      return `${month} ${day} at ${timeString}`;
    }

    // 🔵 If previous year → format as "DD-MM-YY at HH:MM AM/PM"
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    return `${day}-${month}-${year} at ${timeString}`;
  }
  const menuOpen = !isMobile ? true : isOpenRecentChats;

  useEffect(() => {
    if (!isMobile) {
      setIsOpenRecentChats(true);
    }
  }, [isMobile]);
  const chatid = useRef(null);
  // useEffect(() => {
  //   latest_Chats.map((chat) => {
  //     if (chat._id === selectedID) {
  //       chatid.style.bg = "red";
  //     }
  //   });
  // }, [selectedID]);
  const backgroundOpacity =
    isOpenComboBox || isOpenRecentChats ? "block" : "none";
  useEffect(() => {
    setSelectedID(selectedChatId);
  }, [selectedChatId]);
  // useEffect(() => {
  //   console.log(
  //     "undreadTextMessage = ",
  //     undreadTextMessage.content,
  //     undreadTextMessage.chatId,
  //     undreadTextMessage.content !== "" &&
  //       undreadTextMessage.chatId === selectedID
  //   );
  // }, [undreadTextMessage]);
  return (
    <div>
      <Box
        display={{ base: backgroundOpacity, md: "none" }}
        bg="black"
        opacity="0.5"
        h="100vh"
        w="100vw"
        // mt="20vh"
        position="absolute"
        zIndex="1000"
      >
        {" "}
      </Box>
      <Tooltip content="All Contacts">
        <Button
          position="fixed"
          // bottom="91vh"
          top={{ base: "5vh", md: "4.5vh" }}
          left="5px"
          size={{ base: "2xs", md: "sm" }}
          // display={{ base: "flex", md: "none" }}
          style={{
            zIndex: "5000",
            // h: { base: "2px", md: "12vh" },
            // w: { base: "2px", md: "1vw" },
          }}
          colorPalette="teal"
          variant="solid"
          onClick={() => {
            setIsOpenRecentChats((prev) => !prev);

            if (isOpenComboBox === true) {
              setIsOpenComboBox(false);
            }
          }}
          _hover={{ bg: "teal.600" }}
          _active={{
            transform: "none",
            bg: "teal.700",
            boxShadow: "none",
          }}
          _focus={{
            boxShadow: "none",
            outline: "none",
          }}
        >
          <IoIosMenu
          // style={{
          //   h: { base: "1px", md: "12vh" },
          //   w: { base: "4px", md: "1vw" },
          // }}
          />
        </Button>
      </Tooltip>

      <Tooltip content="Recent Chats">
        <Button
          position="fixed"
          zIndex="1000"
          top="90vh"
          // left="12vw"
          // display={{ base: "flex", md: "none" }}
          // height="10px"
          size={{ base: "2xs", md: "sm" }}
          style={{
            zIndex: "5000",
            // h: { base: "1px", md: "12vh" },
            // w: { base: "1px", md: "1vw" },
          }}
          colorPalette="teal"
          variant="solid"
          onClick={() => {
            setIsOpenComboBox((prev) => !prev);

            if (isOpenRecentChats === true) {
              setIsOpenRecentChats(false);
            }
          }}
          _hover={{ bg: "teal.300" }}
          _active={{
            transform: "none",
            bg: "teal.700",
            boxShadow: "none",
          }}
          _focus={{
            boxShadow: "none",
            outline: "none",
          }}
        >
          <TiContacts
          // style={{
          //   height: { base: "2vh", md: "12vh" },
          //   width: { base: "2vw", md: "1vw" },
          // }}
          />
        </Button>
      </Tooltip>

      {/* <Flex
      bottom="2vh"
        // position="absulte"
        display={{
          base: isOpenComboBox ? "flex" : "none", // mobile logic
          md: "flex", // always visible on desktop
        }}
        // zIndex={-4000}
        position="absolute"
        bg="black"
        style={{ zIndex: "100" }}
        flexDirection="column"
        // alignItems="center"
        // mt={{ base: "-1vh", md: "-4vh" }}
        w={{ base: "100vw", md: "25vw" }}
        h={{ base: "17vw", md: "2vw" }}
        justifyContent="spacebetween"
      > */}
      {/* Refresh Button */}

      <Box position="absolute">
        {/*combobox ko box me hi dalo or iski postion raltive kro nahi to postioner full-width le le ar hai */}
        <Combobox.Root
          open={isOpenComboBox}
          collection={collection}
          onOpenChange={(open) => {
            // setIsOpenComboBox(open.open);//mat rakho isse nahi to button se or isme conflict hoga
            console.log("open = ", open);
          }}
          //on Input value change matlab  hum jo type kerte hai searchbox placeholder ke ander use set kerne kerne ke liye hota hai
          onInputValueChange={(e) => {
            filter(e.inputValue);
            if (!e.inputValue) {
              console.log("Input cleared — resetting selection");
              setSelect(null); // ✅ guaranteed to trigger a React re-render
              // setIsOpenComboBox(false);
              // setIsOpenRecentChats(true);
            } else if (e.inputValue) {
              console.log("else combox box");
              // setIsOpenComboBox(true);
              setIsOpenRecentChats(false); // Open only when there's input
            }
          }}
          onFocus={() => {
            // Only open if there's text in the input
            if (select || collection.items.length > 0) {
              // setIsOpenRecentChats(true);
            }
          }}
          //on value change matlab  kispe click kare hai vo dhundhne ke liye hota hai
          onValueChange={(e) => {
            console.log("e.value", e.value);
            if (e.value.length === 0) {
              setSelect(null);
            }
            if (e.value.length > 0) {
              //kyuki e.value  array ki form me dal raha hai chahe humne usestate me "" ya null rakho ho tabhi bhi asa hi check kerna hoga yaha
              // console.log("inide e.value", e.value);
              setSelect(e.value); // works for both click and Enter
            }
            // -------------------------------------------------------------------------
            //Problem of onCLick and onKeydown is solved in onVAlue change just find when the user clicks or press key
            //just find the value whoch si changed will be  the value which user clicks or press
            const selectedValue = e.value[0]; // Ark UI returns selection as array
            // console.log("selectedValue = ", selectedValue);
            if (!selectedValue) return;

            // Find selected item from collection
            // const item = collection.items.find((i) => i.value === selectedValue);
            //  OR exppanded version to find the selected value
            const allItems = collection.items;
            // console.log("allItems = ", allItems);
            // Step 2: We want to find one item whose "value"
            //         matches the value we selected from the combobox
            let item = null;

            // Step 3: Loop through every item and compare values
            for (let i = 0; i < allItems.length; i++) {
              // Check: does this item's value equal the selected value?
              if (allItems[i].value === selectedValue) {
                // If yes → this is the correct item
                item = allItems[i];
                break; // stop the loop, we found what we wanted
              }
            }
            if (!item) return;
            console.log("item = ", item);

            Promise.resolve().then(() => {
              // console.log("selectedChatId = ", selectedChatId);
              const user = item.userData;
              // Your logic
              if (isMobile) {
                setIsOpenRecentChats(false);
              }
              setSelectedID(selectedChatId);
              setIsOpenRecentChats(true);
              setSelect(null);

              setIsOpenComboBox(false);

              setSelectedUserId();

              setPerson(user);

              // console.log("value changes");

              setGroupChatName(user.isGroupChat ? user.chatName : user.name);
              setGroupChatbtn(user.isGroupChat);
              setseeMembers(user.isGroupChat);
              setIsOpenComboBox(false);

              setRefreshToken((prev) => prev + 1);
            });
          }}
          // width="320px"
        >
          <Combobox.Control>
            {/* <Combobox.Input  placeholder="Type to search" /> */}
            {/* <Combobox.IndicatorGroup>
            <Combobox.ClearTrigger />
            <Combobox.Trigger />
          </Combobox.IndicatorGroup> */}
          </Combobox.Control>
          <Combobox.Input
            placeholder="Type to search"
            backgroundColor="#161617ff"
            position="relative"
            zIndex="5000"
            mt={{ base: "8vh", md: "7vh" }}
            px="25px" // <-- padding left + right
            py="15px" // <-- padding top + bottom
            width={{ base: "100vw", md: "25vw" }}
            fontFamily="Rubik"
            // display={{ base: "block", md: "none" }}
            display={isOpenComboBox ? "block" : "none"}
            _placeholder={{
              // zIndex: "4000",
              // zIndex:"6000",
              // padding: "14px ",
              // textAlign: "center",
              // h:"40vh",
              // justifyContent:"center",

              fontSize: { base: "10px", md: "14px" }, // responsive placeholder size
              color: "whiteAlpha.900", // optional
              fontWeight: "bold",
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace") setSelect(null);
              // if (e.key === "Enter") setIsOpenRecentChats(false);
            }}
            // onClick={() => {
            //   // setIsOpenComboBox((prev) => !prev);
            //   setIsOpenComboBox(true);
            //   // setIsOpenRecentChats(false);
            // }}
            _focus={{
              border: "transparent",
              outline: "none",
              boxShadow: "none",
            }}
            _focusVisible={{
              outline: "none",
              boxShadow: "none",
            }}
          />
          <Portal>
            <Combobox.Positioner
              // bg="red.100"
              style={{ width: "fit-content" }}
            >
              <Combobox.Content
                //  h="88vh"
                top="11vh"
                style={{
                  position: "relative",
                  borderRight: "0.1px solid gray",
                  maxHeight: "75vh", // <--- FIX humse auto adjust suggestion height adjust ke liye ye hi use kro
                  // h={{ base: "25vh", md: "55vh" }}direct height mat set kerna nhi to suggestion ke hisab se height adjust ni hogi
                  boxShadow: "none",
                  overflowY: "auto", // scroll remains
                  scrollbarWidth: "none", // Firefox hide
                  msOverflowStyle: "none", // IE/Edge hide
                }}
                css={{
                  "&::-webkit-scrollbar": {
                    display: "none", // Chrome/Safari hide
                  },
                }}
                w={{ base: "97vw", md: "25vw" }}
                // w="40px"
                // bg="#9b3838ff"
                // bg="#1a1c1cff"
              >
                <Combobox.Empty>No items found</Combobox.Empty>
                {collection.items.map((item) => (
                  <Combobox.Item
                    key={item.value}
                    item={item}
                    p={{ base: "10px", md: "25px" }} // ✔ responsive padding
                  >
                    <Text fontSize={{ base: "8px", md: "14px" }}>
                      {item.label}
                    </Text>

                    <Avatar.Root shape="full" size={{ base: "2xs", md: "md" }}>
                      <Avatar.Fallback name="Random User" />
                      <Avatar.Image src={item.pic} />
                    </Avatar.Root>
                    {/* <Combobox.ItemIndicator /> */}
                  </Combobox.Item>
                ))}
              </Combobox.Content>
            </Combobox.Positioner>
          </Portal>
        </Combobox.Root>
      </Box>
      {/* <Box w="100%" h="20%">
          {isOpenRecentChats && (
            <Text
              color="whiteAlpha.900"
              textAlign="center"
              // height="12px"
              fontSize={{ base: "12px", md: "md" }}
              fontWeight="bold"
            >
              Recents Chats
            </Text>
          )}
        </Box> */}
      <Box>
        <Menu.Root
          // onPointerDownOutside={(e) => e.preventDefault()}
          onFocusOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          positioning={{ placement: "bottom-start" }}
          open={menuOpen}
          // onOpenChange={(open) => {
          //   setIsOpenRecentChats(open.open);
          // }}
        >
          <Menu.Trigger asChild>
            {/* <Button
              colorPalette="teal"
              variant="solid"

              size={{ base: "18px", md: "sm" }}
              mx={{ base: "10px", md: "10px" }}
              onClick={() => {
                setIsOpenRecentChats((prev) => !prev);
              }}
              disabled={select === null}
              opacity={select === null ? 0.5 : 1}
              cursor={select === null ? "not-allowed" : "pointer"}
              // loading={}
              // loadingText="Adding..."
            >
              <Text fontSize={{ base: "8px", md: "md" }}>Recents Chats</Text>
            </Button> */}
          </Menu.Trigger>

          {isOpenRecentChats && (
            <Portal>
              <Menu.Positioner
                mt={{ base: "5vh", md: "10vh" }}
                ml={{ base: "0vw", md: "0" }}
              >
                <Menu.Content
                  // h="88vh"
                  // mt="22vh"
                  w={{ base: "100vw", md: "25vw" }}
                  bg="rgb(22,23,23)"
                  style={{ borderRight: "0.1px solid gray" }}
                >
                  {latest_Chats.length < 0 ? (
                    // Show skeletons while loading
                    <Stack spacing={3} p="4">
                      <Skeleton height="60px" />
                      <Skeleton height="60px" />
                      <Skeleton height="60px" />
                    </Stack>
                  ) : (
                    latest_Chats.length > 0 &&
                    latest_Chats.map((chat) => (
                      <Menu.Item
                        bg={selectedID === chat._id ? "teal.700" : "#1C1B1B"} // 🔥 highlight
                        p={{ base: "8px", md: "25px" }} // ✔ responsive padding
                        // bg="#1C1B1B"
                        _hover={{ bg: "gray.800", cursor: "pointer" }}
                        key={chat._id}
                        onClick={(e) => {
                          Promise.resolve().then(() => {
                            // socket.emit("join chat", selectedChatId);
                            setSelectedID(chat._id);
                            message_read(setMessage_seen_ack, chat._id);
                            setUndreadTextMessage((prev) => {
                              if (!Array.isArray(prev)) return []; // safety fallback

                              return prev.map((m) =>
                                m.chatId === chat._id
                                  ? { chatId: null, content: "" } // reset the unread entry
                                  : m
                              );
                            });

                            setIsOpenRecent((prev) => !prev);
                            setSelectedUserId(chat.users[0]._id);

                            // setSelectedChatId(chat._id);
                            // Toggle ONLY on mobile
                            if (isMobile) {
                              setIsOpenRecentChats((prev) => !prev);
                            }

                            chat.isGroupChat === true
                              ? setPerson(chat)
                              : setPerson(chat.users[0]);
                            setRefreshToken(refreshToken + 1);

                            chat.isGroupChat
                              ? setGroupChatName(chat.chatName)
                              : setGroupChatName(chat.users[0].name);
                            chat.isGroupChat
                              ? setGroupChatbtn(true)
                              : setGroupChatbtn(false);
                            chat.isGroupChat
                              ? setseeMembers(true)
                              : setseeMembers(false);
                          });
                        }}
                      >
                        <Stack
                          display="flex"
                          justifyContent="flex-start"
                          gap="10px"
                          // bg="red.300"
                          // "
                          h="50px"
                          // flexDirection="row"
                          justifySelf="center"
                          width={{ base: "100%", md: "100%" }} // responsive width
                          direction={{ base: "row", md: "row" }} // column on small, row on medium+
                          alignItems="flex-start"
                        >
                          <Box py={2}>
                            <Avatar.Root
                              shape="full"
                              size={{ base: "2xs", md: "md" }}
                            >
                              <Avatar.Fallback name="Random User" />
                              <Avatar.Image src={chat.users[0]?.pic} />
                            </Avatar.Root>
                          </Box>
                          {/*bg color ko dekh ker samh lo box ko */}
                          <Box
                            alignItems="flex-end"
                            // bg="gray"
                            h="100%"
                            flexDirection="column"
                            display="flex"
                            w="100%"
                          >
                            <Text
                              fontSize={{ base: "8px", md: "14px" }}
                              color="gray"
                            >
                              {formatMessageDate(
                                chat.latestMessage?.createdAt
                              ) || "unKnown Date"}
                            </Text>
                            <Box
                              alignItems="flex-start"
                              // bg="yellow"
                              h="100%"
                              mt="-14px"
                              // gap="-11px"
                              flexDirection="column"
                              display="flex"
                              w="100%"
                            >
                              <Text
                                fontSize={{ base: "8px", md: "14px" }}
                                fontWeight="bold"
                              >
                                {chat.isGroupChat
                                  ? chat.chatName
                                  : chat.users?.[0]?.name || "unKnown"}
                              </Text>
                              <div>
                                {
                                  Array.isArray(undreadTextMessage) &&
                                    (() => {
                                      if (undreadTextMessage.length === 0)
                                        return (
                                          <Text
                                            color="gray"
                                            fontSize={{
                                              base: "8px",
                                              md: "14px",
                                            }}
                                          >
                                            {chat.latestMessage?.content ||
                                              "Unknown content"}
                                          </Text>
                                        );
                                      const unread = undreadTextMessage.find(
                                        (m) =>
                                          m.chatId === chat._id &&
                                          m.content !== ""
                                      );

                                      if (unread) {
                                        return (
                                          <Text
                                            color="teal.600"
                                            fontWeight="bold"
                                            bg="teal.900"
                                            p="3px 8px"
                                            borderRadius="6px"
                                            display="inline-block"
                                            fontSize={{
                                              base: "8px",
                                              md: "14px",
                                            }}
                                          >
                                            {unread.content}
                                          </Text>
                                        );
                                      }

                                      return (
                                        <Text
                                          color="gray"
                                          fontSize={{ base: "8px", md: "14px" }}
                                        >
                                          {chat.latestMessage?.content ||
                                            "Unknown content"}
                                        </Text>
                                      );
                                    })()

                                  // undreadTextMessage.map(
                                  //   (m) => m.chatId === chat._id
                                  //  && m.content !== "" ? (
                                  //   <Text
                                  //     color="teal.600"
                                  //     fontWeight="bold"
                                  //     bg="teal.900"
                                  //     p="3px 8px"
                                  //     borderRadius="6px"
                                  //     display="inline-block" //bg didn't wok before by-deafult chackra TExt xomponet is inline and inline doesn't expand so adding padding ,display:inline-block helps
                                  //     fontSize={{ base: "8px", md: "14px" }}
                                  //   >
                                  //     {undreadTextMessage.content}
                                  //   </Text>
                                  // ) : (
                                  //   <Text
                                  //     color="gray"
                                  //     fontSize={{ base: "8px", md: "14px" }}
                                  //   >
                                  //     {chat.latestMessage?.content ||
                                  //       "Unknown content"}
                                  //   </Text>)
                                }
                              </div>

                              {/* <div>
                               {unreadRef.current.chatId === chat._id  ? (
                                  <Text
                                    color="teal.600"
                                    fontWeight="bold"
                                    bg="teal.900"
                                    p="3px 8px"
                                    borderRadius="6px"
                                    display="inline-block" //bg didn't wok before by-deafult chackra TExt xomponet is inline and inline doesn't expand so adding padding ,display:inline-block helps
                                    fontSize={{ base: "8px", md: "14px" }}
                                  >
                                    {unreadRef.current.content}
                                  </Text>
                                ) : (
                                  <Text
                                    color="gray"
                                    fontSize={{ base: "8px", md: "14px" }}
                                  >
                                    {chat.latestMessage?.content ||
                                      "Unknown content"}
                                  </Text>
                                )}
                              </div> */}
                            </Box>
                          </Box>
                        </Stack>
                      </Menu.Item>
                    ))
                  )}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          )}
        </Menu.Root>
      </Box>
      {/* </Flex> */}
    </div>
  );
};

export default Recent_chats;
