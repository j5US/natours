/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts"

// type is either "password" or "data"
export const updateSettings = async (data, type) => {
    try {
        // const url = type === "password"
        //     ? "http://localhost:3000/api/v1/users/updateMyPassword"
        //     : "http://localhost:3000/api/v1/users/updateMe";
        const url = type === "password"
            ? "/api/v1/users/updateMyPassword"
            : "/api/v1/users/updateMe";

        const res = await axios({
            method: "PATCH",
            url,
            data,
        });

        if (res.data.status === "success") {
            showAlert("success", "Data updated successfully!");
            window.setTimeout(() => {
                // location.assign("/");
                location.reload(true)
            }, 500);
        }

        // console.log(res);
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
    // console.log(name, email);
};