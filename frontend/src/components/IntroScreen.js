import { useEffect } from "react";
// import "../Css/IntroScreen.css";

function IntroScreen({ onFinish }) {

    useEffect(() => {

        const timer = setTimeout(() => {

            sessionStorage.setItem("introSeen", "true");
            onFinish();

        }, 3000);

        return () => clearTimeout(timer);

    }, [onFinish]);

    return (

        <div className="intro-container">

            <div className="intro-content">

                <img
                    src="/ai-travel.png"
                    alt="AI"
                    className="intro-image"
                />

                <h1>🙏 नमस्कार मंडळी</h1>

                <h2>Welcome to TravelMet</h2>

                <p>Your AI Travel Partner ✈️</p>

                <div className="loader"></div>

            </div>

        </div>

    );

}

export default IntroScreen;