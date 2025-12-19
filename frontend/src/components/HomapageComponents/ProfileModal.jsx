import React from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { ChatState } from "../../context/chatProvider";
import { Box, Image } from "@chakra-ui/react";

// const { selectedChat, setSelectedChat, chats, user, setChats } = ChatState();

/*
What’s happening is that in Chakra UI v3 + Ark UI Dialog, the onOpenChange handler doesn’t pass a plain boolean.
Instead, it passes an event detail object like:
{ open: true }
*/
// const chatState = ChatState();
// const { user } = chatState;
const ProfileModal = ({
  isOpen,
  setIsOpen,
  text,
  username,
  userpic,
  useremail,
}) => {
  const chatState = ChatState();
  const { user, setUser } = chatState;
  //   const { isOpen, onOpen, onClose } = useDisclosure();
  // console.log(isOpen, "isOpen in profile modal");
  //   isOpen=true
  // console.log(text, "text");
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        console.log("isOpen inside profile modal = ", open);
        if (open.open) {
          setIsOpen(true); // modal opened
        } else {
          setIsOpen(false); // modal closed
        }
      }}
      size="xl"
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>My Profile</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="2xl" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              {/* Add your profile details here */}

              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems="center"
                justifyContent={"center"}
                gap="10px"
                padding="10px"
              >
                <Image
                  // height="200px"
                  src='{user.loggedinuser.pic}'
                  aspectRatio={9 / 16}
                  width="200px"
                  height="200px"
                  // objectFit="cover"
                  borderRadius="200px"
                  alt="Profile Picture"
                />
                <p>{user.loggedinuser.name}</p>
                <p>{user.loggedinuser.email}</p>
                <p>{user.loggedinuser._id}</p>
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ProfileModal;
