import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../Css/TripMap.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const ROUTE_SOURCE_ID = "trip-route";

const MARKER_COLORS = {
    origin: "#12B76A",
    destination: "#F97316",
    hotel: "#7A5AF8",
    itinerary: "#F97316",
    nearby: "#EA580C"
};

function TripMap({
    places = [],
    route = null,
    height = 420,
    focusPlace = null
}) {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const markersRef = useRef([]);
    const [mapReady, setMapReady] = useState(false);

    const validPlaces = places.filter(
        (place) =>
            place &&
            place.latitude !== undefined &&
            place.longitude !== undefined &&
            !Number.isNaN(Number(place.latitude)) &&
            !Number.isNaN(Number(place.longitude))
    );

    // ============================================
    // CREATE MAP
    // ============================================

    useEffect(() => {

        if (!mapContainer.current) return;
        if (map.current) return;
        if (validPlaces.length === 0) return;

        map.current = new mapboxgl.Map({

            container: mapContainer.current,

            style: "mapbox://styles/mapbox/streets-v12",

            center: [
                Number(validPlaces[0].longitude),
                Number(validPlaces[0].latitude)
            ],

            zoom: 10

        });

        map.current.addControl(
            new mapboxgl.NavigationControl(),
            "top-right"
        );

        map.current.on(
            "load",
            () => setMapReady(true)
        );

        return () => {

            if (map.current) {

                map.current.remove();
                map.current = null;

            }

        };

    }, [validPlaces.length > 0]);

    // ============================================
    // MARKERS + ROUTE + FOCUS
    // ============================================

    useEffect(() => {

        if (!map.current || !mapReady) return;

        // Remove old markers

        markersRef.current.forEach(
            (marker) => marker.remove()
        );

        markersRef.current = [];

        // Add markers

        validPlaces.forEach((place) => {

            const color =
                MARKER_COLORS[place.markerType] ||
                MARKER_COLORS.itinerary;

            const popup = new mapboxgl.Popup({
                offset: 25
            }).setHTML(`
                <div>
                    <h3>${place.name}</h3>
                </div>
            `);

            const marker = new mapboxgl.Marker({
                color
            })
                .setLngLat([
                    Number(place.longitude),
                    Number(place.latitude)
                ])
                .setPopup(popup)
                .addTo(map.current);

            markersRef.current.push(marker);

        });

        // ============================================
        // ROUTE
        // ============================================

        const routeGeoJSON = route?.coordinates
            ? {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: route.coordinates
                }
            }
            : {
                type: "FeatureCollection",
                features: []
            };

        if (map.current.getSource(ROUTE_SOURCE_ID)) {

            map.current
                .getSource(ROUTE_SOURCE_ID)
                .setData(routeGeoJSON);

        } else {

            map.current.addSource(
                ROUTE_SOURCE_ID,
                {
                    type: "geojson",
                    data: routeGeoJSON
                }
            );

            map.current.addLayer({

                id: ROUTE_SOURCE_ID,

                type: "line",

                source: ROUTE_SOURCE_ID,

                layout: {
                    "line-join": "round",
                    "line-cap": "round"
                },

                paint: {
                    "line-color": "#F97316",
                    "line-width": 4,
                    "line-opacity": 0.75,
                    "line-dasharray": [0.3, 1.6]
                }

            });

        }

        // ============================================
        // FIT ALL PLACES
        // ============================================

        const bounds = new mapboxgl.LngLatBounds();

        validPlaces.forEach((place) => {

            bounds.extend([
                Number(place.longitude),
                Number(place.latitude)
            ]);

        });

        if (route?.coordinates) {

            route.coordinates.forEach(
                (coord) => bounds.extend(coord)
            );

        }

        if (!bounds.isEmpty()) {

            map.current.fitBounds(
                bounds,
                {
                    padding: 80,
                    maxZoom: 12
                }
            );

        }

        // ============================================
        // FOCUS SELECTED PLACE
        // ============================================

        if (
            focusPlace &&
            focusPlace.latitude !== undefined &&
            focusPlace.longitude !== undefined
        ) {

            const lng =
                Number(focusPlace.longitude);

            const lat =
                Number(focusPlace.latitude);

            if (
                Number.isFinite(lng) &&
                Number.isFinite(lat)
            ) {

                map.current.flyTo({

                    center: [lng, lat],

                    zoom: 14,

                    essential: true

                });

                // Automatically open popup

                const selectedMarker =
                    markersRef.current.find(
                        (marker) => {

                            const lngLat =
                                marker.getLngLat();

                            return (
                                Math.abs(
                                    lngLat.lng - lng
                                ) < 0.00001 &&
                                Math.abs(
                                    lngLat.lat - lat
                                ) < 0.00001
                            );

                        }
                    );

                if (selectedMarker) {

                    selectedMarker.togglePopup();

                }

            }

        }

    }, [
        mapReady,
        JSON.stringify(validPlaces),
        JSON.stringify(route),
        focusPlace
            ? `${focusPlace.name}-${focusPlace.latitude}-${focusPlace.longitude}`
            : null
    ]);

    if (validPlaces.length === 0) {

        return (
            <div className="trip-map-empty">
                Map unavailable for this trip right now.
            </div>
        );

    }

    return (

        <div
            ref={mapContainer}
            className="trip-map"
            style={{ height }}
        />

    );

}

export default TripMap;