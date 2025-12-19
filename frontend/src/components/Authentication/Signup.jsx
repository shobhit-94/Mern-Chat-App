import React, { useState, useEffect } from "react";
import {
  Button,
  Field,
  FieldHelperText,
  FileUpload,
  IconButton,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import axios from "axios";

import {
  MdOutlinePassword,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { Box, Stack } from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "../ui/password-input";
import { HiUpload } from "react-icons/hi";
// import { DecorativeBox } from "../compositions/lib/decorative-box";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const matchpassword = () => {
    console.log("hello");
    return password === confirmPassword ? true : false;
  };
  const [show, setShow] = useState(true);
  // const show=()=>{

  // }
  useEffect(() => {
    matchpassword()
      ? console.log("Password Match")
      : console.log("Password do not match");
  }, [confirmPassword]);

  const toggle = () => setShow(!show);
  //Any button will not work inside a function call
  const postdetails = (pics) => {
    console.log(pics.name, "pics ");
    setLoading(true);
    if (pics) {
      setPic(pics)
      console.log("pics = ", pics);
      toaster.create({
        id: "upload-toast",
        title: `${pics.name}`,
        description: "uploading",
        type: "loading",
        // duration: 2000, // ⬅️ nahi chalta duration
        //If you don’t pass duration, Chakra uses its default (5000ms).
      });
      //   setTimeout(() => {
      //     toaster.dismiss();
      //   }, 2000);
      // }
      // or update it instead of dismissing:
      if (
        pics.type === "image/jpeg" ||
        pics.type === "image/png" ||
        pics.type === "image/jpg"
      )
      {
          setTimeout(() => {
            toaster.update("upload-toast", {
              title: "Done",
              description: "Upload complete",
              type: "success",
              // duration: 3000, nahi chalta duration
            });
          }, 2000);
      }
      else{
        setTimeout(() => {
          toaster.update("upload-toast", {
            title: "error",
            description: "Upload failed Select only jpeg,png,jpg types images",
            type: "error",
            // duration: 3000, nahi chalta duration
          });
        }, 1000);

      }

      setLoading(false);
    }
  };
  // const click = () => {
  //   const promise = new Promise((resolve) => {
  //     setTimeout(() => resolve(), 5000);
  //   });

  //   toaster.promise(promise, {
  //     success: {
  //       title: "Successfully uploaded!",
  //       description: "Looks great",
  //     },
  //     error: {
  //       title: "Upload failed",
  //       description: "Something wrong with the upload",
  //     },
  //     loading: { title: "Uploading...", description: "Please wait" },
  //   });
  // };
  const handleUpload = async () => {
    setLoading(true);
    const uploadPromise = new Promise(async (resolve, reject) => {
      if (name === undefined) {
        toaster.create({
          title: `please enter the name`,
          // description: "Please try again later.",
          type: "error",
        });
        return;
      }
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
      if (pic === undefined) {
        toaster.create({
          title: `please enter the profile picture`,
          // description: "Please try again later.",
          type: "error",
        });
        return;
      }
      if (confirmPassword !== password) {
        toaster.create({
          title: `password do not match`,
          // description: "Please try again later.",
          type: "error",
        });
      }
      if (
        pic.type === "image/jpeg" ||
        pic.type === "image/png" ||
        pic.type === "image/jpg"
      ) {
        const formData = new FormData();
        formData.append("pic", pic);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        try {
          const response = await axios.post(
            "http://localhost:5000/api/user/register",
            formData,
            {
              headers: {
                // "Content-Type": "application/json",
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(`response is ${response.data}`);
          resolve();
          setLoading(false);
        } catch (error) {
          reject();
          console.log(
            `Uploaded failed ${error.response?.data || error.message}`
          );
        }
      }
    });
    toaster.promise(uploadPromise, {
      loading: { title: "Uploading...", description: "Please wait" },
      success: {
        title: "Successfully uploaded!",
        description: "File uploaded successfuly",
      },
      error: {
        title: "Upload failed",
        description: "Something wrong with the upload",
      },
    });
  };
  return (
    <Stack backgroundColor={""} alignItems="center" justifyContent={"center"}>
      <Field.Root gap="2">
        <Box backgroundColor={""} width="300px">
          <Field.Label>Name</Field.Label>
          <Input
            placeholder="Enter your Name"
            // isRequired
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Box>
        <Box backgroundColor={""} width="300px">
          <Field.Label>Email</Field.Label>
          <Input
            placeholder="Enter your email"
            // isRequired
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <FieldHelperText>We'll never share your email.</FieldHelperText>
        </Box>

        <Box backgroundColor={""} width="300px">
          <Field.Label>Password</Field.Label>
          <PasswordInput
            placeholder="Enter your password"
            // isRequired
            onChange={(e) => {
              setPassword(e.target.value);
              // matchpassword();
            }}
          />
          {/* <Field.ErrorText>Password must be at least 8 characters long.</Field.ErrorText> */}
        </Box>

        <Box backgroundColor={""} width="300px">
          <Field.Label>Confirm Password</Field.Label>
          <PasswordInput
            placeholder="Enter your password"
            // isRequired
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </Box>
        <Box backgroundColor={""} width="300px">
          <Field.Label>Upload Profile photo</Field.Label>
          {/* Hidden file input */}
          <input
            id="profile-photo"
            type="file"
            accept="image/*" //all phots
            style={{ display: "none" }}
            onChange={(e) => {
              // const file = e.target.files?.[0];
              // setPic(file);
              // console.log("Selected file:", pic);
              postdetails(e.target.files[0]);
            }}
          />
          <Button
            as="label"
            htmlFor="profile-photo"
            variant="outline"
            size="sm"
            color="black"
            _hover={{
              bg: "gray.200", // Background color on hover
              color: "black", // Text color on hover
              transform: "scale(1.05)", // Slightly enlarge the button
            }}
          >
            <HiUpload /> Upload file
          </Button>
        </Box>
        {/* <Button
          variant="outline"
          size="sm"
          color="black"
          _hover={{
            bg: "red",
            color: "white",
            transform: "scale(1.05)",
          }}
          transition="transform 150ms, background-color 150ms"
        >
          Upload file
        </Button> */}
        {/* <PasswordStrengthMeter password={password} /> */}
        {/* <Box>{matchpassword()}</Box> */}
        {/* {error && <Box color="red">{error}</Box>} */}
        <Button
          variant="solid"
          bg="skyblue"
          mt="20px"
          onClick={handleUpload}
          isLoading={loading}
        >
          Upload and Sign Up
        </Button>
      </Field.Root>
    </Stack>
  );
};

export default Signup;
