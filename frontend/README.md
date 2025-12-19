# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


please explain this agin asa abeginer
import { Textarea, VStack } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello" },
    { id: 2, text: "How are you?" },
  ]);

  const textareaRefs = useRef({});

  const handleChange = (id, value) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, text: value } : msg))
    );
  };

  useEffect(() => {
    Object.values(textareaRefs.current).forEach((textarea) => {
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    });
  }, [messages]);

  return (
    <VStack spacing={2}>
      {messages.map((msg) => (
        <Textarea
          key={msg.id}
          ref={(el) => (textareaRefs.current[msg.id] = el)}
          value={msg.text}
          onChange={(e) => handleChange(msg.id, e.target.value)}
          resize="none"
          overflow="hidden"
          placeholder="Type a message..."
        />
      ))}
    </VStack>
  );
}

export default ChatPage;

and this part also




   {messages.map((msg) => (
            <Box key={msg._id} flexDirection="column">
              <Textarea
                data-sender={msg.sender} // custom data attribute
                // data-cid={msg.cid} // another one
                // data-name={msg.name} // and another one
                width="100%"
                // ml="20vw"
                maxW={{ base: "80px", md: "240px" }}
                // ml="65vw"
                // key={msg._id}
                // key={`${msg._id}-textarea`}
                fontSize={{ base: "8px", md: "12px" }}
                ref={(el) => {
                  if (!textareaRefs.current[msg._id])
                    textareaRefs.current[msg._id] = {};
                  textareaRefs.current[msg._id].content = el;
                }}
                value={msg.content}
                onChange={(e) => handleChange(msg._id, e.target.value)}
                resize="none"
                overflow="hidden"
                placeholder="Type a message..."
              ></Textarea>
              <Textarea
                data-time={msg.createdAt}
                // key={`${msg._id}-time`}
                ref={(el) => {
                  if (!textareaRefs.current[msg._id])
                    textareaRefs.current[msg._id] = {};
                  textareaRefs.current[msg._id].time = el;
                }}
                value={formatMessageDate(msg.createdAt)}
                fontSize={{ base: "8px", md: "12px" }}
                maxW={{ base: "80px", md: "150px" }}
                onChange={() => handletimeChange(msg._id, msg.createdAt)}
                resize="none"
                // overflow="hidden"
              ></Textarea>
            </Box>
          ))}
  useEffect(() => {
    Object.values(textareaRefs.current).forEach(({ content, time }) => {
      if (content && time) {
        //  const msgId = textarea.dataset.id;
        //  const msgCid = textarea.dataset.cid;
        //  const msgName = textarea.dataset.name;

        content.style.height = content.scrollHeight - 7 + "px"; // set to content height
        content.style.borderRadius = "8px";
        const userInfo = localStorage.getItem("userInfo");
        const parsedUser = JSON.parse(userInfo);
        const screenWidth = window.innerWidth;
        const sender = content.dataset.sender;
        const isSelf = user.loggedinuser._id === sender;

        if (isSelf) {
          if (screenWidth < 768) {
            // base screen (mobile)
            content.style.marginLeft = "60vw";
            time.style.marginLeft = "62vw";
          } else {
            // md and above
            content.style.marginLeft = "65vw";
            time.style.marginLeft = "66vw";
          }
        } else {
          if (screenWidth < 768) {
            content.style.marginLeft = "20vw";
            time.style.marginLeft = "18vw";
          }
          //md above
          else {
            content.style.marginLeft = "1vw";
            time.style.marginLeft = "50px";
          }
        }
      }
    });
  }, [messages, windowWidth]); //messages need to be reoload when viewport(screen changes)
i am setting everthin by using margin left but i made that <Box> flexbox so how can is et using alignitems and fother flexproperties instead of marginLeft























{messages.map((msg) => {
  const isSelf = user.loggedinuser._id === msg.sender;
  return (
    <Box
      key={msg._id}
      display="flex"
      flexDirection="column"
      alignItems={isSelf ? "flex-end" : "flex-start"} // align messages right/left
      mb={2} // spacing between messages
    >
      <Textarea
        data-sender={msg.sender}
        width="100%"
        maxW={{ base: "80px", md: "240px" }}
        fontSize={{ base: "8px", md: "12px" }}
        ref={(el) => {
          if (!textareaRefs.current[msg._id]) textareaRefs.current[msg._id] = {};
          textareaRefs.current[msg._id].content = el;
        }}
        value={msg.content}
        onChange={(e) => handleChange(msg._id, e.target.value)}
        resize="none"
        overflow="hidden"
        placeholder="Type a message..."
      />
      <Textarea
        data-time={msg.createdAt}
        maxW={{ base: "80px", md: "150px" }}
        fontSize={{ base: "8px", md: "12px" }}
        ref={(el) => {
          if (!textareaRefs.current[msg._id]) textareaRefs.current[msg._id] = {};
          textareaRefs.current[msg._id].time = el;
        }}
        value={formatMessageDate(msg.createdAt)}
        resize="none"
      />
    </Box>
  );
})}




