import React, { useState } from "react";
import { Text, Box, Container } from "@chakra-ui/react";
import { TabsList, TabPanels, Tabs } from "@chakra-ui/react";
import { LuUser, LuFolder, LuSquareCheck } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
// import { Signup } from "../components/Authentication/Signup";
import Signup from "../components/Authentication/Signup";
import { useEffect } from "react";
import { ChatState } from "../context/chatProvider";

const Homepage = () => {
  // const setUser = ChatState();//Wronf destructure
  // const { user, setUser } = ChatState();//Coreect destructure
  const { user } = ChatState(); // ✅ only read user
  const [heightbox, setHeightheightbox] = useState("500px");
  const navigate = useNavigate();
  useEffect(() => {
    // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // setUser(userInfo);
   console.log("hompage")
    //agar user login nhi hai to hum use chat page pe route kerga to
    //or hum useEffect ki help se har baaar check kernge navigate change hone per
    if (!user) {
      //reverse logic at ChatProvider.js file
      navigate("/");
    }
  },[user]);

  return (
    // <div>Homepage</div>;
    <Container maxWidth="xl" centerContent>
      <Box color="black" bg="white">
        {/* Homepage */}
        <Text>Talk-A-Tive</Text>
      </Box>
      <Box
        color="black"
        bg="white"
        display="flex"
        padding={3}
        alignItems={"center"} //top-down se center
        justifyContent="center" //left right se center
        width="250px"
        margin={4}
        backdropBlur={"2xl"}
        borderRadius={"12px"}
      >
        {/* Homepage */}
        <Text fontSize={"2xl"} fontFamily="work sans">
          Talk-A-Tive
        </Text>
      </Box>
      <Box
        color="black"
        bg="white"
        display="flex"
        padding={3}
        alignItems={"flex-start"} //top-down se center
        justifyContent="center" //left right se center
        width="350px"
        height={heightbox}
        margin={4}
        backdropBlur={"2xl"}
        borderRadius={"12px"}
      >
        <Text fontSize={"2xl"} fontFamily="work sans">
          {/* Talk-A-Tive */}
        </Text>

        <Tabs.Root defaultValue="members">
          <Tabs.List>
            <Tabs.Trigger
              value="members"
              color="black"
              onClick={() => setHeightheightbox("500px")}
            >
              <LuUser />
              Sign-Up
            </Tabs.Trigger>
            <Tabs.Trigger
              value="projects"
              color="black"
              onClick={() => setHeightheightbox("300px")}
            >
              <LuFolder />
              Login
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="members">
            <Signup />
          </Tabs.Content>
          <Tabs.Content value="projects">
            <Login />
          </Tabs.Content>
          {/* <Tabs.Content value="tasks">
            Manage your tasks for freelancers
          </Tabs.Content> */}
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default Homepage;
