const { sendContactMessage } = require("../utils/sendEmail");

const sendContact = async (req, res) => {

    try {

        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {

            return res.status(400).json({
                success: false,
                message: "Name, email and message are required"
            });

        }

        await sendContactMessage({ name, email, subject, message });

        res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });

    }

    catch (error) {

        console.log("Contact Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to send message. Please try again."
        });

    }

};

module.exports = { sendContact };