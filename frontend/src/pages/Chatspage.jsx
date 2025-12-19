import React, { memo, useMemo } from "react";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { ChatState } from "../context/chatProvider";
import {
  Avatar,
  Box,
  Center,
  Flex,
  HStack,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import SideDrwaer from "../components/HomapageComponents/SideDrwaer";
import MyChats from "../components/HomapageComponents/MyChats";
import ChatBox from "../components/HomapageComponents/ChatBox";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Drawer,
  ButtonGroup,
  Menu,
  Textarea,
} from "@chakra-ui/react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import CreateGroup from "../components/HomapageComponents/CreateGroup";
import { toaster } from "../components/ui/toaster";
import TextareaAutosize from "react-textarea-autosize";
import { IoSend } from "react-icons/io5";
import { Combobox, useFilter, useListCollection } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import io from "socket.io-client";
import { ThreeDots } from "react-loader-spinner";
import { IoIosClose } from "react-icons/io";
import {
  fetchLatestChatmessages,
  message_read,
} from "../components/HomapageComponents/utility/FetchlatestmessageRecentChats";
const MessageMenu = ({
  isSelf,
  onEdit,
  onDelete,
  setMenuopen,
  menuOpen,
  content,
  message_ID,
  setEditMessage,
  setCommentTextArea,
  setDialogOpen,
  dialogOpen,
  deleteMessageId,
  setDeleteMessageId,
  // messageSeenAtTime,
  seenAt,
  deliveredAt,
}) => {
  useEffect(() => {
    console.log("dialogOpen = ", dialogOpen);
  }, [dialogOpen]);
  //  const [menuOpen, setMenuopen] = useState(false);

  return (
    <>
      {/* {commentTextArea && (
        <Box position="absolute">
          <Textarea placeholder="Comment..." />
        </Box>
      )} */}

      <Dialog.Root
        // onFocusOutside={(e) => e.preventDefault()}
        // onInteractOutside={(e) => e.preventDefault()}
        open={dialogOpen}
        onOpenChange={(e) => setDialogOpen(e.open)}
        // open={dialogOpen}
      >
        {/* <Dialog.Trigger asChild> 
        { <Button variant="outline" size="sm">
          Open Dialog
        </Button> *
      </Dialog.Trigger> */}
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Dialog Title</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>Do You want to save this edited comment</p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  onClick={() => {
                    setDialogOpen(false);
                  }}
                >
                  Save
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                onClick=
                {() => {
                  setDialogOpen(false);
                }}
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Menu.Root
        // onFocusOutside={(e) => e.preventDefault()}
        // onInteractOutside={(e) => e.preventDefault()}
        open={menuOpen}
        onOpenChange={(e) => setMenuopen(e.open)}
      >
        <Menu.Trigger asChild>
          {/* <Button variant="outline" size="sm">
          Open
        </Button> */}
          <Box cursor="pointer">
            <BsThreeDots />
          </Box>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {isSelf && (
                <Menu.Item
                  value="new-txt-a"
                  onClick={() => {
                    console.log("hello select");

                    // setDialogOpen(true);
                    setCommentTextArea(true);

                    setEditMessage((prev) => ({
                      ...prev,
                      content: content,
                      Id: message_ID,
                    }));
                  }}
                >
                  Edit{" "}
                </Menu.Item>
              )}
              <Menu.Item
                value="new-file-a"
                onClick={() => {
                  setDeleteMessageId(message_ID);
                }}
              >
                Delete 
              </Menu.Item>
              {isSelf && (
                <Menu.Root
                  positioning={{ placement: "right-start", gutter: 2 }}
                >
                  <Menu.TriggerItem>Info</Menu.TriggerItem>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item value="panda">
                          {" "}
                          Seen at:{" "}
                          {seenAt
                            ? new Date(seenAt).toLocaleTimeString()
                            : "Not seen yet"}
                        </Menu.Item>
                        <Menu.Item value="panda">
                          {" "}
                          delivered at:{" "}
                          {deliveredAt
                            ? new Date(deliveredAt).toLocaleTimeString()
                            : "Not delivered yet"}
                        </Menu.Item>
                        {/* <Menu.Item value="chakra">Chakra v3</Menu.Item> */}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              )}
              {/* <Menu.Item value="open-file-a">
                Open File... <Menu.ItemCommand>⌘O</Menu.ItemCommand>
              </Menu.Item>
              <Menu.Item value="export-a">
                Export <Menu.ItemCommand>⌘S</Menu.ItemCommand>
              </Menu.Item> */}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  );
};
const MessageItem = React.memo(function MessageItem({
  msg,
  isSelf,
  read,
  setEditMessage,
  setCommentTextArea,
  setDialogOpen,
  dialogOpen,
  deleteMessageId,
  seenAt,
  deliveredAt,
  setDeleteMessageId,
  // messageSeenAtTime,
}) {
  const [menuOpen, setMenuopen] = useState(false);
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
  return (
    <Box
      // key={msg._id}
      key={`${msg._id}`}
      w="100%"
      display="flex"
      flexDirection="column"
      alignItems={isSelf ? "flex-end" : "flex-start"}
      mb="10px"
    >
      {/* taki pic or message,sendername row direction me aa sake */}
      <Box
        display="flex"
        flexDirection={isSelf ? "row-reverse" : "row"}
        gap={{ base: "5px", md: "20px" }}
      >
        <Avatar.Root
          colorPalette="pink"
          // size="2xs"
          w={{ base: "16px", md: "40px" }}
          h={{ base: "16px", md: "40px" }}
        >
          <Avatar.Fallback name="User" fontSize={{ base: "5px", md: "10px" }} />
          <Avatar.Image src={msg.sender.pic} />
        </Avatar.Root>
        <MessageMenu
          isSelf={isSelf}
          onEdit={() => console.log("Edit", msg._id)}
          onDelete={() => console.log("Delete", msg._id)}
          setMenuopen={setMenuopen}
          menuOpen={menuOpen}
          content={msg.content}
          message_ID={msg._id}
          setEditMessage={setEditMessage} // ✅
          setCommentTextArea={setCommentTextArea}
          setDialogOpen={setDialogOpen}
          dialogOpen={dialogOpen}
          deleteMessageId={deleteMessageId}
          seenAt={seenAt}
          deliveredAt={deliveredAt}

          setDeleteMessageId={setDeleteMessageId}
          // messageSeenAtTime={messageSeenAtTime}
        />{" "}
        <Box
          maxW={{ base: "60%", md: "100%" }}
          p="8px 12px"
          borderRadius="10px"
          bg={isSelf ? "teal.700" : "#144D37"}
          color="white"
        >
          {/* // Message sender name */}
          <Text
            fontSize={{ base: "8px", md: "12px" }}
            fontWeight="bold"
            color="teal.300"
            mb="2px"
          >
            {msg.sender.name}
          </Text>
          {/* All messages */}
          <Text fontSize={{ base: "10px", md: "15px" }}>{msg.content}</Text>
          {isSelf && (
            <Box justifyContent="flex-end" display="flex">
              <IoCheckmarkDoneOutline
                color={read === true ? "#1DA1F2" : "white"}
              />
              {read === true && (
                <Text
                  fontSize={{ base: "8px", md: "12px" }}
                  fontWeight="bold"
                  color="white"
                  mb="2px"
                >
                  seen
                </Text>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {/* message time */}
      <Text
        color="gray.300"
        fontSize={{ base: "8px", md: "12px" }}
        mt="3px"
        // ml="40px"
      >
        {formatMessageDate(msg.createdAt)}
      </Text>
    </Box>
  );
});
const Chatspage = ({ openIt }) => {
  // console.log("%c🔁 Chatspage rendered", "color: orange; font-weight: bold;");
  const isRequestRunning = useRef(false);

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
    OppsiteUserPic,
    setOppsiteUserPic,
    isOpenRecentChats,
    setIsOpenRecentChats,
    handleNotificationClick,
    setHandleNotificationClick,
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
  const ENDPOINT = "http://localhost:5000";
  const [IsOpenGroupAdd, setIsOpenGroupAdd] = useState(false);
  const [GroupUsers, setGroupUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [select, setSelect] = useState(null);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [isopen, setIsOpen] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [Remove, setRemove] = useState(null);
  const [openDialogUser, setopenDialogUser] = useState(null);

  const [deleteMessageId, setDeleteMessageId] = useState(null);
  const [isOpenRecent, setIsOpenRecent] = useState(false);
  const [value, setValue] = useState("");
  const textareaRef1 = useRef(null);
  const textareaRef2 = useRef(null);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  const [messages, setMessages] = useState([]);
  const [TypingData, setTypingData] = useState({
    chatId: null,
    users: [],
    oppsiteUserId: null,
  });
  const [sendMessage, setSendMessage] = useState({
    content: "",
  });
  const [editMessage, setEditMessage] = useState({
    content: "",
    Id: null,
  });
  const [commentTextArea, setCommentTextArea] = useState(false);
  const [sendMessageTime, setSendMessageTime] = useState({
    time: "",
  });
  const [messageSeenAtTime, setMessageSeenAtTime] = useState(null);
  const [GroupChatId, setGroupChatId] = useState(null);
  const [newmessageRecived, setNewmessageRecived] = useState(null);
  const [OppsiteUserId, setOppsiteUserId] = useState(null);
  const [message_ID, setMessage_ID] = useState(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [startTyping, setStartTyping] = useState(false);
  const [stopTyping, setStopTyping] = useState(false);

  const [SocketConnected, setSocketConnected] = useState(false);
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();
  const textareaRefs = useRef({});
  const SendMEssageRef = useRef({});

  // const editmessagecloseButton = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const messagesEndRef = useRef(null); //last message pe scoll kerne ke liye page reload ke time
  const { contains } = useFilter({ sensitivity: "base" });
  const memoizedUsers = useMemo(() => GroupUsers, [GroupUsers]);
  const {
    collection: c1,
    set: setc1,
    filter: filterc1,
  } = useListCollection({
    initialItems: [], // start empty
    filter: contains,
  });

  const {
    collection: c2,
    set: setc2,
    filter: filterc2,
  } = useListCollection({
    initialItems: [], // start empty
    filter: contains,
  });

  useEffect(() => {
    if (GroupUsers.length > 0) {
      // console.log("Setting collection items:", GroupUsers);
      setc1(GroupUsers); // 👈 this updates collection.items immediately
    }
  }, [GroupUsers, setc1]);

  const handleChange = (id, value) => {
    setMessages((prev) =>
      prev.map((msg) => (msg._id === id ? { ...msg, content: value } : msg))
    );
  };
  const handletimeChange = (id, time) => {
    setSendMessageTime((prev) =>
      prev.map((msg) => (msg._id === id ? { ...msg, time: time } : ""))
    );
  };
  //Iki zarrurat ni hai vise niche commentETxtArea se hi ye kaam hoga
  // useEffect(() => {
  //   if (
  //     editmessagecloseButton.current &&
  //     editmessagecloseButton.current.display === "flex" &&
  //     commentTextArea === true
  //   ) {
  //     editmessagecloseButton.current.style.display = "none";
  //   }
  // }, [commentTextArea]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    // add event listener
    window.addEventListener("resize", handleResize);

    // cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // run once to attach listener
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
  useEffect(() => {
    // console.log("sendMessage", sendMessage);
  }, [sendMessage]);
  useEffect(() => {
    const textarea = SendMEssageRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset height
      textarea.style.height = textarea.scrollHeight + "px"; // set to content height
    }
  }, [sendMessage]);
  useEffect(() => {
    Object.values(textareaRefs.current).forEach((textarea) => {
      if (textarea) {
        //  const msgId = textarea.dataset.id;
        //  const msgCid = textarea.dataset.cid;
        //  const msgName = textarea.dataset.name;

        textarea.style.height = textarea.scrollHeight + "px"; // set to content height
        textarea.style.borderRadius = "8px";
        // const userInfo = localStorage.getItem("userInfo");
        // const parsedUser = JSON.parse(userInfo);
        // const screenWidth = window.innerWidth;
        // const sender = content.dataset.sender;
        // const isSelf = user.loggedinuser._id === sender;

        // if (isSelf) {
        //   if (screenWidth < 768) {
        //     // base screen (mobile)
        //     content.style.marginLeft = "60vw";
        //     time.style.marginLeft = "62vw";
        //   } else {
        //     // md and above
        //     content.style.marginLeft = "65vw";
        //     time.style.marginLeft = "66vw";
        //   }
        // } else {
        //   if (screenWidth < 768) {
        //     content.style.marginLeft = "20vw";
        //     time.style.marginLeft = "18vw";
        //   }
        //   //md above
        //   else {
        //     content.style.marginLeft = "1vw";
        //     time.style.marginLeft = "50px";
        //   }
        // }
        // Auto Width
        textarea.style.width = "auto";

        const minWidth = 40; // bubble should not shrink too small
        const maxWidth = 250; // maximum bubble width (like WhatsApp)

        const calculatedWidth = textarea.scrollWidth + 10; // little padding

        textarea.style.width =
          Math.min(Math.max(calculatedWidth, minWidth), maxWidth) + "px";
        // textarea.style.width = calculatedWidth + "px";

        textarea.style.borderRadius = "8px";
      }
    });
  }, [messages, windowWidth]); //messages need to be reoload when viewport(screen changes)

  useEffect(() => {
    setShow(true);
  }, [IsGroup]);

  useEffect(() => {
    [textareaRef1, textareaRef2].forEach((ref) => {
      const textarea = ref.current;
      // console.log("textarea =", textarea.value);

      if (textarea) {
        textarea.style.height = "auto"; // reset height
        textarea.style.height = textarea.scrollHeight + "px"; // set to content height
      }
    });
  }, [value1, value2]);

  const uniqueMemberArray = members.users
    ? [...new Map(members.users.map((member) => [member._id, member])).values()]
    : [0];
  useEffect(() => {
    const whichUSerISPresentInGroup = async () => {
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
          `http://localhost:5000/api/chat/fetchUserOfGroup`,
          config
        );

        if (res.status === 200) {
          // console.log("res data in CreateGroup", res);
          // console.log("res.data is ", res.data);
          const formatted = res.data.data.map((user) => ({
            label: user.value.name, // 👈 visible label in dropdown
            value: user.value._id, // 👈 unique identifier
            iscommon: user.iscommon, // optional — extra info you can use later
          }));
          setGroupUsers(formatted);

          toaster.dismiss();
          toaster.create({
            title: `found`,
            type: "success", // show success
          });
        }
      } catch (error) {
        // console.log("fetching user failed = ", error);
        // setLoading(false); // hide loader
        toaster.dismiss();
        toaster.create({
          title: `search result 0`,
          type: "error", // show success
        });
      }
    };
    Promise.resolve().then(() => {
      whichUSerISPresentInGroup();
    });
  }, []);

  useEffect(() => {
    setSendMessage((prev) => ({
      ...prev,
      content: "",
    }));
  }, [selectedChatId]);

  useEffect(() => {
    const DeleteMessagefun = async () => {
      // if (person === null) return; // exit if person or _id is null
      if (!deleteMessageId) {
        return;
      }
      try {
        toaster.dismiss(); // runs immediately
        toaster.create({
          // runs immediately
          title: `Wait for Deleting the chat`,
          type: "loading", // show success
        });

        const config = {
          headers: {
            "Content-Type": "application/json",

            // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
          },
          withCredentials: true,
        };
        const res = await axios.delete(
          `http://localhost:5000/api/message/delete-message?message_ID=${deleteMessageId}`,

          config
        ); // waits here

        // runs AFTER response
        if (res.status === 200) {
          // runs AFTER response
          toaster.dismiss();

          console.log(res.data.data, "messages of DeleteMessageFun");
          //Target the corrected Message
          //filter new array return kerge keval vo messages jinki id deletemessageid ke barabar na ho taki vo delete wala hat zae ab UI me

          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg._id !== deleteMessageId)
          );
          if (latest_Chats.length > 0) {
            setLatest_Chats((latestmessages) =>
              latestmessages.map((msg) =>
                msg.latestMessage?._id.toString() === deleteMessageId.toString()
                  ? res.data.data.latestMessage
                  : msg
              )
            );
          }
          setDeleteMessageId(null);
        }
      } catch (error) {
        toaster.dismiss();
        // toaster.create({
        //   title: `${error.response.data.message}`,
        //   type: "error", // show success
        // });
      }
    };
    Promise.resolve().then(() => {
      if (deleteMessageId) DeleteMessagefun(); //yehi mapi groupchat bhi find kerdegi
    });
  }, [deleteMessageId]);

  const EditMessagefun = async () => {
    // if (person === null) return; // exit if person or _id is null
    if (editMessage.content === "") {
      return;
    }
    try {
      toaster.dismiss();
      toaster.create({
        title: `Wait for Updating the chat`,
        type: "loading", // show success
      });

      const config = {
        headers: {
          "Content-Type": "application/json",

          // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
        },
        withCredentials: true,
      };
      const body = {
        new_content: editMessage.content,
        message_ID: editMessage.Id,
      };
      console.log("Edit body is ", body);
      const res = await axios.post(
        `http://localhost:5000/api/message/edit-message`,
        body,
        config
      );

      if (res.status === 200) {
        toaster.dismiss();

        // setMessages((prev) => [...prev, res.data.data]);//here in edit not do this
        //It will add new messages duplicate target the edited messages only
        // socketRef.current.emit("new message", res.data.data);

        // setMessageData(res.data.data);

        console.log(res.data.data, "messages of EditMessageFun");
        //Target the corrected Message
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === editMessage.Id
              ? { ...msg, content: editMessage.content }
              : msg
          )
        );
        // setRefreshToken(refreshToken + 1);

        setEditMessage((prev) => ({
          ...prev,
          content: "",
          Id: null,
        }));
      }
    } catch (error) {
      toaster.dismiss();
      // toaster.create({
      //   title: `${error.response.data.message}`,
      //   type: "error", // show success
      // });
    }
  };
  const sendMessagefun = async () => {
    // if (person === null) return; // exit if person or _id is null
    if (sendMessage.content === "") {
      return;
    }
    try {
      toaster.dismiss();
      toaster.create({
        title: `Wait for sending chat`,
        type: "loading", // show success
      });

      const config = {
        headers: {
          "Content-Type": "application/json",

          // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
        },
        withCredentials: true,
      };
      const body = {
        content: sendMessage.content,
        // OnlyAdmin: false,
        userid: selectedUserId !== null ? selectedUserId : null,
        isGroupChat: GroupChatId !== null ? true : false,
        GroupChat_id: selectedChatId !== null ? selectedChatId : null,
      };
      console.log("body is ", body);
      const res = await axios.post(
        `http://localhost:5000/api/message/send-message`,
        body,
        config
      );

      if (res.status === 200) {
        toaster.dismiss();
        // toaster.create({
        //   title: `${res.data.message}`,
        //   type: "success ", // show success

        // });
        // add the message instantly in your UI
        setMessages((prev) => [...prev, res.data.data]);
        socketRef.current.emit("new message", res.data.data);

        // setMessageData(res.data.data);

        console.log(res.data.data, "messages of sendmessafefun");
        // setMessages(res.data.data);
        //  toaster.dismiss();
        // console.log("res.data of chat userid  is ", res.data.data);

        // setopenDialogUser(null);
        // ✅ Clear message box after send
        setRefreshToken(refreshToken + 1);

        setSendMessage((prev) => ({
          ...prev,
          content: "",
        }));
      }
    } catch (error) {
      toaster.dismiss();
      // toaster.create({
      //   title: `${error.response.data.message}`,
      //   type: "error", // show success
      // });
    }
  };
  const socketRef = useRef(null);

  /*var socket, selectedChatCompare;
  //Socket connection recived from server
  useEffect(() => {
    socketRef.current = io(ENDPOINT);

    socketRef.current.on("connected", () => {
      console.log("Socket connected1");
      console.log("Socket ID1:", socketRef.current.id);
      setSocketConnected(true);
    });

    return () => socketRef.current.disconnect();
  }, []);

  //Socket connection send to server
  useEffect(() => {
    if (socket && selectedUserId) {
      console.log("Setup connection2");
      socketRef.current.emit("Setup", selectedUserId);
      socketRef.current.on("connection", () => setSocketConnected(true));
    }
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;
    if (!selectedChatId) return;

    console.log("Joining chat3 = ", selectedChatId);
    socketRef.current.emit("join chat", selectedChatId);
  }, [selectedChatId]);

  const selectedChatIdRef = useRef(null);
  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);*/
  //  --------------------
  // new socket

  const selectedChatIdRef = useRef(null);

  // Sync ref whenever chat changes
  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  // Connect to server ONCE
  useEffect(() => {
    const socket = io(ENDPOINT, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connected", () => {
      console.log("Socket connected:", socket.id);
      setSocketConnected(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Send Setup when we get selectedUserId
  useEffect(() => {
    if (!socketRef.current || !selectedUserId) return;

    console.log("Sending Setup with user:", selectedUserId);
    socketRef.current.emit("Setup", selectedUserId);
  }, [selectedUserId]);

  // Join chat room
  useEffect(() => {
    if (!socketRef.current || !selectedChatId) return;

    console.log("Joining chat room:", selectedChatId);
    socketRef.current.emit("join chat", selectedChatId);
  }, [selectedChatId]);

  //agar notificaation aaa rakaha hai makahan ki taraf se or mai seach kerke uski chatbox khole to bhi notication hat zani chahhiye
  //baki cde chatpage ke notification map me sabse niche hai yehi waala
  useEffect(() => {
    const notifications = notification.map((n) => {
      if (n.chat._id === selectedChatId) {
        setNotification((prev) => {
          const new_array = prev.filter((item) => {
            return item._id !== n._id;
          });
          return new_array;
        });
        setNotificationCount((prev) => Math.max(prev - 1, 0));
      }
      return n;
    });
  });

  // useEffect(() => {
  //   // ⛔ Do NOT run when chat not selected or no messages exist
  //   if (!selectedChatId || messages.length === 0 || other === null) return;
  //   // ⛔ Do NOT run the request when no chat is selected

  //   const latest = messages[0];

  //   // ⛔ Skip if message does NOT belong to selected chat
  //   if (latest.chat !== selectedChatId) return;

  //   // ⛔ Skip if message is sent BY ME (sender === me)
  //   // Meaning: Only run IF sender !== me → I AM RECEIVER
  //   if (other._id === user.loggedinuser._id) return;
  //   console.log(user.loggedinuser._id, "user id in readby");
  //   console.log("readBY run");

  //   const message_read = async () => {
  //     try {
  //       const body = {
  //         message_ID: null,
  //         chat_ID: selectedChatId,
  //         seen: true,
  //         delivered: true,
  //       };
  //       const config = {
  //         headers: {
  //           "Content-Type": "application/json",

  //           // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
  //         },
  //         withCredentials: true,
  //       };

  //       const res = await axios.post(
  //         `http://localhost:5000/api/message/read_By`,
  //         body,
  //         config
  //       );

  //       if (res.status === 200) {
  //         toaster.dismiss();
  //         console.log(" message seen =", res.data.data.message);
  //         socketRef.current.emit("message seen", res.data.data);
  //       }
  //     } catch (error) {
  //       toaster.dismiss();
  //     } finally {
  //       isRequestRunning.current = false; // 🔓 Unlock for next request
  //     }
  //   };

  //   Promise.resolve().then(() => {
  //     message_read(); //yehi mapi groupchat bhi find kerdegi
  //   });
  // }, [refreshToken, selectedChatId, messages]);
  // useEffect(() => {
  //   selectedChatIdRef.current = selectedChatId;
  // }, [selectedChatId]);

  // const message_read = async (chatid) => {
  //   // if (isRequestRunning.current) return; // prevent double calls
  //   // isRequestRunning.current = true; // 🔒 LOCK
  //   // if (selectedChatId === null) return;
  //   try {
  //     const body = {
  //       message_ID: null,
  //       chat_ID: chatid,
  //       seen: true,
  //       delivered: true,
  //     };
  //     console.log("body =", body);
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",

  //         // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
  //       },
  //       withCredentials: true,
  //     };

  //     const res = await axios.post(
  //       `http://localhost:5000/api/message/read_By`,
  //       body,
  //       config
  //     );

  //     if (res.status === 200) {
  //       toaster.dismiss();
  //       console.log(" message seen =", res.data.data);
  //       socketRef.current.emit("message seen", res.data.data); //message seen confirmation to server
  //     }
  //   } catch (error) {
  //     toaster.dismiss();
  //   } finally {
  //     isRequestRunning.current = false; // 🔓 Unlock for next request
  //   }
  // };
  useEffect(() => {
    if (!socketRef.current) {
      console.log("socket hai hi ni message seen me");
      return;
    }
    socketRef.current.on("message seen ack", async (messageSeenData) => {
      // console.log("Message seen ack received at client:", messageSeenData);
      if (selectedChatIdRef.current === messageSeenData.message.chat._id) {
        setRefreshToken((prev) => prev + 1);
      }
    });
  });
  useEffect(() => {
    if (!socketRef.current) {
      console.log("socket hai hi ni");
      return;
    }

    socketRef.current.on("message recived", (newMessageRecived) => {
      // if(selectedChatId===null)return
      // console.log("selectedChatIdRef =", selectedChatIdRef.current);
      // console.log("newMessageRecived.chat._id = ", newMessageRecived.chat._id);
      // console.log("newMessageRecived", newMessageRecived);
      setNewmessageRecived(newMessageRecived);
      // setPerson(newMessageRecived.sender);
      fetchLatestChatmessages(setLatest_Chats);

      // setRefreshToken(refreshToken + 1);
      if (selectedChatIdRef.current !== newMessageRecived.chat._id) {
        setUndreadTextMessage((prev) => {
          // ensure prev is always array
          const safePrev = Array.isArray(prev) ? prev : [];

          const exists = safePrev.find(
            (m) => m.chatId === newMessageRecived.chat._id
          );

          if (exists) {
            return safePrev.map((m) =>
              m.chatId === newMessageRecived.chat._id
                ? {
                    chatId: newMessageRecived.chat._id,
                    content: newMessageRecived.content,
                  }
                : m
            );
          }

          return [
            ...safePrev,
            {
              chatId: newMessageRecived.chat._id,
              content: newMessageRecived.content,
            },
          ];
        });

        // give notification
        // console.log("notification if");
        // if (!notification.find((n) => n._id === newMessageRecived._id)) {
        //   //  setNotification((prev) => {
        //   //    if (prev.some((n) => n._id === newMessageRecived._id)) return prev;
        //   //    return [newMessageRecived, ...prev];
        //   //  });
        //   //found return an object if found and some() return bollean true/false
        //   // setNotification([newMessageRecived, ...notification]);//complex way
        //   setNotification((prev) => [...prev, newMessageRecived]); //add new message to top
        //   // setNotification((prev) => [...prev, newMessageRecived]);//add new message to top
        //   // console.log(
        //   //   "New message received in different chat, adding to notification"
        //   // );
        //   setAlert(true);
        //   // setMessages((prev) => [...prev, newMessageRecived]);

        //   if (
        //     !notification.find(
        //       (n) => n.sender._id === newMessageRecived.sender._id
        //     )
        //   ) {
        //     setNotificationCount((prev) => prev + 1);
        //     console.log("Message from different sender in notification");
        //   } else {
        //     console.log("Message from this sender already in notification");
        //   }
        // }
        // console.log("New message received in different chat");
        // toast notification code can go here
        console.log("newmessageRecived = ", newMessageRecived);
        setNotification((prev) => {
          // Check inside latest state
          const index = prev.findIndex(
            (n) => n.sender._id === newMessageRecived.sender._id
          );
          //CASE:1  if same user send more messages then show only last latest message in notification menu so handle this case also
          if (index !== -1) {
            // setUndreadTextMessage({
            //   content: newMessageRecived.content,
            //   chatId: newMessageRecived.chat._id,
            // });
            // unreadRef.current = {
            //   content: newMessageRecived.content,
            //   chatId: newMessageRecived.chat._id,
            // };

            forceUpdate(); // triggers re-render everywhere
            fetchLatestChatmessages(setLatest_Chats);
            // setRefreshToken(refreshToken + 1);
            //update the content to current latest mesage which is recived in notification array of the sender to see the latest message in notification menu
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              content: newMessageRecived.content, // update content
              chat: newMessageRecived.chat, // optional
              updatedAt: newMessageRecived.updatedAt,
            };

            // 🔔 Play notification sound
            //Note ye import file path nahi hai recat sab khuch public folder se lega to public folder me mp3 file rakhni hai
            //or path asa hi dena hai /filename.mp3

            const audio = new Audio("/classic-tune-430416.mp3");

            audio.play().catch(() => {}); // ignore autoplay issues
            console.log("audio = ", audio);
            // 🔽 Open tray now
            setHandleNotificationClick(true);

            // ⏳ Close tray after 2 seconds
            setTimeout(() => {
              setHandleNotificationClick(false);
            }, 2000);

            return updated;
          }

          // ⚡ CASE 2: New sender → add notification and add their message in notification array
          setNotificationCount((c) => c + 1);
          const audio = new Audio("/classic-tune-430416.mp3");
          setTimeout(() => {
            setHandleNotificationClick(false);
          }, 4000);

          audio.play().catch(() => {}); // ignore autoplay issues
          return [...prev, newMessageRecived];
        });

        // Increase count only when a *new sender* sends message
        // setNotificationCount((prevCount) => {
        //   const senderExists = notification.some(
        //     (n) => n.sender._id === newMessageRecived.sender._id
        //   );
        //   console.log("senderExists =", senderExists);
        //   return senderExists ? prevCount : prevCount + 1;
        // });
        // setNotification((prev) => {
        //   // Check if sender already exists in latest array
        //   const senderExists = prev.some(
        //     (n) => n.sender._id === newMessageRecived.sender._id
        //   );

        //   // Increase count ONLY when sender is new
        //   if (!senderExists) {
        //     setNotificationCount((c) => c + 1);
        //   }

        //   // Prevent duplicate messages
        //   const msgExists = prev.some((n) => n._id === newMessageRecived._id);
        //   if (msgExists) return prev;

        //   return [...prev, newMessageRecived];
        // });

        setAlert(true);
      } else {
        // if same window open sender and reciver in chatbox chahhting to each other
        // const audio = new Audio("/classic-tune-430416.mp3");
        // setTimeout(() => {
        //   setHandleNotificationClick(false);
        // }, 4000);

        // audio.play().catch(() => {}); // ignore autoplay issues
        setMessages((prev) => [...prev, newMessageRecived]);
        setStartTyping(false);
        setAlert(false);
        Promise.resolve().then(() => {
          // if(message_seen_ack!==null)
          message_read(setMessage_seen_ack, newMessageRecived.chat._id);
        });
        // setRefreshToken((prev) => prev + 1);
        console.log("message read called in else");
      }
    });

    // setRefreshToken(refreshToken + 1);

    // return () => {
    //   socketRef.current.off("message recived");
    // };
  }, []);
  useEffect(() => {
    if (message_seen_ack !== null)
      socketRef.current.emit("message seen", message_seen_ack);
  }, [message_seen_ack]);

  const TypingDataRef = useRef(null);
  useEffect(() => {
    TypingDataRef.current = TypingData;
  }, [TypingData]);
  // useEffect(() => {//isme emit,on eke sath tha isliye sender se to request ja ri thi leking agar revire ne khuch typenhi
  // kiya to useefect run ni hoga of socket ki request recived ni hogi isliye emit,on alag alag useefcet me banao jo just nichie kiya hai
  //   socketRef.current.on("message recived", (newMessageRecived) => {});
  //   if (
  //     startTyping === false &&
  //     TypingDataRef.current.chatId === selectedChatId
  //   ) {
  //     console.log(
  //       "if me andar aaya starttyping = ",
  //       startTyping,
  //       TypingDataRef.current.chatId === selectedChatId
  //     );
  //     socketRef.current.emit("start typing", TypingDataRef.current);
  //     socketRef.current.on("start typing", (TypingData) => {
  //       if (TypingData.oppsiteUserId?._id === user.loggedinuser?._id) {
  //         console.log(
  //           " oppsiteUserId._id === user.loggedinuser._id if me andar aaya "
  //         );
  //         setStartTyping(true);
  //       }
  //     });
  //   }
  //   let lastTypingTime = new Date().getTime();
  //   var timerLength = 3000;
  //   const timer = setTimeout(() => {
  //     var timeNow = new Date().getTime();
  //     var timeDiff = timeNow - lastTypingTime;

  //     if (timeDiff > timerLength) {
  //       socketRef.current.emit("stop typing", TypingDataRef.current);
  //       socketRef.current.on("stop typing", (oppsiteUserId) => {
  //         if (oppsiteUserId._id === user.loggedinuser._id)
  //           setStartTyping(false);
  //       });
  //     }
  //   }, timerLength);
  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    socketRef.current.on("start typing", (TypingData) => {
      if (
        TypingData.oppsiteUserId._id === user.loggedinuser._id &&
        !Array.isArray(TypingData.oppsiteUserId) &&
        TypingData.chatId === selectedChatId
      ) {
        setStartTyping(true);
      } else if (
        TypingData.chatId === selectedChatId &&
        Array.isArray(TypingData.oppsiteUserId)
      ) {
        const oppositeIds = new Set(TypingData.oppsiteUserId.map((u) => u._id));
        const uniqueUser = TypingData.users.find(
          (u) => !oppositeIds.has(u._id)
        );
        console.log("uniqueUser = ", uniqueUser);
        const condition = uniqueUser._id !== user.loggedinuser._id;
        if (condition) setStartTyping(true);
      }

      // if (
      //   TypingData.oppsiteUserId._id === user.loggedinuser._id &&
      //   TypingData.chatId === selectedChatId
      // )
      //   setStartTyping(true);
    });
    socketRef.current.on("stop typing", (TypingData) => {
      if (
        TypingData.oppsiteUserId._id === user.loggedinuser._id &&
        !Array.isArray(TypingData.oppsiteUserId) &&
        TypingData.chatId === selectedChatId
      ) {
        setStartTyping(false);
      } else if (
        TypingData.chatId === selectedChatId &&
        Array.isArray(TypingData.oppsiteUserId)
      ) {
        const oppositeIds = new Set(TypingData.oppsiteUserId.map((u) => u._id));
        const uniqueUser = TypingData.users.find(
          (u) => !oppositeIds.has(u._id)
        );
        console.log("uniqueUser = ", uniqueUser);
        const condition = uniqueUser._id !== user.loggedinuser._id;
        if (condition) setStartTyping(false);
      }
    });
    return () => {
      socketRef.current.off("start typing");
      socketRef.current.off("stop typing");
    };
  }, [selectedChatId]);

  useEffect(() => {
    if (!sendMessage?.content) return;
    if (!startTyping) {
      socketRef.current.emit("start typing", TypingDataRef.current);
      // setStartTyping(true);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    const timer = setTimeout(() => {
      const timeNow = new Date().getTime();
      if (timeNow - lastTypingTime >= timerLength) {
        socketRef.current.emit("stop typing", TypingDataRef.current);
        setStartTyping(false);
      }
    }, timerLength);
    return () => clearTimeout(timer);
  }, [sendMessage]);
  const handleChangeMessage = (value) => {
    setSendMessage((prev) => ({
      ...prev,
      content: value,
    }));
  };
  const handleEditMessage = (value) => {
    setEditMessage((prev) => ({
      ...prev,
      content: value,
    }));
  };
  let other = null;
  useEffect(() => {
    const createAccess_One_On_One_Chat = async (userid) => {
      if (person === null) return; // exit if person or _id is null

      // ⛔ Prevent duplicate requests
      if (isRequestRunning.current) {
        console.log("Skipped duplicate request");
        return;
      }
      isRequestRunning.current = true; // 🔒 Lock

      try {
        if (userid === null) {
          toaster.dismiss();
          toaster.create({
            title: `userid is not recived to create and access one on one chat`,
            type: "error", // show success
          });
          return;
        }
        toaster.dismiss();
        toaster.create({
          title: `Wait for creating chat`,
          type: "loading", // show success
        });
        const config = {
          headers: {
            "Content-Type": "application/json",

            // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
          },
          withCredentials: true,
        };
        const res = await axios.get(
          `http://localhost:5000/api/chat?userid=${userid}`,
          config
        );

        if (res.status === 200) {
          toaster.dismiss();
          // console.log(" userid res.data.data =", res.data.data);
          setMembers(res.data.data);
          setSelectedChatId(res.data.data._id); //is id se hum chatpage me kisi bhi user/Group ki sari chat ko fetch kernge
          // setPerson(null);
          if (res.data.data.isGroupChat) {
            console.log("ander");

            other = res.data.data.users.filter(
              (u) => u._id !== user.loggedinuser._id
            );
            // console.log(
            //   "res.data.data.isGroupChat =",
            //   res.data.data.isGroupChat
            // );

            /* console.log("isGroupChat =", res.data.data.isGroupChat);

             console.log("users =", res.data.data.users);
             console.log("loggedinuser =", user.loggedinuser);

             // ⛔ If either of these is undefined, filter will break
             other =
               res.data.data.users?.filter(
                 (u) => u._id !== user.loggedinuser?._id
               ) || [];

             console.log("other after filter =", other);*/
          } else {
            other = res.data.data.users.find((u) =>
              u._id !== user.loggedinuser._id ? u._id : null
            );
          } //if no users matches then it returns null
          // console.log("other user id =", other);
          setTypingData({
            chatId: res.data.data._id,
            users: res.data.data.users,

            oppsiteUserId: other,
            //if no users matches then it returns null
          });
          // socket.emit("join chat", res.data.data._id);
          // console.log(
          //   "opposite id and name for one to one chat = ",
          //   res.data.data.users[1]._id,
          //   res.data.data.users[1].name
          // );
          setSelectedChat(res.data.data);
          if (res.data.data.isGroupChat === false) {
            setGroupChatId(null);
            setSelectedChatId(res.data.data._id);
          } else {
            setGroupChatId(res.data.data._id);
            setSelectedChatId(res.data.data._id);
          }
          const userInfo = localStorage.getItem("userInfo");
          const parsedUser = JSON.parse(userInfo);

          res.data.data.users.map((user) => {
            if (user._id !== parsedUser.loggedinuser._id) {
              setOppsiteUserId(user._id);
              setSelectedUserId(user._id);
              setOppsiteUserPic(user.pic);
            }
            return user;
          });

          setopenDialogUser(null);
        }
      } catch (error) {
        toaster.dismiss();
        // toaster.create({
        //   title: `${error.response.message}`,
        //   type: "error", // show success
        // });
        // return; // <-- FIX (prevents undefined res from being used)
      } finally {
        isRequestRunning.current = false; // 🔓 Unlock for next request
      }
    };
    if (person !== null) {
      Promise.resolve().then(() => {
        createAccess_One_On_One_Chat(person._id); //yehi mapi groupchat bhi find kerdegi
      });
    }
  }, [refreshToken]);
  useEffect(() => {
    const fetchChatWithSelectedUser = async (selectedChatId) => {
      try {
        if (selectedChatId === null) {
          return;
        }
        toaster.dismiss();
        toaster.create({
          title: `Wait for fetching messages...`,
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
          `http://localhost:5000/api/message/fetch-messages?chatid=${selectedChatId}`,
          config
        );

        if (res.status === 200) {
          toaster.dismiss();
          console.log("res data in fetchChatWithSelectedUser", res.data.data);

          setMessages(res.data.data);
          setopenDialogUser(null);
        }
      } catch (error) {
        toaster.dismiss();
        toaster.create({
          title: `${error.response?.data?.message}`,
          type: "error", // show success
        });
      }
    };
    Promise.resolve().then(() => {
      fetchChatWithSelectedUser(selectedChatId);
    });
  }, [selectedChatId, refreshToken]);
  const AddToGroup = async () => {
    // if
    try {
      toaster.dismiss();
      toaster.create({
        title: `Wait...`,
        type: "loading", // show success
      });
      const body = {
        userids: select,
        OnlyAdmin: false,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",

          // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
        },
        withCredentials: true,
      };
      console.log("config userList is ", config);
      const res = await axios.put(
        `http://localhost:5000/api/chat/addToGroup`,
        body,
        config
      );

      if (res.status === 200) {
        console.log("res data in AddToGRoup", res);
        console.log("res.data is ", res.data.message);
        toaster.dismiss();
        toaster.create({
          title: `${res.data.message}`,
          type: "success", // show success
        });
        setRefreshToken(refreshToken + 1);
      }
    } catch (error) {
      console.log("Adding person = ", error);
      // setLoading(false); // hide loader
      toaster.dismiss();
      toaster.create({
        title: `${error.response.data.message}`,
        type: "error", // show success
      });
    }
  };

  const GroupRemove = async () => {
    try {
      toaster.dismiss();
      toaster.create({
        title: `Wait  for removing from Group...`,
        type: "loading", // show success
      });
      const body = {
        userid: openDialogUser,
        OnlyAdmin: false,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",

          // Authorization: `Bearer ${JSON.parse(userinfo).user}`,//y to tye likh lo nahi to withcredaditals true
        },
        withCredentials: true,
      };
      console.log("config userList is ", config);
      const res = await axios.put(
        `http://localhost:5000/api/chat/groupremove`,
        body,
        config
      );

      if (res.status === 200) {
        // console.log("res data in AddToGRoup", res);
        // console.log("res.data is ", res.data.message);
        toaster.dismiss();
        // toaster.create({
        //   title: `${res.data.message}`,
        //   type: "success", // show success
        // });
        setopenDialogUser(null);
        setRefreshToken(refreshToken + 1);
      }
    } catch (error) {
      // console.log("Adding person = ", error);
      // setLoading(false); // hide loader
      toaster.dismiss();
      toaster.create({
        title: `${error.response.data.message}`,
        type: "error", // show success
      });
    }
  };
  useEffect(() => {
    //last message pe scoll kerne ke liye page reload ke time

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      {user && <SideDrwaer />}

      <Box
        ref={messagesEndRef} //last message pe scoll kerne ke liye page reload ke time
        marginLeft={{ base: "1vw", md: "25.3vw" }}
        position="fixed"
        top={"7.7vh"}
        // bg="red.600"

        zIndex="100"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        // alignItems={Center}//This cause maximum callstack problem don't write Center because it is a prop in chakra ui
        //use css inside the double-quotes "center"
        alignItems="center"
        width={{ base: "100vw", md: "75.4vw" }}
        height="81.6vh"
        // backgroundColor="red.400"
        backgroundColor="rgb(22,23,23)"
        // overflowY="scroll"
        // overflowX="hidden"

        backgroundImage="url('/chatAap_background.jpg')" // ✅ relative to /public
        backgroundSize="cover" // ✅ cover entire box
        backgroundPosition="center" // ✅ center the image
        backgroundRepeat="no-repeat" // ✅ prevent tiling
        // overflowX="hidden"
        overflowX="hidden"
      >
        <Box
          width={{ base: "100vw", md: "70vw" }}
          display="flex"
          alignItems="center"
          // marginTop={{ base: "1vw", md: "" }}
          gap="10vw"
          justifyContent={{ base: "flex-start", md: "flex-start" }}
          flexDirection="row"
          // bg="#282828"
          bg="teal.800"
          // bg="#a62828b2"
          top="0vw"
          bottom="90vw"
          position="sticky"
          zIndex={1000}
        >
          <Box
            display={{ base: "flex", md: "none" }}
            justifyContent="flex-start"
            // backgroundColor="yellow.200"
            w="fit-content"
            // ml="2vw"
            gap="20px"
          >
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="outline" size={{ base: "2xs", md: "md" }}>
                  <Avatar.Root
                    colorPalette="pink"
                    // size="2xs"
                    w={{ base: "16px", md: "20px" }}
                    h={{ base: "16px", md: "20px" }}
                  >
                    <Avatar.Fallback
                      name="User"
                      fontSize={{ base: "5px", md: "10px" }}
                    />
                    <Avatar.Image src={OppsiteUserPic} />
                  </Avatar.Root>
                  <Text fontSize={{ base: "xs", md: "sm" }}>
                    {/* Group info... */}
                    {seeMembers ? <RxHamburgerMenu /> : `${GroupChatName} `}
                  </Text>
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="new-txt">
                      {
                        <Text fontSize={{ base: "xs", md: "sm" }}>
                          {seeMembers ? `Group Name ${GroupChatName}` : ``}
                        </Text>
                      }
                    </Menu.Item>
                    <Menu.Item value="new-file">
                      {
                        <Text fontSize={{ base: "xs", md: "sm" }}>
                          {GroupChatName
                            ? seeMembers
                              ? `Members: ${members.users?.length}`
                              : `${GroupChatName}` //vo maine same hi varibale banaya hai Global ChatPRovider me agar Group hoga to isme Grou ka naam aa zaega nahi to opposite User ka
                            : ""}
                        </Text>
                      }
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Box>

          <Box
            display={{ base: "none", md: "flex" }}
            gap="10px"
            w="fit-content"
            // mb={"2vh"}
            // backgroundColor="yellow.200"
            // ml={"2vw"}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Avatar.Root colorPalette="pink" size="xs">
              <Avatar.Fallback name="User" />
              <Avatar.Image src={OppsiteUserPic} />
            </Avatar.Root>
            <Text fontSize={{ base: "xs", md: "sm" }}>
              {seeMembers ? `Group Name  ${GroupChatName}` : ``}
            </Text>

            <Text fontSize={{ base: "xs", md: "sm" }}>
              {GroupChatName
                ? seeMembers
                  ? `Members: ${members?.users?.length}`
                  : `${GroupChatName}` //vo maine same hi varibale banaya hai Global ChatPRovider me agar Group hoga to isme Grou ka naam aa zaega nahi to opposite User ka
                : ""}
              {/* if GroupCHatName is null or not on first loading then  */}
            </Text>
          </Box>

          {seeMembers && (
            <Menu.Root
              // key={`${openDialogUser}-${seeMembers}`} // key forces selective re-render
              key={`${Remove}-${Remove}`} // key forces selective re-render
              closeOnSelect={false}
              closeOnInteractOutside={false}
              trapFocus={true}
              open={isopen}
              onOpenChange={(open) => {
                if (open.open) {
                  setIsOpen(true);
                } else {
                  setIsOpen(false);
                }
              }}
            >
              <Menu.Trigger asChild>
                <Box display="flex" alignItems="center" flexDirection="row">
                  <Button
                    variant="outline"
                    size="2xs"
                    onClick={() => {
                      setShowUserList(!showList);
                    }}
                    style={{ borderRadius: "12px" }}
                    _hover={{ backgroundColor: "whiteAlpha.400" }}
                  >
                    <Text fontSize={{ base: "xs", md: "sm" }}>
                      <FaRegEye />
                    </Text>
                  </Button>
                </Box>
              </Menu.Trigger>

              <Portal>
                <Menu.Positioner ml={{ base: "25vw", md: "0vw" }}>
                  <Menu.Content>
                    <HStack justifyContent="flex-start"></HStack>
                    <Text
                      textAlign="center"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Group Members
                    </Text>
                    <Box w={{ base: "150px", md: "250px" }}>
                      {uniqueMemberArray.map((user) => (
                        <Menu.Item
                          key={user._id}
                          value={`user-${user._id}`}
                          _hover={{
                            bg: "black.400", // ✅ disables default hover background
                            cursor: "default", // optional: remove pointer hand if not clickable
                          }}
                        >
                          <Flex
                            w={"100%"}
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Text fontSize={{ base: "8px", md: "sm" }}>
                              {user.name}
                            </Text>

                            <Box alignItems="center" display="flex">
                              <Avatar.Root
                                shape="full"
                                // size={{ base: "2xs", md: "md" }}
                                w={{ base: "20px", md: "30px" }}
                                h={{ base: "20px", md: "30px" }}
                              >
                                <Avatar.Fallback name="Random User" />
                                <Avatar.Image src={user.pic} />
                              </Avatar.Root>
                              <CloseButton
                                _hover={{
                                  bg: "blackAlpha.400",
                                }}
                                onClick={() => {
                                  // console.log("hello");
                                  setIsOpenRecent(true);
                                  // if (
                                  //   Remove === null
                                  //     ? setRemove(user._id)
                                  //     : setRemove(null)
                                  // );
                                  if (
                                    openDialogUser === null
                                      ? setopenDialogUser(user._id)
                                      : setopenDialogUser(null)
                                  );
                                }}
                              ></CloseButton>
                            </Box>
                          </Flex>
                          {/* ✅ Show dialog only for this user's ID */}
                          {openDialogUser === user._id && (
                            <Dialog.Root
                              key={user._id}
                              motionPreset="slide-in-bottom"
                              open={isOpenRecent}
                              size={{ base: "2xs", md: "lg" }}
                              placement="top"
                              onOpenChange={(open) => {
                                if (open.open) {
                                  setIsOpenRecent(true);
                                } else {
                                  setIsOpenRecent(false);
                                }
                              }}
                            >
                              {/* <Dialog.Trigger asChild>
                                <Button variant="outline">Open Dialog</Button>
                              </Dialog.Trigger> */}
                              <Portal>
                                <Dialog.Backdrop
                                  style={{ backgroundColor: "blackAlpha.900" }}
                                />
                                <Dialog.Positioner>
                                  <Dialog.Content>
                                    <Dialog.Header>
                                      <Dialog.Title>
                                        Remove from group
                                      </Dialog.Title>
                                    </Dialog.Header>
                                    <Dialog.Body>
                                      <p>
                                        Do you want to remove this person from
                                        the group
                                      </p>
                                    </Dialog.Body>
                                    <Dialog.Footer>
                                      <Dialog.ActionTrigger asChild>
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setIsOpenRecent(false);
                                            setopenDialogUser(null);
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                      </Dialog.ActionTrigger>
                                      <Button
                                        onClick={() => {
                                          // setRemove(null);
                                          GroupRemove();
                                          // setopenDialogUser(null);
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </Dialog.Footer>
                                    <Dialog.CloseTrigger asChild>
                                      <CloseButton size="sm" />
                                    </Dialog.CloseTrigger>
                                  </Dialog.Content>
                                </Dialog.Positioner>
                              </Portal>
                            </Dialog.Root>
                          )}
                        </Menu.Item>
                      ))}
                    </Box>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
        </Box>
        {/*Divider line*/}
        <Box
          style={{
            backgroundColor: "gray",
            height: "0.1px",
            width: "85vw",
            // margin: "1px 5vw",
          }}
        ></Box>
        {/* -----------------create Group------------------- */}
        <Box
          width={{ base: "64vw", md: "85vw" }}
          ml={{ base: "18vw", md: "1vw" }}
          mt="2vh"
        >
          {groupChatbtn === true && (
            <Box ml={{ base: "1vw", md: "5vw" }} style={{}}>
              <Button
                colorPalette="teal"
                variant="outline"
                size={{ base: "2xs", md: "md" }}
                onClick={() => setIsOpenGroupAdd(!IsOpenGroupAdd)}
              >
                <MdOutlineCreateNewFolder />
                <Text fontSize={{ base: "2xs", md: "md" }}>Add to Group</Text>
              </Button>
              {IsOpenGroupAdd && (
                <Combobox.Root
                  collection={c1}
                  onInputValueChange={(e) => {
                    filterc1(e.inputValue);
                    if (!e.inputValue) {
                      console.log("Input cleared — resetting selection");
                      setSelect(null); // ✅ guaranteed to trigger a React re-render
                    }
                  }}
                  // onInputValueChange={(e) => setInputValue(e.inputValue)}
                  onValueChange={(e) => {
                    console.log("e.value", e.value);
                    if (e.value.length === 0) setSelect(null);
                    if (e.value.length > 0) {
                      //kyuki e.value  array ki form me dal raha hai chahe humne usestate me "" ya null rakho ho tabhi bhi asa hi check kerna hoga yaha
                      console.log("inide e.value", e.value);
                      setSelect(e.value); // works for both click and Enter
                    }
                  }}
                  width="220px"
                  // onOpenChange={(open) => {
                  //   console.log("Combobox open state changed");
                  // }}
                >
                  {/* <Combobox.Label>Select framework</Combobox.Label> */}
                  <Combobox.Control>
                    <Combobox.Input
                      placeholder="Your contacts"
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") setSelect(null);
                      }}
                    />
                    <Combobox.IndicatorGroup>
                      <Combobox.ClearTrigger
                        onClick={() => {
                          // console.log("Clear Trigger Clicked ");
                          setSelect("");
                        }}
                      />
                      <Combobox.Trigger />
                    </Combobox.IndicatorGroup>
                  </Combobox.Control>
                  <Portal>
                    <Combobox.Positioner>
                      <Combobox.Content>
                        <Combobox.Empty>No items found</Combobox.Empty>
                        {c1.items.map((item) => (
                          <Combobox.Item
                            item={item}
                            key={item.value}
                            // onClick={() => setSelect(item.label)} Onvalue change ker defa mouse and keyboard kaa kaam
                          >
                            {item.label}
                            {/* <Combobox.ItemIndicator /> */}
                          </Combobox.Item>
                        ))}
                      </Combobox.Content>
                    </Combobox.Positioner>
                  </Portal>
                </Combobox.Root>
              )}
              {IsOpenGroupAdd && (
                <Button
                  colorPalette="teal"
                  variant="solid"
                  size={{ base: "2xs", md: "sm" }}
                  // mx={{ base: "10px", md: "0" }}
                  onClick={() => AddToGroup()}
                  disabled={select === null}
                  opacity={select === null ? 0.5 : 1}
                  cursor={select === null ? "not-allowed" : "pointer"}
                >
                  <IoMdCheckmark />{" "}
                  <Text fontSize={{ base: "xs", md: "md" }}>Add</Text>
                </Button>
              )}
            </Box>
          )}
        </Box>
        <Flex
          w={{ base: "100vw", md: "72vw" }}
          flexDirection="column"
          px={{ base: "4vw", md: "1px" }}
          justifyContent="center"
          // bg="red.900"
        >
          {/*   <Textarea
            ref={textareaRef2}
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            resize="none"
            border="2px solid white"
            size="xs"
            placeholder="XSmall size"
            maxW="250px"
            maxH="50px"
            overflow="hidden"
          />

          <Textarea
            ref={textareaRef1}
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            placeholder="Type here..."
            resize="none" // disables manual drag resize
            overflow="hidden"
            minH="30px"
            maxH="200px"
            w="300px"
            border="1px solid"
            borderColor="gray.300"
          /> */}

          {/* <Box
            ml={{ base: "40vw", md: "20vw" }}
            bg="red"
            display="flex"
            flexDirection="column"
            gap={{base:"5px",md:"15px"}}
          > */}

          {messages.map((msg, index) => {
            const isSelf = user.loggedinuser._id === msg.sender._id;
            // console.log(
            //   msg.readBy[0]?.user !== user.loggedinuser._id &&
            //     msg.readBy[0]?.seenAt !== null,
            //   "msg.readBy[0]?.user = ",
            //   msg.readBy[0]?.user,
            //   "msg.readBy[0]?.seenAt = ",
            //   msg.readBy[0]?.seenAt
            // );

            let read = false;
            let seenAt = null;
            let deliveredAt = null;
            if (msg.chat.isGroupChat) {
              // console.log("msg.readBy = ", msg.readBy);
              read = msg.readBy.some((r) => {
                if (user.loggedinuser._id !== r.user && r.seenAt === null)
                  return false;
              });
            } else if (msg.chat.isGroupChat === false) {
              read =
                msg.readBy[0]?.user !== user.loggedinuser._id &&
                msg.readBy[0]?.seenAt !== null
                  ? true
                  : false;
              seenAt = msg.readBy[0].seenAt;
              deliveredAt = msg.readBy[0].deliveredAt;
              // if (read) {
              //   setMessageSeenAtTime(msg.readBy[0].seenAt);
              // }
            }
            // console.log("read = ", read);
            // console.log(OppsiteUserId, "oppsiteUserId");
            // console.log(msg.readBy[index].user, "msg.readBy.user");
            // const otherRead = OppsiteUserId
            //   ? msg.readBy.find(
            //       (reader) =>
            //         reader.user?.toString() === OppsiteUserId.toString()
            //     )
            //   : null;

            // return (
            //   <Box
            //     // key={msg._id}
            //     key={`${msg._id}-${index}`}
            //     w="100%"
            //     display="flex"
            //     flexDirection="column"
            //     alignItems={isSelf ? "flex-end" : "flex-start"}
            //     mb="10px"
            //   >
            //     {/* taki pic or message,sendername row direction me aa sake */}
            //     <Box
            //       display="flex"
            //       flexDirection={isSelf ? "row-reverse" : "row"}
            //       gap={{ base: "5px", md: "20px" }}
            //     >
            //       <Avatar.Root
            //         colorPalette="pink"
            //         // size="2xs"
            //         w={{ base: "16px", md: "40px" }}
            //         h={{ base: "16px", md: "40px" }}
            //       >
            //         <Avatar.Fallback
            //           name="User"
            //           fontSize={{ base: "5px", md: "10px" }}
            //         />
            //         <Avatar.Image src={msg.sender.pic} />
            //       </Avatar.Root>
            //       <Box
            //         maxW={{ base: "60%", md: "100%" }}
            //         p="8px 12px"
            //         borderRadius="10px"
            //         bg={isSelf ? "teal.700" : "#144D37"}
            //         color="white"
            //       >
            //         {/* // Message sender name */}
            //         <Text
            //           fontSize={{ base: "8px", md: "12px" }}
            //           fontWeight="bold"
            //           color="teal.300"
            //           mb="2px"
            //         >
            //           {msg.sender.name}
            //         </Text>

            //         {/* All messages */}
            //         <Text fontSize={{ base: "10px", md: "15px" }}>
            //           {msg.content}
            //         </Text>
            //         {isSelf && (
            //           <Box justifyContent="flex-end" display="flex">
            //             <IoCheckmarkDoneOutline
            //               color={read === true ? "#1DA1F2" : "white"}
            //             />
            //           </Box>
            //         )}
            //       </Box>
            //     </Box>
            //     {/* message time */}
            //     <Text
            //       color="gray.300"
            //       fontSize={{ base: "8px", md: "12px" }}
            //       mt="3px"
            //       // ml="40px"
            //     >
            //       {formatMessageDate(msg.createdAt)}
            //     </Text>
            //   </Box>
            // );

            return (
              <MessageItem
                key={`${msg._id}-${index}`}
                msg={msg}
                isSelf={isSelf}
                read={read}
                setEditMessage={setEditMessage}
                setCommentTextArea={setCommentTextArea}
                setDialogOpen={setDialogOpen}
                dialogOpen={dialogOpen}
                deleteMessageId={deleteMessageId}
                seenAt={seenAt}
                deliveredAt={deliveredAt}
                setDeleteMessageId={setDeleteMessageId}
                // messageSeenAtTime={messageSeenAtTime}
              />
            );
          })}
        </Flex>
        {/* Typing indiactor */}
        <Box
          w={{ base: "100%", md: "100%" }}
          // ml="-5px"
          // justifySelf="flex-start"
          // bg="red.100"

          // bg="red.300"
          display="flex"
          flexDirection="column"
          alignItems="flex-start" // aligns messages right or left
          mb={{ base: "0.1px", md: "10px" }} // spacing between messages
        >
          {startTyping ? (
            // <Textarea
            //   // bg="red.300"
            //   bg="#144D37"
            //   color="#5EEAD4"
            //   // data-time={msg.createdAt}
            //   // key={`${msg._id}-time`}
            //   // ref={(el) => {
            //   //   if (!textareaRefs.current[msg._id])
            //   //     textareaRefs.current[msg._id] = {};
            //   //   textareaRefs.current[msg._id].time = el;
            //   // }}
            //   value={"Typing..."}
            //   fontSize={{ base: "8px", md: "20px" }}
            //   maxW={{ base: "80px", md: "130px" }}
            //   // maxH={{ base: "20px", md: "20px" }}
            //   // h={{ base: "36px", md: "45px" }}
            //   // onChange={() => handletimeChange(msg._id, msg.createdAt)}
            //   resize="none" // prevent manual resize
            //   overflow="hidden" // hide scrollbars
            //   _focus={{
            //     boxShadow: "none", // remove default Chakra focus shadow
            //     borderColor: "transparent", // remove focus border
            //     border: "none",
            //   }}
            // ></Textarea>
            <Box ml="50px">
              {" "}
              {/* ← apply margin here in box because <Threedots/> are rendered inside svg so no margin directly affect it */}
              <ThreeDots
                height="40"
                width="40"
                radius="9"
                color="#5EEAD4"
                ariaLabel="three-dots-loading"
                visible={true}
              />
            </Box>
          ) : null}
        </Box>
        {commentTextArea && (
          <Box
            display="flex"
            bg="black"
            opacity="0.5"
            h="990vh"
            w="100vw"
            position="fixed"
            top="0"
            left="0"
            zIndex="900"
          />
        )}
        {/*
        Read it Please then you got to know that why close button is write before beacasue even the smallest zIndex of it 
        if you pleaced it aat last so it rendered last and covers all the window despite of being a lowsest zIndex value
        ✅ Correct Structure (THIS FIXES EVERYTHING)
✅ Always render the overlay FIRST
✅ Then render close button + textarea ABOVE it */}
        {commentTextArea === false && (
          <Flex
            // bg="red.300"
            top="89vh"
            position="fixed"
            // mb="10px"

            // zIndex="1000"
            gap="10px"
            // w="50%"
            justifyContent="center"
            flexDirection="row"
            alignItems="center"
          >
            <Stack w="100%">
              <Textarea
                ref={SendMEssageRef}
                variant="outline"
                // height="45px"
                // minH="20px"
                ml="10px"
                value={sendMessage.content} // ✅ controlled input
                placeholder="Write a message"
                _placeholder={{
                  // padding: "2px 10px",
                  fontSize: { base: "8px", md: "14px" }, // responsive placeholder size
                  color: "gray.400", // optional
                }}
                size="lg"
                onChange={(e) => handleChangeMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    console.log("escape");
                    setCommentTextArea(false);
                  }
                }}
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
            </Stack>
            <Button
              colorPalette="teal"
              variant="outline"
              size={{ base: "2xs", md: "md" }}
              onClick={() => sendMessagefun()}
            >
              <IoSend />
            </Button>
          </Flex>
        )}
        {commentTextArea === true && (
          <Box
            display="flex"
            // ref={editmessagecloseButton} //Iski zarrurat ni hai vise niche commentETxtArea se hi ye kaam hoga
            w="10vw"
            h="10vh"
            top={{ md: "78vh", base: "84vh" }}
            sx={{
              left: { md: "30vw", base: "30vw" },
            }}
            position="fixed"
            zIndex="1100"
            // bg="red.100"
          >
            {" "}
            <IoIosClose
              onClick={() => {
                console.log("CLik wo");
                setCommentTextArea((prev) => !prev);
              }}
              size="50px"
            />
          </Box>
        )}
        {commentTextArea === true && (
          <Flex
            // bg="red.300"
            top="89vh"
            position="fixed"
            ml="10px"
            // mb="10px"

            zIndex="1100"
            gap="10px"
            // w="50%"
            justifyContent="center"
            flexDirection="row"
            alignItems="center"
          >
            <Stack w="100%">
              <Textarea
                ref={SendMEssageRef}
                variant="outline"
                // height="45px"
                // minH="20px"
                ml="10px"
                value={editMessage.content} // ✅ controlled input
                placeholder="Edit the message"
                _placeholder={{
                  // padding: "2px 10px",
                  fontSize: { base: "8px", md: "14px" }, // responsive placeholder size
                  color: "gray.400", // optional
                }}
                size="lg"
                onChange={(e) => handleEditMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.esc === "Enter" && !e.shiftKey) {
                    setCommentTextArea(false);
                  }
                }}
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
            </Stack>
            <Button
              colorPalette="teal"
              variant="outline"
              size={{ base: "2xs", md: "md" }}
              onClick={() => EditMessagefun()}
            >
              <IoSend />
            </Button>
          </Flex>
        )}
      </Box>
    </div>
  );
};

// export default Chatspage;
export default memo(Chatspage);
