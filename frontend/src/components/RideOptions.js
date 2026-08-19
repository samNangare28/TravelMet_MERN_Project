/**
 * Local ride options at the destination — separate from the
 * trip's main inter-city transport choice (train/flight/bus/
 * car), since travellers usually still need a local cab once
 * they arrive regardless of how they got there.
 *
 * Uber: uses Uber's own documented setPickup deep link
 * (m.uber.com/ul/) with real destination coordinates — no
 * API key required, opens the Uber app or falls back to web.
 *
 * Ola: Ola's deep-link params require affiliate/partner
 * registration to work reliably (per their developer docs),
 * which this project doesn't have. Rather than ship a link
 * that might silently fail, this opens Ola's real site —
 * same honest-fallback approach as the redBus button.
 */
function RideOptions({ destination, center }) {

    const uberHref = center
        ? `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${center.latitude}&dropoff[longitude]=${center.longitude}&dropoff[nickname]=${encodeURIComponent(destination)}&dropoff[formatted_address]=${encodeURIComponent(destination)}`
        : null;

    return (

        <div className="ride-options-card">

            <h2>🚕 Get a Ride at {destination}</h2>

            <p>
                Book a local cab once you arrive.
            </p>

            <div className="ride-options-buttons">

                <a
                    className={
                        uberHref
                            ? "ride-btn uber-btn"
                            : "ride-btn uber-btn disabled"
                    }
                    href={uberHref || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!uberHref}
                    onClick={(e) => {
                        if (!uberHref) e.preventDefault();
                    }}
                >
                    {uberHref ? "Book on Uber →" : "Uber (loading location...)"}
                </a>

                <a
                    className="ride-btn ola-btn"
                    href="https://www.olacabs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Book on Ola →
                </a>

            </div>

        </div>

    );

}

export default RideOptions;
