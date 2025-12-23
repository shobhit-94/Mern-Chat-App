import React, { useState, useEffect } from "react";
import {
  Button,
  Field,
  FieldHelperText,
  IconButton,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import {
  MdOutlinePassword,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { Box, Stack } from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "../ui/password-input";
// import { DecorativeBox } from "../compositions/lib/decorative-box";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../context/chatProvider";
import API from "../../api.js"; // adjust the path if needed
const Login = () => {
  const chatState = ChatState();
  const { user, setUser } = chatState;
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    setLoading(true);

    if (email === undefined) {
      toaster.create({
        title: `please enter the email`,
        // description: "Please try again later.",
        type: "error",
      });
      return;
    }
    if (password === undefined) {
      toaster.create({
        title: `please enter the password`,
        // description: "Please try again later.",
        type: "error",
      });
      return;
    }

    console.log("email = ", email);
    console.log("api = ", API);
    console.log("password = ", password);
    try {
      const payload = {
        email,
        password,
      };
     

      const response = await axios.post(
        `https://mern-chat-app2-oxfs.onrender.com/api/user/login`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setLoading(false);
      // console.log(`response is ${response}`); //Inside a template string, response is automatically converted to a string.

      if (response.status === 200) {
        console.log("response",response)
        // 🧹 Clear any existing user info first
        localStorage.removeItem("userInfo");

        console.log(
          "localStorage after remove:",
          localStorage.getItem("userInfo")
        ); // should log null

        // 🧠 Store new user info
        const userdata = JSON.stringify(response.data);
        localStorage.setItem("userInfo", userdata);
        localStorage.setItem("token", response.data.user);


        console.log(
          "localStorage after set:",
          localStorage.getItem("userInfo")
        ); // should show the new data
        setUser(null);
        toaster.create({
          title: `Login Successfull`,
          // description: "Please try again later.",
          type: "success",
          // placement: "top-end",
        });
        navigate("/chats");
      }
    } catch (error) {
      console.log("Login failed = ", error);
    }
  };
  return (
    <Stack backgroundColor={""} alignItems="center" justifyContent={"center"}>
      <Field.Root gap="1">
        <Box backgroundColor={""} width="300px">
          <Field.Label>Email</Field.Label>
          <Input
            placeholder="Enter your email"
            // isRequired
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onKeyDown={(e) => {
              e.key === "Enter" && handleUpload();
            }}
          />
          <FieldHelperText>We'll never share your email.</FieldHelperText>
        </Box>

        <Box backgroundColor={""} width="300px">
          <Field.Label>Password</Field.Label>
          <PasswordInput
            placeholder="Enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
              // matchpassword();
            }}
            onKeyDown={(e) => {
              e.key === "Enter" && handleUpload();
            }}
          />
          {/* <Field.ErrorText>Password must be at least 8 characters long.</Field.ErrorText> */}
        </Box>

        <Button
          variant="solid"
          bg="skyblue"
          mt="20px"
          onClick={handleUpload}
          isLoading={loading}
        >
          Login
        </Button>
      </Field.Root>
    </Stack>
  );
};

export default Login;
