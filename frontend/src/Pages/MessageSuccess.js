import { Link } from "react-router-dom";

import "../Css/MessageSuccess.css";

function MessageSuccess(){

    return(

        <div className="success-page">

            <img

                src="https://cdn-icons-png.flaticon.com/512/5610/5610944.png"

                alt="Success"

            />

            <h1>

                🎉 Message Sent Successfully!

            </h1>

            <p>

                Thank you for contacting TravelMet.

                We've received your message and will get back to you as soon as possible.

            </p>

            <Link to="/">

                <button>

                    🏠 Back To Home

                </button>

            </Link>

        </div>

    );

}

export default MessageSuccess;