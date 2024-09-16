/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts"

// Define constants for API endpoints
const API_BASE_URL = "http://localhost:3000/api/v1/users";
const SUCCESS_MESSAGES = {
    signup: "Signed up successfully!",
    login: "Logged in successfully!",
};

// type is either "signup" or "login"
export const handleAuthAction = async (data, type) => {

    // Ensure the type is either "signup" or "login"
    if (type !== "signup" && type !== "login") {
        console.error("Invalid authentication type. at handleAuthAction()");
        return;
    }

    const url = `${API_BASE_URL}/${type}`;
    const isSignup = type === "signup";

    try {
        // Notify the user that the request is being processed
        if (isSignup) showAlert("warn", "Your request is being processed!");
        
        // Make the API request
        const res = await axios.post(url, data);

        // Check if the request was successful
        if (res.data.status === "success") {
            showAlert("success", SUCCESS_MESSAGES[type]);
            window.setTimeout(() => {
                location.assign("/");
            }, 1000);
        }

        // console.log(res);
    } catch (err) {
        // Handle and display errors
        const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
        showAlert("error", errorMessage);
    }
};



















// /* eslint-disable */
// import axios from "axios";
// import { showAlert } from "./alerts"

// // type is either "signup" or "login"
// export const handleAuthAction = async (data, type) => {
//     try {
//         const url = type === "signup"
//             ? "http://localhost:3000/api/v1/users/signup"
//             : "http://localhost:3000/api/v1/users/login";
        
//         if (type === "signup") showAlert("warn", "Your request is being processed!");
        
//         const res = await axios({
//             method: "POST",
//             url,
//             data,
//         });


//         if (res.data.status === "success") {
//             if(type === "signup") showAlert("success", "Signed up successfully!");
//             else showAlert("success", "Logged in successfully!");
//             window.setTimeout(() => {
//                 location.assign("/");
//             }, 1000);
//         }

//         // console.log(res);
//     } catch (err) {
//         showAlert("error", err.response.data.message);
//     }
// };


