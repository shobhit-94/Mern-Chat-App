// frontend/src/api.js

// No need to import dotenv
/*const API_URL = process.env.REACT_APP_API_URL || "";
console.log("process.env.NODE_ENV = ", process.env.NODE_ENV);
const API = API_URL
  ? API_URL // use the environment variable if provided
  : process.env.NODE_ENV === "development"
  ? "https://mern-chat-app1-5utj.onrender.com" // dev backend
  : "https://mern-chat-app1-5utj.onrender.com"; // production backend

export default API;
*/


const API = 
// process.env.REACT_APP_API_URL;
  // "http://localhost:5000" // dev backend
  "https://mern-chat-app2-oxfs.onrender.com"; // production backend

export default API;
