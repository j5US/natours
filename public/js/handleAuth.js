/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts"

// Define constants for API endpoints
// const API_BASE_URL = "http://localhost:3000/api/v1/users";
// used without localhost because API and frontend hosted on same server
const API_BASE_URL = "/api/v1/users";
const SUCCESS_MESSAGES = {
    signup: "Signed up successfully!",
    login: "Logged in successfully!",
};

// type is either "signup" or "login"
export const handleAuthAction = async (data, type) => {

    // Ensure the type is either "signup" or "login"
    if (type !== "signup" && type !== "login") {
        console.error("Invalid authentication type: at handleAuthAction()");
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
        const errorMessage = err.response?.data?.message || "An error occurred, Please try again!";
        showAlert("error", errorMessage);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: "GET",
            // url: "http://localhost:3000/api/v1/users/logout",
            // no need localhost: frontend and api hosted on same server
            url: "/api/v1/users/logout",
        });
        if (res.data.status === "success") location.reload(true);

    } catch (err) {
        showAlert("error", err.response.data.message);
    }
};