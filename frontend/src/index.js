import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "./components/ui/provider";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./context/chatProvider.js";
// import { Provider } from "./components/ui/provider.jsx";
//@ mat lagao
// ✅ Suppress ResizeObserver error globally — do this BEFORE rendering App
// window.addEventListener("error", (e) => {
//   if (
//     e.message ===
//     "ResizeObserver loop completed with undelivered notifications."
//   ) {
//     e.stopImmediatePropagation();
//   }
// });

// window.addEventListener("unhandledrejection", (e) => {
//   if (
//     e.reason?.message ===
//     "ResizeObserver loop completed with undelivered notifications."
//   ) {
//     e.preventDefault();
//   }
// });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ChatProvider>
      <Provider>
        <App />
      </Provider>
    </ChatProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
