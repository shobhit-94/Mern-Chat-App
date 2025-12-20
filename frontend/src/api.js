// frontend/src/api.js

// No need to import dotenv
const API_URL = process.env.REACT_APP_API_URL || "";
console.log("process.env.NODE_ENV = ", process.env.NODE_ENV);
const API = API_URL
  ? API_URL // use the environment variable if provided
  : process.env.NODE_ENV === "development"
  ? "http://localhost:5000" // dev backend
  : "https://mern-chat-app-ptz1.onrender.com"; // production backend

export default API;
