import { useState, useEffect } from "react";
import api from "../api/axios";
import "../Css/NearbyPlaces.css";

const HOTEL_RADIUS_KM = 50;
const HOTELS_PER_PAGE = 5;

function HotelRecommendations({
    destination,
    startDate,
    endDate,
    travelers,
    onViewOnMap
}) {

    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Current pagination page
    const [currentPage, setCurrentPage] = useState(1);


    // =====================================================
    // FETCH HOTELS
    // =====================================================

    useEffect(() => {

        if (!destination) return;

        const fetchHotels = async () => {

            try {

                setLoading(true);
                setError("");

                // Reset pagination whenever destination changes
                setCurrentPage(1);

                const response = await api.get(
                    "/api/places/nearby",
                    {
                        params: {
                            destination,
                            category: "hotels",
                            radius: HOTEL_RADIUS_KM
                        }
                    }
                );


                if (response.data.success) {

                    setHotels(
                        response.data.places || []
                    );

                } else {

                    setHotels([]);

                    setError(
                        response.data.message ||
                        "Hotel information is currently unavailable."
                    );

                }

            } catch (err) {

                console.log(
                    "Hotels Fetch Error:",
                    err
                );

                setHotels([]);

                setError(
                    "Hotel information is currently unavailable."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchHotels();

    }, [destination]);


    // =====================================================
    // AIRBNB LINK
    // =====================================================

    const airbnbHref = destination
        ? `https://www.airbnb.co.in/s/${encodeURIComponent(destination)}/homes` +
          (
              startDate && endDate
                  ? `?checkin=${encodeURIComponent(startDate)}&checkout=${encodeURIComponent(endDate)}`
                  : ""
          ) +
          (
              travelers
                  ? `${startDate && endDate ? "&" : "?"}adults=${encodeURIComponent(travelers)}`
                  : ""
          )
        : null;


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.ceil(
        hotels.length / HOTELS_PER_PAGE
    );


    const startIndex =
        (currentPage - 1) *
        HOTELS_PER_PAGE;


    const visibleHotels =
        hotels.slice(
            startIndex,
            startIndex + HOTELS_PER_PAGE
        );


    const goToNextPage = () => {

        if (currentPage < totalPages) {

            setCurrentPage(
                (prev) => prev + 1
            );

        }

    };


    const goToPreviousPage = () => {

        if (currentPage > 1) {

            setCurrentPage(
                (prev) => prev - 1
            );

        }

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="nearby-places">

            <h2>🏨 Recommended Hotels</h2>


            {/* Airbnb */}

            {airbnbHref && (

                <a
                    className="airbnb-browse-btn"
                    href={airbnbHref}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    🏡 Also browse stays on Airbnb →
                </a>

            )}


            {/* Loading */}

            {loading ? (

                <p className="nearby-empty">
                    Loading hotels...
                </p>

            )


            /* Error */

            : error ? (

                <p className="nearby-empty">
                    {error}
                </p>

            )


            /* No hotels */

            : hotels.length === 0 ? (

                <p className="nearby-empty">
                    No hotels found within {HOTEL_RADIUS_KM} km.
                </p>

            )


            /* Hotels */

            : (

                <>

                    <div className="nearby-grid">

                        {visibleHotels.map(
                            (hotel, index) => (

                                <div
                                    className="nearby-card hotel-card"
                                    key={`${hotel.name}-${hotel.latitude}-${index}`}
                                >

                                    <h3>
                                        {hotel.name}
                                    </h3>


                                    {hotel.address && (

                                        <p className="nearby-address">
                                            {hotel.address}
                                        </p>

                                    )}


                                    <span className="nearby-distance">
                                        {hotel.distanceKm} km from {destination}
                                    </span>


                                    <p className="hotel-unavailable-note">
                                        Rating and price: information unavailable
                                    </p>


                                    <div className="hotel-card-actions">

                                        {/* View on shared map */}

                                        <button
                                            className="nearby-view-btn"
                                            onClick={() =>
                                                onViewOnMap?.(hotel)
                                            }
                                        >
                                            View on Map
                                        </button>


                                        {/* Google Maps */}

                                        <a
                                            className="nearby-view-btn secondary"
                                            href={`https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Hotel
                                        </a>

                                    </div>

                                </div>

                            )
                        )}

                    </div>


                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    {totalPages > 1 && (

                        <div className="hotel-pagination">

                            <button
                                className="hotel-page-btn"
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                            >
                                ← Previous
                            </button>


                            <span className="hotel-page-info">
                                Page {currentPage} of {totalPages}
                            </span>


                            <button
                                className="hotel-page-btn"
                                onClick={goToNextPage}
                                disabled={
                                    currentPage === totalPages
                                }
                            >
                                Next →
                            </button>

                        </div>

                    )}

                </>

            )}

        </div>

    );

}

export default HotelRecommendations;