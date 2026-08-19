import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/TripPlanner.css";

function TripPlanner() {

    const navigate = useNavigate();

    const [trip, setTrip] = useState({

    source: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,

    budget: "Medium",

    transport: "Car",

    hotelType: "Standard",

    tripType: "Solo"

    });

    const handleChange = (e) => {

        setTrip({

            ...trip,
            [e.target.name]: e.target.value

        });

    };
const increaseTravelers = () => {

    setTrip({

        ...trip,

        travelers: trip.travelers + 1

    });

};

const decreaseTravelers = () => {

    if (trip.travelers > 1) {

        setTrip({

            ...trip,

            travelers: trip.travelers - 1

        });

    }

};

const selectOption = (field, value) => {

    setTrip({

        ...trip,

        [field]: value

    });

};
    const handleSubmit = (e) => {

        e.preventDefault();

        navigate("/trip-preview", {

            state: trip

        });

    };

    return (

        <div className="trip-page">

            <div className="trip-container">
                <h1>✈ Plan Your Dream Trip</h1>
                <p>
                    Tell us your travel preferences and let AI create
                    the perfect itinerary for your next adventure.
                </p>

                <form
                    className="trip-form"
                    onSubmit={handleSubmit}
                >

                    <div className="route-group">

                        <div className="route-field">
                            <label>🛫 From</label>
                            <input
                                type="text"
                                name="source"
                                placeholder="Departure city"
                                value={trip.source}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="route-field">
                            <label>📍 To</label>
                            <input
                                type="text"
                                name="destination"
                                placeholder="Destination"
                                value={trip.destination}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    <label>📅 Travel Dates</label>

                    <div className="date-group">
                        <input
                            type="date"
                            name="startDate"
                            value={trip.startDate}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="date" 
                            name="endDate"
                            value={trip.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label>👥 Travelers</label>

<div className="traveller-box">

    <button
        type="button"
        onClick={decreaseTravelers}
    >
        −
    </button>

    <span>

        {trip.travelers} Traveller{trip.travelers > 1 ? "s" : ""}

    </span>

    <button
        type="button"
        onClick={increaseTravelers}
    >
        +
    </button>

</div>
                    <label>💰 Budget</label>

<div className="card-options">

    <div

        className={trip.budget==="Low" ? "option-card active" : "option-card"}

        onClick={() => selectOption("budget","Low")}

    >

        ₹ Low

    </div>

    <div

        className={trip.budget==="Medium" ? "option-card active" : "option-card"}

        onClick={() => selectOption("budget","Medium")}

    >

        ₹₹ Medium

    </div>

    <div

        className={trip.budget==="Luxury" ? "option-card active" : "option-card"}

        onClick={() => selectOption("budget","Luxury")}

    >

        ₹₹₹ Luxury

    </div>

</div>
                    <label>🚗 Transport</label>

<div className="card-options">

    <div

        className={trip.transport==="Car" ? "option-card active":"option-card"}

        onClick={() => selectOption("transport","Car")}

    >

        🚗 Car

    </div>

    <div

        className={trip.transport==="Train" ? "option-card active":"option-card"}

        onClick={() => selectOption("transport","Train")}

    >

        🚆 Train

    </div>

    <div

        className={trip.transport==="Bus" ? "option-card active":"option-card"}

        onClick={() => selectOption("transport","Bus")}

    >

        🚌 Bus

    </div>

    <div

        className={trip.transport==="Flight" ? "option-card active":"option-card"}

        onClick={() => selectOption("transport","Flight")}

    >

        ✈ Flight

    </div>

</div>
                    
                    <label>🏨 Hotel</label>

<div className="card-options">

    <div

        className={trip.hotelType==="Budget" ? "option-card active":"option-card"}

        onClick={() => selectOption("hotelType","Budget")}

    >

        💸 Budget

    </div>

    <div

        className={trip.hotelType==="Standard" ? "option-card active":"option-card"}

        onClick={() => selectOption("hotelType","Standard")}

    >

        ⭐ Standard

    </div>

    <div

        className={trip.hotelType==="Luxury" ? "option-card active":"option-card"}

        onClick={() => selectOption("hotelType","Luxury")}

    >

        👑 Luxury

    </div>

</div>

                    <label>❤️ Trip Type</label>

<div className="card-options">

    <div

        className={trip.tripType==="Solo" ? "option-card active":"option-card"}

        onClick={() => selectOption("tripType","Solo")}

    >

        👤 Solo

    </div>

    <div

        className={trip.tripType==="Couple" ? "option-card active":"option-card"}

        onClick={() => selectOption("tripType","Couple")}

    >

        ❤️ Couple

    </div>

    <div

        className={trip.tripType==="Friends" ? "option-card active":"option-card"}

        onClick={() => selectOption("tripType","Friends")}

    >

        👬 Friends

    </div>

    <div

        className={trip.tripType==="Family" ? "option-card active":"option-card"}

        onClick={() => selectOption("tripType","Family")}

    >

        👨‍👩‍👧 Family

    </div>

</div>
                    <button type="submit">

                        ✨ Generate My Dream Trip

                    </button>

                </form>

            </div>

        </div>

    );

}

export default TripPlanner;