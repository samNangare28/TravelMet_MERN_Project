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

async function sendContactMessage(data) {

    const { name, email, subject, message } = data;

    if (!process.env.BREVO_API_KEY) {
        console.log("⚠️ BREVO_API_KEY missing");
        return;
    }

    try {
        console.log("📧 Sending contact message from:", email);

        const result = await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: "TravelMet Contact Form 📬",
                email: "samnangare28@gmail.com"
            },
            to: [{ email: "samnangare28@gmail.com", name: "TravelMet Admin" }],
            replyTo: { email, name },
            subject: `📬 New Contact Message: ${subject || "No Subject"}`,
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:30px; color:#333;">
                    <h2>📬 New message from TravelMet Contact Form</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject || "N/A"}</p>
                    <hr />
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `
        });

        console.log("✅ CONTACT EMAIL SENT!", result.messageId);
        return result;

    } catch (error) {
        console.log("❌ SEND CONTACT EMAIL ERROR:", error.message);
        throw error;
    }
}

async function sendPasswordResetEmail(data) {

    const { name, email, resetLink } = data;

    if (!process.env.BREVO_API_KEY) {
        console.log("⚠️ BREVO_API_KEY missing");
        return;
    }

    try {
        console.log("📧 Sending password reset email to:", email);

        const result = await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: "TravelMet 🌍",
                email: "samnangare28@gmail.com"
            },
            to: [{ email, name }],
            subject: "🔑 Reset your TravelMet password",
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:30px; color:#333;">
                    <h1 style="text-align:center;">🔑 Reset Your Password</h1>
                    <p>Hey ${name},</p>
                    <p>We received a request to reset your TravelMet password. Click the button below to set a new one. This link is valid for 15 minutes.</p>
                    <div style="text-align:center; margin: 30px 0;">
                        <a href="${resetLink}" style="background:#F97316; color:#fff; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:bold;">
                            Reset Password
                        </a>
                    </div>
                    <p>If you didn't request this, you can safely ignore this email — your password will remain unchanged.</p>
                    <p style="color:#888; font-size:12px;">If the button doesn't work, copy and paste this link into your browser:<br>${resetLink}</p>
                </div>
            `
        });

        console.log("✅ RESET EMAIL SENT!", result.messageId);
        return result;

    } catch (error) {
        console.log("❌ SEND RESET EMAIL ERROR:", error.message);
        throw error;
    }
}
module.exports = { sendWelcomeEmail, sendContactMessage, sendPasswordResetEmail };
