import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import TripMap from "../components/TripMap";

import "../Css/TripDetails.css";
function TripDetails() {

    console.log("✅ TripDetails Loaded");

    const { id } = useParams();

    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    // ================= FETCH TRIP =================

    useEffect(() => {

        fetchTrip();

    }, [id]);


    const fetchTrip = async () => {

        try {

            const response = await api.get(
                `/api/trips/${id}`
            );

            setTrip(response.data.trip);

        }

        catch (error) {

            console.log("❌ Fetch Trip Error:", error);

        }

        finally {

            setLoading(false);

        }

    };




    // ================= LOADING =================

    if (loading) {

        return (

            <div className="trip-loading">

                Loading Trip...

            </div>

        );

    }


    // ================= TRIP NOT FOUND =================

    if (!trip) {

        return (

            <div className="trip-loading">

                Trip Not Found

            </div>

        );

    }


    // ================= UI =================

    return (

        <div className="trip-details">

            <div className="trip-card">


                {/* BACK BUTTON */}

                <button

                    className="back-btn"

                    onClick={() => navigate(-1)}

                >

                    ← Back

                </button>


                {/* DESTINATION */}

                <h1>

                    📍 {trip.destination}

                </h1>


                {/* TRIP INFORMATION */}

                <div className="trip-info">

                    <p>

                        📅 <strong>Date :</strong>{" "}

                        {new Date(
                            trip.startDate
                        ).toLocaleDateString()}{" "}

                        -

                        {" "}

                        {new Date(
                            trip.endDate
                        ).toLocaleDateString()}

                    </p>


                    <p>

                        👥 <strong>Travelers :</strong>{" "}

                        {trip.travelers}

                    </p>


                    <p>

                        💰 <strong>Budget :</strong>{" "}

                        {typeof trip.budget === "number"

                            ? `₹${trip.budget}`

                            : trip.budget

                        }

                    </p>


                    <p>

                        🚗 <strong>Transport :</strong>{" "}

                        {trip.transport}

                    </p>


                    <p>

                        🏨 <strong>Hotel :</strong>{" "}

                        {trip.hotelType}

                    </p>


                    <p>

                        ❤️ <strong>Trip Type :</strong>{" "}

                        {trip.tripType}

                    </p>

                </div>


                <hr />


                {/* ================= MAP ================= */}

                <h2>

                    🗺 Trip Map

                </h2>


                <TripMap
                    places={trip.itinerary.flatMap(
                        (day) => day.places
                    )}
                />


                <hr />


                {/* ================= ITINERARY ================= */}

                <h2>

                    🗺 AI Itinerary

                </h2>


                <div className="itinerary">


                    {

                        trip.itinerary &&
                        trip.itinerary.length > 0

                            ?

                            trip.itinerary.map(
                                (day, index) => (

                                    <div

                                        className="day-card"

                                        key={
                                            day._id ||
                                            index
                                        }

                                    >

                                        <h3>

                                            📅 Day{" "}
                                            {day.day}

                                        </h3>


                                        <h4>

                                            {day.title}

                                        </h4>


                                        <ul>


                                            {

                                                day.places.map(
                                                    (
                                                        place,
                                                        i
                                                    ) => (

                                                        <li
                                                            key={i}
                                                        >

                                                            📍{" "}

                                                            {place.name}

                                                        </li>

                                                    )

                                                )

                                            }


                                        </ul>


                                    </div>

                                )

                            )

                            :

                            <p>

                                No Itinerary Available.

                            </p>

                    }


                </div>


            </div>

        </div>

    );

}

export default TripDetails;
