const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});

async function sendWelcomeEmail(data) {

    const { name, email } = data;

    if (!process.env.BREVO_API_KEY) {
        console.log("⚠️ BREVO_API_KEY missing");
        return;
    }

    try {
        console.log("📧 Sending welcome email to:", email);

        const result = await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: "TravelMet 🌍",
                email: "samnangare28@gmail.com"
            },
            to: [{ email, name }],
            subject: `🎒 Your TravelMet journey starts here, ${name}! 🌍✨`,
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:30px; color:#333;">
                    <h1 style="text-align:center;">🌍 Welcome to TravelMet!</h1>
                    <h2>Hey ${name}! 👋🏻</h2>
                    <p>Your journey with TravelMet officially begins now! ✨</p>
                    <p>Thank you for becoming a part of TravelMet. We're so happy to have you with us! 💙</p>
                    <p>Whether you're dreaming about your next adventure, discovering new destinations, planning the perfect trip, or simply looking for some travel inspiration — <strong>TravelMet is here to make your journey more exciting. ✈️</strong></p>
                    <p>You don't just have an account with us — <strong>you're now part of the TravelMet journey. 🌍✨</strong></p>
                    <p>Here's to new places, unforgettable memories, and many adventures ahead. ❤️</p>
                    <h2 style="text-align:center;">Happy Exploring! 🌍✈️</h2>
                    <p style="text-align:center;">With love,<br><strong>Team TravelMet 💙</strong></p>
                </div>
            `
        });

        console.log("✅ EMAIL SENT SUCCESSFULLY!", result.messageId);
        return result;

    } catch (error) {
        console.log("❌ SEND EMAIL ERROR:", error.message);
        throw error;
    }
}

module.exports = sendWelcomeEmail;