-----sam eterminall
please reomve the size option from here and let them  take on their own
{
  "name": "talk-a-tive",
  "version": "1.0.0",
  "description": "",
  "license": "ISC",
  "author": "",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "dev": "cross-env NODE_OPTIONS=--max-old-space-size=1024 nodemon server.js",
    "start": "cross-env NODE_OPTIONS=--max-old-space-size=1024 node server.js"
  },
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cloudinary": "^2.7.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "express-async-handler": "^1.2.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.18.1",
    "multer": "^2.0.2",
    "nodemon": "^3.1.10",
    "path": "^0.12.7"
  }
}

{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:5000",
  "dependencies": {
    "@chakra-ui/react": "^3.26.0",
    "@chakra-ui/select": "^2.1.2",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.8.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.11.0",
    "next-themes": "^0.4.6",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.8.2",
    "react-scripts": "5.0.1",
    "react-textarea-autosize": "^8.5.9",
    "socket.io-client": "^4.8.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
  "start": "cross-env NODE_OPTIONS=--max-old-space-size=1200 react-scripts start",
  "build": "cross-env NODE_OPTIONS=--max-old-space-size=1200 react-scripts build"
,
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "webpack-dev-server": "^4.15.2"
  }
}





0
: 
chat
: 
chatName
: 
"sender"
createdAt
: 
"2025-11-24T10:45:37.053Z"
isGroupChat
: 
false
latestMessage
: 
content
: 
"hdgg"
createdAt
: 
"2025-12-01T18:42:48.365Z"
sender
: 
name
: 
"shobhit kumar"
pic
: 
"http://res.cloudinary.com/dtwum0khh/image/upload/v1757941486/vderldr0gllvmkalszgo.png"
_id
: 
"68c80ec69ec284b785c401fe"
[[Prototype]]
: 
Object
_id
: 
"692de1a85fb78d970b8d70cd"
[[Prototype]]
: 
Object
updatedAt
: 
"2025-12-01T18:42:48.845Z"
users
: 
Array(2)
0
: 
{_id: '68c80ec69ec284b785c401fe', name: 'shobhit kumar', email: 'shobhitkumar94hwr@gmail.com', pic: 'http://res.cloudinary.com/dtwum0khh/image/upload/v1757941486/vderldr0gllvmkalszgo.png', createdAt: '2025-09-15T13:04:06.447Z', …}
1
: 
{_id: '6901e4ff7346aec62079fb9d', name: 'sawariya seth', email: 'sawariya@gmail.com', pic: 'http://res.cloudinary.com/dtwum0khh/image/upload/v1761731844/rejwtx3eakdmeyljmwrr.png', createdAt: '2025-10-29T09:57:19.828Z', …}
length
: 
2
[[Prototype]]
: 
Array(0)
_id
: 
"69243751dd642e738636b06f"
[[Prototype]]
: 
Object
content
: 
"hello"
createdAt
: 
"2025-12-01T18:43:06.009Z"
readBy
: 
[]
sender
: 
createdAt
: 
"2025-10-29T09:57:19.828Z"
email
: 
"sawariya@gmail.com"
name
: 
"sawariya seth"
pic
: 
"http://res.cloudinary.com/dtwum0khh/image/upload/v1761731844/rejwtx3eakdmeyljmwrr.png"
updatedAt
: 
"2025-11-12T11:26:02.924Z"
_id
: 
"6901e4ff7346aec62079fb9d"
[[Prototype]]
: 
Object
updatedAt
: 
"2025-12-01T18:43:06.009Z"
__v
: 
0
_id
: 
"692de1ba5fb78d970b8d7106"
[[Prototype]]
: 
Object


chatObj =  {
[0]   _id: new ObjectId('690db267a8d5b2e67e9079cd'),
[0]   chatName: 'sender',
[0]   users: [ new ObjectId('68fc6401f53671ad6ec47f70') ],
[0]   isGroupChat: false,
[0]   createdAt: 2025-11-07T08:48:39.831Z,
[0]   updatedAt: 2025-12-17T11:57:05.814Z,
[0]   __v: 0,
[0]   latestMessage: {
[0]     _id: new ObjectId('692f1a5dc39872673cf40cbc'),
[0]     content: 'fdffd',
[0]     updatedAt: 2025-12-03T19:24:09.634Z
[0]   }
[0] }