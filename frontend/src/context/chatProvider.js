import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  //.

  // 🔹 Why Context API?
  // Normally, if you want to share user data across many components, you’d have to pass it as props:
  /*
<App user={user} setUser={setUser} />
   <Navbar user={user} />
   <Homepage user={user} setUser={setUser} />
This becomes messy when the app grows → called prop drilling.
👉 Context API solves this by creating a global store where you can put user and setUser, and access them anywhere without passing props manually.
*/

  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();
  const [IsGroup, setIsGroup] = useState(false);
  const [members, setMembers] = useState([]);
  const [seeMembers, setseeMembers] = useState(false);
  const [person, setPerson] = useState(null);
  const [showList, setShowList] = useState(false);
  const [GroupChatName, setGroupChatName] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userdata, setUserdata] = useState([]);
  const [groupChatbtn, setGroupChatbtn] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const refresh = () => setRefreshToken((t) => t + 1);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latest_Chats, setLatest_Chats] = useState([]);
  const [isOpenRecentChats, setIsOpenRecentChats] = useState(true);
  const [message_seen_ack, setMessage_seen_ack] = useState(null);

  const [undreadTextMessage, setUndreadTextMessage] = useState(() => {
    const saved = localStorage.getItem("undreadTextMessage");

    if (!saved) return []; // no saved → start with empty array
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const unreadRef = useRef({
    content: "",
    chatId: null,
  });

  const [trigger, setTrigger] = useState(false);

  const forceUpdate = () => setTrigger((v) => !v);

  const [notification, setNotification] = useState(() => {
    const saved = localStorage.getItem("notification");
    return saved ? JSON.parse(saved) : [];
  });
  const [handleNotificationClick, setHandleNotificationClick] = useState(false);
  const [notificationCount, setNotificationCount] = useState(() => {
    const saved = localStorage.getItem("notificationCount");
    return saved ? parseInt(saved) : 0;
  });
  const [selectedID, setSelectedID] = useState(null);
  const [OppsiteUserPic, setOppsiteUserPic] = useState(null);
  const navigate = useNavigate();
  //   useEffect(() => {
  //     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  //     setUser(userInfo);
  //     console.log("ChatProvider mounted and userinfo", userInfo);

  //     //agar user login nhi hai to ahr vo ksii bhi page pe route kerga to
  //     //hum har baar usee login page pe re-direct kerte rehnge
  //     //or hum useEffect ki help se har baaar check kernge navigate change hone per

  //       },[]);
  //   }, []);
  useEffect(() => {
    if (Array.isArray(undreadTextMessage)) {
      localStorage.setItem(
        "undreadTextMessage",
        JSON.stringify(undreadTextMessage)
      );
    }
  }, [undreadTextMessage]);

  useEffect(() => {
    // console.log("Updated notification:", notification);
    localStorage.setItem("notification", JSON.stringify(notification));
  }, [notification]);

  useEffect(() => {
    // console.log("Updated notificationCount:", notificationCount);
    localStorage.setItem("notificationCount", notificationCount);
  }, [notificationCount]);

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      //  if (!userInfo) return setUser(null);
      // console.log(
      //   "localstorage inside chatprovider",
      //   userInfo
      // );
      const parsedUser = JSON.parse(userInfo);
      setUser((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(parsedUser)) return prev;
        return parsedUser;
      });
    } catch (error) {
      console.error("Error parsing user:", error);
      setUser(null);
    } finally {
      setLoading(false); // ✅ end loading
    }
  }, [user]);
  // Watch user updates
  // useEffect(() => {
  //   console.log("user updated:", user);
  // }, [user]);
  // console.log("ChatProvider render with user:");
  return (
    /*
    Here:

user = the current logged-in user
setUser = function to update user
value={{ user, setUser }} → these values are shared to the entire app
When you wrap <App /> with <ChatProvider>, all components inside can now access user and setUser.
    */
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
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
      }}
    >
      {/* {children} */}
      {/* {user !== undefined ? children : null} */}
      {loading ? null : children}
      {/* {children} */}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  //   console.log("ChatState called");
  //    console.trace("ChatState called");
  return useContext(ChatContext);
};

/*
🔹 The helper function (ChatState)

This is just a shortcut:

export const ChatState = () => {
  return useContext(ChatContext);
};
Instead of writing:
const { user, setUser } = useContext(ChatContext);
You can now just write:
const { user, setUser } = ChatState();

*/
export default ChatProvider;
