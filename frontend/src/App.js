import { Route, Routes } from "react-router-dom";
import "./App.css";
// import { Button } from "@chakra-ui/react";
// import { Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Chatspage from "./pages/Chatspage";
import { Toaster } from "./components/ui/toaster";
import ChatProvider from "./context/chatProvider.js";

function App() {
  return (
    // <ChatProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/chats" element={<Chatspage />} />
        </Routes>
        <Toaster />
      </div>
  //  {/* </ChatProvider> */}
  );
}


export default App;
