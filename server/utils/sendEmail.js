const nodemailer = require("nodemailer");


// CREATE TRANSPORTER

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,        
    requireTLS: true,     
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    family: 4,
    connectionTimeout: 20000,   
    greetingTimeout: 20000,
    socketTimeout: 20000
});


// CHECK EMAIL CONFIGURATION

transporter.verify((error) => {

    if (error) {

        console.log(
            "❌ Email Configuration Error:",
            error.message
        );

    }

    else {

        console.log(
            "✅ Email Server Ready"
        );

    }

});


// SEND WELCOME EMAIL

async function sendWelcomeEmail(data) {

    const {
        name,
        email
    } = data;


    if (
        !process.env.EMAIL_USER ||
        !process.env.EMAIL_PASS
    ) {

        console.log(
            "⚠️ EMAIL_USER or EMAIL_PASS missing"
        );

        return;

    }


    try {

        console.log(
            "📧 Sending welcome email to:",
            email
        );


        const mailOptions = {

            from:
                `"TravelMet 🌍" <${process.env.EMAIL_USER}>`,

            to:
                email,

            subject:
                `🎒 Your TravelMet journey starts here, ${name}! 🌍✨`,

            html: `

                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                    color: #333;
                ">

                    <h1 style="
                        text-align:center;
                    ">
                        🌍 Welcome to TravelMet!
                    </h1>

                    <h2>
                        Hey ${name}! 👋🏻
                    </h2>

                    <p>
                        Your journey with TravelMet
                        officially begins now! ✨
                    </p>

                    <p>
                        Thank you for becoming a part
                        of TravelMet.
                        We're so happy to have you with us! 💙
                    </p>

                    <p>
                        Whether you're dreaming about
                        your next adventure, discovering
                        new destinations, planning the
                        perfect trip, or simply looking
                        for some travel inspiration —
                        <strong>
                            TravelMet is here to make
                            your journey more exciting. ✈️
                        </strong>
                    </p>

                    <p>
                        You don't just have an account
                        with us —
                        <strong>
                            you're now part of the
                            TravelMet journey. 🌍✨
                        </strong>
                    </p>

                    <p>
                        Here's to new places,
                        unforgettable memories,
                        and many adventures ahead. ❤️
                    </p>

                    <h2 style="
                        text-align:center;
                    ">
                        Happy Exploring! 🌍✈️
                    </h2>

                    <p style="
                        text-align:center;
                    ">
                        With love,<br>
                        <strong>
                            Team TravelMet 💙
                        </strong>
                    </p>

                </div>

            `
        };


        const info =
            await transporter.sendMail(
                mailOptions
            );


        console.log(
            "✅ EMAIL SENT SUCCESSFULLY!"
        );

        console.log(
            "📨 Message ID:",
            info.messageId
        );


        return info;

    }

    catch (error) {

        console.log(
            "❌ SEND EMAIL ERROR:",
            error.message
        );

        throw error;

    }

}


module.exports =
    sendWelcomeEmail;