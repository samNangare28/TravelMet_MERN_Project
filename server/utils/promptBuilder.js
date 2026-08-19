function buildTripPrompt(trip) {

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    const totalDays =
        Math.ceil(
            (end - start) / (1000 * 60 * 60 * 24)
        ) + 1;


    return `

You are an expert travel planner.

You MUST return ONLY ONE valid JSON object.

DO NOT return:
- Markdown
- Code fences
- Explanations
- Comments
- Text before JSON
- Text after JSON

Generate a COMPLETE and realistic ${totalDays}-day travel itinerary.


========================
STRICT ITINERARY RULES
========================

1. Generate EXACTLY ${totalDays} days.

2. Days must be sequential:

Day 1
Day 2
Day 3
...
Day ${totalDays}

Do not skip any day.


3. Every day must contain:

- day
- title
- places


4. Every day must contain MINIMUM 2 and MAXIMUM 5 places.


5. Every place MUST be an OBJECT.

Every place object MUST contain EXACTLY these fields:

- name
- time
- activity
- duration


6. Example of a valid place:

{
    "name": "Shanti Stupa",
    "time": "09:00 AM",
    "activity": "Visit the stupa and enjoy panoramic views of Leh.",
    "duration": "1 hour"
}


7. "name" must be a REAL and SPECIFIC location.

Good examples:

"Shanti Stupa"
"Leh Palace"
"Tsemo Fort"
"Thiksey Monastery"
"Pangong Lake"
"Leh Main Market"

Bad examples:

"Local Market"
"City Center"
"Nearby Temple"
"Local Restaurant"
"Beautiful Viewpoint"


8. Places must NOT repeat anywhere in the complete itinerary.

Every location should appear only ONCE.


9. Places within the same day must be geographically close.

Do NOT make the traveller unnecessarily travel back and forth across the destination.


10. Places must be arranged in a realistic visiting sequence.

Example:

Morning:
9:00 AM

Late Morning:
11:00 AM

Afternoon:
1:00 PM

Evening:
4:00 PM

Night:
7:00 PM


11. The "time" must be realistic.

Use formats such as:

"08:00 AM"
"09:30 AM"
"11:00 AM"
"01:30 PM"
"04:00 PM"
"07:00 PM"


12. "duration" must be realistic.

Examples:

"1 hour"
"1.5 hours"
"2 hours"
"45 minutes"
"3 hours"


13. "activity" must describe WHAT the traveller should actually do at that place.

Do NOT write generic descriptions.

Bad:

"Visit the place."

Good:

"Explore the historic palace, its old royal rooms and panoramic views of Leh."


14. Do not overcrowd the day.

Consider:

- Travel time
- Visiting duration
- Meals
- Rest
- Opening hours
- Distance between places


15. If a destination has attractions that are far away, place them on separate days whenever possible.


========================
REAL-WORLD TRAVEL RULES
========================

16. The itinerary must feel like a REAL trip that a traveller could actually follow.

17. Do not include impossible combinations of places in one day.

18. Consider geographical proximity.

19. Consider realistic travel time between locations.

20. Do not schedule two places at the exact same time.

21. Leave reasonable gaps between activities.

22. Include a realistic lunch/food break when appropriate.

23. Avoid scheduling extremely long travel and multiple major attractions on the same day.

24. For families, maintain a comfortable pace.

25. For solo travellers, slightly more flexible exploration is acceptable.

26. For couples or honeymoon trips, include scenic and relaxed experiences.

27. For adventure trips, prioritize outdoor and adventure activities.

28. For cultural or historical trips, prioritize heritage, museums, temples and historical places.

29. For backpacking trips, prioritize affordable and local experiences.

30. For family trips, prioritize safe and family-friendly attractions.


========================
PERSONALIZATION
========================

Trip Type:
"${trip.tripType}"

Hotel Preference:
"${trip.hotelType}"

Transport:
"${trip.transport}"

Travellers:
${trip.travelers}


Use these details to personalize the itinerary.


Trip Type should influence the experience.

Examples:

Adventure:
- Treks
- Outdoor activities
- Scenic locations
- Adventure experiences

Family:
- Family-friendly attractions
- Comfortable pacing
- Low-fatigue activities

Couple:
- Romantic viewpoints
- Scenic experiences
- Relaxed activities

Honeymoon:
- Romantic experiences
- Scenic locations
- Premium experiences where appropriate

Backpacking:
- Budget-friendly attractions
- Local experiences
- Walking-friendly areas

Cultural:
- Heritage
- Museums
- Temples
- Historical places
- Local traditions


========================
TRANSPORT
========================

The selected transport is:

"${trip.transport}"

Use transport preference when planning the practical sequence.

Do NOT change the traveller's selected transport.

Give useful transport-related tips.


========================
HOTEL
========================

Hotel preference:

"${trip.hotelType}"

Use this only for practical recommendations and budget planning.

Do NOT invent a specific hotel unless necessary.


========================
BUDGET
========================

Total traveller budget:

₹${trip.budget}

Travellers:

${trip.travelers}

The complete estimated budget should be realistic for the destination.

Budget categories:

- hotel
- food
- transport
- activities
- total


The categories should roughly add up to the traveller's total budget.

Do NOT wildly exceed the budget.

Do NOT make the budget unrealistically low.


All budget values MUST be strings.

Example:

"₹8,000"

Use Indian comma formatting.

Examples:

"₹5,000"
"₹12,500"
"₹25,000"


========================
FOOD
========================

Recommend REAL local foods or dishes that are genuinely associated with the destination.

Examples:

"Thukpa"
"Momos"
"Chole Bhature"

Do NOT use vague suggestions such as:

"Try local food"
"Eat at local restaurants"


========================
TRAVEL TIPS
========================

Provide practical and destination-specific travel tips.

Tips should be useful for the selected:

- destination
- transport
- trip type
- hotel preference
- season when possible


Avoid generic tips such as:

"Carry water."
"Take photos."
"Enjoy your trip."


Instead provide useful information such as:

- permits
- road conditions
- local transport
- opening hours
- altitude considerations
- weather
- local customs
- booking requirements
- best visiting time
- connectivity


========================
DATE INFORMATION
========================

Destination:
${trip.destination}

Start Date:
${trip.startDate}

End Date:
${trip.endDate}

Travellers:
${trip.travelers}

Budget:
₹${trip.budget}

Transport:
${trip.transport}

Hotel:
${trip.hotelType}

Trip Type:
${trip.tripType}


========================
OUTPUT FORMAT
========================

Return EXACTLY this JSON structure.

Do NOT add any extra fields.

{
    "destination": "${trip.destination}",
    "duration": "${totalDays} Days",
    "days": [
        {
            "day": 1,
            "title": "Short specific theme for the day",
            "places": [
                {
                    "name": "Real Place Name",
                    "time": "09:00 AM",
                    "activity": "Specific activity to do at this location.",
                    "duration": "1 hour"
                },
                {
                    "name": "Another Real Place",
                    "time": "11:00 AM",
                    "activity": "Specific activity to do at this location.",
                    "duration": "1.5 hours"
                }
            ]
        }
    ],
    "budget": {
        "hotel": "₹0",
        "food": "₹0",
        "transport": "₹0",
        "activities": "₹0",
        "total": "₹0"
    },
    "foods": [
        "Real local food",
        "Another local food"
    ],
    "tips": [
        "Specific useful travel tip",
        "Another useful travel tip"
    ]
}


========================
FINAL VALIDATION
========================

Before returning the JSON, internally verify:

✓ Exactly ${totalDays} days exist.

✓ Days are numbered 1 to ${totalDays}.

✓ Every day has 2 to 5 places.

✓ Every place is an OBJECT.

✓ Every place has:
  name
  time
  activity
  duration

✓ No place is repeated.

✓ Places are geographically grouped.

✓ Places are ordered realistically.

✓ Times are realistic.

✓ Activities are specific.

✓ Duration is realistic.

✓ Budget values are strings.

✓ Budget roughly matches ₹${trip.budget}.

✓ Foods are destination-specific.

✓ Tips are practical.

✓ JSON is valid.

✓ No markdown.

✓ No comments.

✓ No additional text.

Return ONLY the JSON object.

`;

}


module.exports = {
    buildTripPrompt
};