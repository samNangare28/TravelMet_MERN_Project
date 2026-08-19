const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


// =====================================================
// GENERATE TRIP WITH AI
//
// response_format: json_object tells the model to only
// emit a JSON object, which noticeably cuts down on the
// "here's your itinerary:" preambles and stray markdown
// fences that break JSON.parse downstream. max_tokens is
// raised so longer trips (7+ days) do not get truncated
// mid-JSON, which previously produced unparseable output.
// =====================================================

const generateTripWithAI = async (prompt) => {

    const messages = [
        {
            role: "system",
            content:
                "You are a precise JSON API. You only output a single valid JSON object matching the schema you are given. Never include markdown, code fences, or explanatory text."
        },
        {
            role: "user",
            content: prompt
        }
    ];

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: "openai/gpt-oss-120b",
            temperature: 0.6,
            max_tokens: 4096,
            response_format: { type: "json_object" }
        });

        return chatCompletion.choices[0].message.content;
    }
    catch (error) {
        console.log("Groq Error (json_object mode) :", error.message || error);

        // Some models/accounts may reject response_format —
        // fall back to a plain completion rather than failing
        // the whole trip generation outright. The prompt
        // itself still enforces JSON-only output.
        try {
            const fallback = await groq.chat.completions.create({
                messages,
                model: "openai/gpt-oss-120b",
                temperature: 0.6,
                max_tokens: 4096
            });

            return fallback.choices[0].message.content;
        }
        catch (fallbackError) {
            console.log("Groq Error (fallback) :", fallbackError);
            throw fallbackError;
        }
    }
};

module.exports = {
    generateTripWithAI
};
