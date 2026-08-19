const { buildTripPrompt } = require("../utils/promptBuilder");
const { generateTripWithAI } = require("../services/aiService");

const MAX_TRIP_DAYS = 21;

// =====================================================
// Pull a JSON object out of the model's raw text.
// Even with response_format: json_object requested, it's
// worth defending against a stray code fence or leading/
// trailing whitespace/text rather than letting JSON.parse
// throw a raw, unhelpful error straight to the client.
// =====================================================

const extractJSON = (raw) => {

    if (!raw) return null;

    let text = raw.trim();

    // Strip ```json ... ``` or ``` ... ``` wrappers if present.
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);

    if (fenceMatch) {
        text = fenceMatch[1].trim();
    }

    // Fall back to slicing from the first "{" to the last "}"
    // in case there's still stray commentary around the JSON.
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
        return null;
    }

    text = text.slice(firstBrace, lastBrace + 1);

    try {
        return JSON.parse(text);
    } catch (error) {
        return null;
    }

};

// =====================================================
// GENERATE TRIP
// POST /api/ai/generate-trip
// =====================================================

const generateTrip = async (req, res) => {

    try {

        const tripData = req.body;

        // ---------------------------------------------
        // Basic validation before spending an AI call on
        // something that can't produce a sensible trip.
        // ---------------------------------------------

        if (!tripData.destination || !tripData.destination.trim()) {
            return res.status(400).json({
                success: false,
                message: "Destination is required"
            });
        }

        if (!tripData.startDate || !tripData.endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            });
        }

        const start = new Date(tripData.startDate);
        const end = new Date(tripData.endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid start or end date"
            });
        }

        if (end < start) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date"
            });
        }

        const totalDays =
            Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (totalDays > MAX_TRIP_DAYS) {
            return res.status(400).json({
                success: false,
                message: `Trips longer than ${MAX_TRIP_DAYS} days aren't supported yet — try a shorter date range.`
            });
        }

        // Build Prompt
        const prompt = buildTripPrompt(tripData);

        // Generate AI Response
        const aiResponse = await generateTripWithAI(prompt);

        const tripJSON = extractJSON(aiResponse);

        if (!tripJSON) {
            console.log(
                "AI Trip Parse Failure — raw response:",
                aiResponse
            );

            return res.status(502).json({
                success: false,
                message:
                    "The AI planner returned an unexpected response. Please try generating the trip again."
            });
        }

        // Sanity-check the shape the frontend actually relies on
        // (see TripPreview.js) before handing it back.
        if (
            !Array.isArray(tripJSON.days) ||
            tripJSON.days.length === 0 ||
            !tripJSON.budget
        ) {
            console.log(
                "AI Trip Shape Invalid:",
                JSON.stringify(tripJSON)
            );

            return res.status(502).json({
                success: false,
                message:
                    "The AI planner returned an incomplete itinerary. Please try again."
            });
        }

        res.json({
            success: true,
            trip: tripJSON
        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    generateTrip
};
