/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

const razorPayOptions = ( order_id, order_info, price, receipt) => {
    const options = {
        key: "rzp_test_ULSuYWK6gMoS6d",
        name: order_info.name,
        description: order_info.description,
        image: "https://www.natours.dev/img/favicon.png",
        order_id,
        // callback_url: `http://localhost:3000/api/v1/bookings/booking-checkout/${receipt},${price}`,
        // callback_url: `/api/v1/bookings/booking-checkout/${receipt},${price}`,
        // callback_url: `/?alert=booking`,
        handler: function(res) {
            location.assign("/?alert=booking");
        },
        prefill: { 
            name: order_info.customer_name, 
            email: order_info.customer_email,
        },
        "theme": {
            "color": "#55c57a",
        },
    };
    return options;
};

export const bookTour = async (tourId) => {
    try {

        // 1) Get checkout session from API
        // const response = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`);
        const response = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

        // 2) Create checkout form
        const { session } = response.data;
        // console.log(session)
        const options = razorPayOptions( session.id, session.notes, session.amount, session.receipt );

        const razorpayObject = new Razorpay(options);
        razorpayObject.on('payment.failed', function (response) {
            console.log(response);
            showAlert("This step of Payment Failed");
        });
        return razorpayObject;
    } catch (err) {
        console.log(err);
        showAlert("error", err);
    }
}