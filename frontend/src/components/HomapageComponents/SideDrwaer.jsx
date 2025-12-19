import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  Menu,
  Portal,
  Avatar,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import Recent_chats from "./Recent_chats";
import { ChatState } from "../../context/chatProvider";
import { FaBell } from "react-icons/fa6";
// import { set } from "mongoose";
import { IconButton } from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Badge, Stack } from "@chakra-ui/react";
import { FaRegBell } from "react-icons/fa";
import {
  fetchLatestChatmessages,
  message_read,
} from "../HomapageComponents/utility/FetchlatestmessageRecentChats";

const Demo = () => {
  return (
    <Stack  direction="row">
      
      <Badge>Default</Badge>
      <Badge colorPalette="green">Success</Badge>
      <Badge colorPalette="red">Removed</Badge>
      <Badge colorPalette="purple">New</Badge>
    </Stack>
  );
};

const SideDrwaer = () => {
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
    notification,
    setNotification,
    notificationCount,
    setNotificationCount,
    selectedID,
    setSelectedID,
    OppsiteUserPic,
    setOppsiteUserPic,
    handleNotificationClick,
    setHandleNotificationClick,
    latest_Chats,
    setLatest_Chats,
    undreadTextMessage,
    setUndreadTextMessage,
    message_seen_ack,
    setMessage_seen_ack,
  } = chatState;
  const [search, setSearch] = useState("");
  const [SearchReasult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  //   const { isOpen, onOpen, onClose,onToggle } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRecent, setIsOpenRecent] = useState(true);

  const onOpen = () => {
    console.log("onOpen called - setting isOpen to true");
    setIsOpen(true);
  };

  // useEffect(() => {
  //   console.log("isopen in side drawer useeffect", isOpen);
  // }, [isOpen]);
  // useEffect(() => {
  //   console.log("isOpenRecent in side drawer useeffect", isOpenRecent);
  // }, [isOpenRecent]);

  const handleOpenProfile = () => {
    console.log("Opening profile modal...");
    onOpen();
  };

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
  // const menuOpen = !isMobile ? true : isOpenRecentChats;

  // useEffect(() => {
  //   console.log("handleNotificationClick = ", handleNotificationClick);
  // }, [setHandleNotificationClick]);
  return (
    <div>
      <Recent_chats
        isOpenRecent={isOpenRecent}
        setIsOpenRecent={setIsOpenRecent}
        text="helloRecent"
        position="fixed"
      />

      <Box
        display="flex"
        // position="fixed"
        alignItems="center"
        justifyContent={{ base: "space-between", md: "space-between" }}
        width="100vw"
        // px="30px"
        // bgColor="#303636ff"
        bgColor="#0b5e5eff"
        color="whiteAlpha.600"
        height="8vh"
        // color="blackAlpha.400"
        // overflow="scroll"
        // padding="5px 5px"
        // w="100vw"
      >
        {/*  <Tooltip showArrow content="This is the tooltip content">
           <Button
            variant="outline"
            size="xs"
            bgColor="#161717"
            color="whiteAlpha.600"
            // onClick={() => setIsOpenRecent(!isOpenRecent)}
            onClick={() => setIsOpenRecent((prev) => !prev)}
          >
           <i className="fa-solid fa-magnifying-glass"></i>
            <Text
              display={{ sm: "none", md: "block" }}
              fontSize={{ base: "xs", md: "sm" }}
            >
              Seach User
            </Text> 
          </Button> 
        </Tooltip>*/}
        {/* <RxHamburgerMenu /> */}
        <Text
          // bg="black"
          left="50vw"
          h="5vh"
          position="relative"
          //  bottom="50vw"
          w="fit-content"
          justifyContent="center"
          textAlign="center"
          alignItems="center"
          color="whiteAlpha.700"
          fontFamily="sans-serif"
          // alignContent={"center"}
          fontSize={{ base: "sm", md: "2xl" }}
        >
          Talk-A-Tive
        </Text>

        {/* In summary:
space-between: pushes items to the edges, space only between first and last.
gap: adds space between all items. */}

        <Box
          // bg="red"
          // w="fit-content"
          // left={{ base: "74vw", md: "47vw" }}
          gap="8px"
          zIndex="1000"
          // position="relative"
          // top="-1vh"
          // alignItems="center"
          display="flex"
          // justifyContent="center"
          alignItems="center"
          mr="1vw"
        >
          <Menu.Root
            _focus={{
              border: "transparent",
              outline: "none",
              boxShadow: "none",
            }}
            _focusVisible={{
              outline: "none",
              boxShadow: "none",
            }}
          >
            <Menu.Trigger asChild>
              <Button
                variant="outline"
                size="sm"
                bgColor="#161717"
                color="whiteAlpha.600"
                background="none"
                _focus={{
                  border: "transparent",
                  outline: "none",
                  boxShadow: "none",
                }}
                _focusVisible={{
                  outline: "none",
                  boxShadow: "none",
                }}
              >
                {/* Open */}
                {/* ye main avatar componet menu component ke ander dala hai  */}
                <Avatar.Root
                  // height="30px"
                  // width="30px"
                  bg="pink.500"
                  // size={{ base: "2xs", md: "2xs" }}
                  w={{ base: "16px", md: "34px" }}
                  h={{ base: "16px", md: "34px" }}
                >
                  <Avatar.Fallback name="Segun Kdebayo" fontSize="10px" />
                  <Avatar.Image src="https://bit.ly/sage-adebayo" />
                </Avatar.Root>
                <FaChevronDown />
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content
                  backgroundColor="blackAlpha.950"
                  color="whiteAlpha.800"
                >
                  <Menu.Root
                    positioning={{ placement: "right-start", gutter: 2 }}
                    // display="flex"
                    // justifyContent="center"
                  >
                    <Menu.TriggerItem
                      value="new-txt"
                      textAlign="center"
                      justifyContent="flex-end"
                    >
                      {/* New Text File */}
                      <LuChevronLeft />
                      click here
                      {/* <ProfileModal /> */}
                    </Menu.TriggerItem>

                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content
                          width="150px"
                          backgroundColor="blackAlpha.800"
                          color="whiteAlpha.700"
                        >
                          <Menu.Item
                            value="panda"
                            onClick={handleOpenProfile}
                            textAlign="center"
                            justifyContent="flex-end"
                          >
                            View Profile
                            {/* View profile */}
                            {/* <ProfileModal /> */}
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>

                  <Menu.Item
                    value="new-file"
                    textAlign="center"
                    justifyContent="flex-end"
                  >
                    Logout
                  </Menu.Item>
                  <Menu.Root
                    positioning={{ placement: "right-start", gutter: 2 }}
                  >
                    <Menu.TriggerItem>
                      <LuChevronLeft /> Open Recent
                    </Menu.TriggerItem>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content
                          width="150px"
                          // backgroundColor="whiteAlpha.700"
                          // color="blackAlpha.800"
                        >
                          <Menu.Item
                            value="panda"
                            textAlign="center"
                            justifyContent="flex-end"
                          >
                            Panda
                          </Menu.Item>
                          <Menu.Item
                            value="ark"
                            textAlign="center"
                            justifyContent="flex-end"
                          >
                            Ark UI
                          </Menu.Item>
                          <Menu.Item
                            value="chakra"
                            textAlign="center"
                            justifyContent="flex-end"
                          >
                            Chakra v3
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                  <Menu.Item
                    value="open-file"
                    textAlign="center"
                    justifyContent="flex-end"
                  >
                    Open File
                  </Menu.Item>
                  <Menu.Item
                    value="export"
                    textAlign="center"
                    justifyContent="flex-end"
                  >
                    Export
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <Box
            position="relative"
            display="inline-block"
            // alignItems="center"
            // display="flex"
            // flexDirection=""
            // bg="red.100"
            borderRadius="50%"
            padding="12px"
            onClick={() => {
              if (handleNotificationClick) setHandleNotificationClick(false);
              else setHandleNotificationClick(true);

              console.log("notification.length = ", notification.length);
              console.log("notification = ", notification);
            }}
            // marginBottom="4px"
          >
            {" "}
            {/* <i
              className="fa-solid fa-bell"
              // h="45px"
              // w="45px"
              style={{
                fontSize: { base: "12px", md: "80px" },
                // display: { base: "block", md: "none" },
                color: "white",
                // fontSize: "24px",
              }}
            ></i> */}
            <Box
              display="inline-block"
              h={{ base: "20px", md: "40px" }}
              w={{ base: "20px", md: "40px" }}
              borderRadius="50%"
            >
              <FaBell size={{ base: "18px", md: "18px" }} />
            </Box>
            <Text
              display={notificationCount === 0 ? "none" : "flex"}
              position="absolute"
              bg="teal.500"
              borderRadius="50%"
              fontWeight="bold"
              p={{ base: "3px 8px", md: "5px 10px" }}
              top="3px"
              left={{ base: "20px", md: "30px" }}
              h={{ base: "20px", md: "30px" }}
              w={{ base: "20px", md: "30px" }}
              color="white"
              fontSize={{ base: "10px", md: "15px" }}
            >
              {notificationCount}
            </Text>
          </Box>

          {/* <IconButton
            icon={<FaRegBell />}
            variant="outline"
            fontSize={{ base: "12px", md: "15px" }}
            size="lg"
            position="relative"
          >
            <Badge
              colorScheme="red"
              borderRadius="50%"
              position="absolute"
              top="0"
              right="0"
            >
              {notificationCount}
            </Badge>
          </IconButton> */}
          <Box>
            <Menu.Root
              // onFocusOutside={(e) => {
              //   if (handleNotificationClick) setHandleNotificationClick(false);
              // }}
              // onInteractOutside={(e) => {
              //   if (handleNotificationClick) setHandleNotificationClick(false);
              // }}
              positioning={{ placement: "bottom-start" }}
              open={handleNotificationClick}
            >
              {/* <Menu.Trigger asChild>
              <Button variant="outline" size="sm">
                Open
              </Button>
            </Menu.Trigger> */}
              {handleNotificationClick && (
                <Portal>
                  <Menu.Positioner ml="12vw">
                    <Menu.Content
                      w="500px"
                      bg="blackAlpha.950"
                      // bg="red.300"
                      color="whiteAlpha.800"
                    >
                      {/* jsie notification pe click hoga to notication or notification count  waha se hat zani chahiye uske liye hai ye */}
                      {notification.length > 0 ? (
                        notification.map((n) => (
                          <Menu.Item
                            bg={
                              selectedID === n.chat._id ? "teal.700" : "#1C1B1B"
                            } // 🔥 highlight
                            p={{ base: "8px", md: "25px" }} // ✔ responsive padding
                            // bg="#1C1B1B"
                            _hover={{ bg: "gray.800", cursor: "pointer" }}
                            key={n._id}
                            onClick={(e) => {
                              message_read(setMessage_seen_ack, n.chat._id);
                              fetchLatestChatmessages(setLatest_Chats);
                              setSelectedID(n.chat._id);
                              setUndreadTextMessage((prev) => {
                                if (!Array.isArray(prev)) return []; // safety fallback

                                return prev.map((m) =>
                                  m.chatId === n.chat._id
                                    ? { chatId: null, content: "" } // reset the unread entry
                                    : m
                                );
                              });

                              setIsOpenRecent((prev) => !prev);
                              Promise.resolve().then(() => {
                                // socket.emit("join chat", selectedChatId);
                                setSelectedUserId(n.sender._id);

                                setSelectedChatId(n.chat._id);
                                // Toggle ONLY on mobile
                                // if (isMobile) {
                                //   setIsOpenRecentChats((prev) => !prev);
                                // }

                                n.chat.isGroupChat === true
                                  ? setPerson(n.chat)
                                  : setPerson(() => {
                                      const exists = n.chat.users.find(
                                        //opposite user ki pic nikalo
                                        (u) => u._id !== user.loggedinuser._id
                                      );

                                      if (exists) {
                                        setOppsiteUserPic(exists.pic);
                                        return exists;
                                      }
                                      return null;
                                    });
                                setRefreshToken(refreshToken + 1);

                                n.chat.isGroupChat
                                  ? setGroupChatName(n.chat.chatName)
                                  : setGroupChatName(n.sender.name);
                                n.chat.isGroupChat
                                  ? setGroupChatbtn(true)
                                  : setGroupChatbtn(false);
                                n.chat.isGroupChat
                                  ? setseeMembers(true)
                                  : setseeMembers(false);
                              });
                              // agar maine notication menu se new recived message khola to notication hat zani chahhiye
                              // baki code recent pageke useEffect me  notification map me sabse niche hai yehi waala
                              setNotification((prev) => {
                                const new_array = prev.filter((item) => {
                                  return item._id !== n._id;
                                });
                                return new_array;
                              });
                              setNotificationCount((prev) =>
                                Math.max(prev - 1, 0)
                              );
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
                                  <Avatar.Image
                                    src={(() => {
                                      //IIFE use kro direct js code mat dalo
                                      const exists = n.chat.users.find(
                                        (u) => u._id !== user.loggedinuser._id
                                      );
                                      return exists ? exists.pic : null;
                                    })()}
                                  />
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
                                  {formatMessageDate(n.updatedAt) ||
                                    "unKnown Date"}
                                  {/* {n.chat.latestMessage.updatedAt ||
                                    "unKnown Date"} */}
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
                                    {n.chat.isGroupChat
                                      ? n.chat.chatName
                                      : (() => {
                                          const exists = n.chat.users.find(
                                            (u) =>
                                              u._id !== user.loggedinuser._id
                                          );
                                          return exists ? exists.name : null;
                                        })() || "unKnown"}
                                  </Text>
                                  <Text
                                    color="gray"
                                    fontSize={{ base: "8px", md: "14px" }}
                                  >
                                    {n.content || "unKnown content"}
                                  </Text>
                                </Box>
                              </Box>
                            </Stack>
                          </Menu.Item>
                        ))
                      ) : (
                        <Text
                          fontSize={{ base: "8px", md: "14px" }}
                          textAlign="center"
                        >
                          No Notification found
                          {(() => {
                            setTimeout(() => {
                              setHandleNotificationClick(false);
                            }, 3000);
                          })()}
                        </Text>
                      )}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              )}
            </Menu.Root>
          </Box>
          <ProfileModal isOpen={isOpen} setIsOpen={setIsOpen} text="hello" />
        </Box>

        {/* {console.log("isopen in side drawer", isOpen)} */}
      </Box>
    </div>
  );
};

export default SideDrwaer;
