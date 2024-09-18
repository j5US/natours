/* eslint-disable */
import "@babel/polyfill";
// import { login, logout } from "./login";
import { displayMap } from "./leaflet";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./razorPay";
import { showAlert } from "./alerts";
import { handleAuthAction, logout } from "./handleAuth";

// ALERT MESSAGE: for razorpay withour webhook
// const getQueryParam = function (name) {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get(name);
// }

// window.onload = () => {
//     const errorMessage = getQueryParam('error');
//     if (errorMessage) {
//         showAlert("error", decodeURIComponent(errorMessage));
//     }
// }


// DOM ELEMENTS
const leaflet = document.getElementById('map');
const signupForm = document.querySelector(".form--signup");
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-tour");

// VALUES

// DELEGATION
if (leaflet) {
    const locations = JSON.parse(leaflet.dataset.locations);
    displayMap(locations);
}

if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("password-confirm").value;
        handleAuthAction({name,email,password,passwordConfirm} , "signup");
        // console.log({name,email,password,passwordConfirm});
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        // login(email, password);
        handleAuthAction({email,password}, "login");
    });
}

if (logoutBtn) logoutBtn.addEventListener("click", logout);

const updatePhotoLabel = (label, fileInput) => {
    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            label.textContent = 'File selected! Choose new';
        }
    });
}

if (userDataForm) {
    updatePhotoLabel(
        document.querySelector(".label--photo"),
        document.getElementById("photo"),
    );

    userDataForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = new FormData();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const photo = document.getElementById("photo").files[0];


        form.append("name", name);
        form.append("email", email);
        form.append("photo", photo);

        updateSettings(form, "data");
    });
}
if (userPasswordForm) {
    userPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        document.querySelector(".btn--save-password").textContent = "Updating...";

        const passwordCurrent = document.getElementById("password-current").value;
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("password-confirm").value;
        await updateSettings({ passwordCurrent, password, passwordConfirm }, "password");

        document.querySelector(".btn--save-password").textContent = "Save password";
        document.getElementById("password-current").value = "";
        document.getElementById("password").value = "";
        document.getElementById("password-confirm").value = "";
    });
}

if (bookBtn) {
    bookBtn.addEventListener("click", async (e) => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        const razorpayObject = await bookTour(tourId);
        razorpayObject.open();
    });
}

const alertMessage = document.querySelector("body").dataset.alert;
if(alertMessage) showAlert("success", alertMessage);