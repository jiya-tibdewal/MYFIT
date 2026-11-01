import { useEffect, useState } from "react";
import "./MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("myfitUser") || "null"
  );

  const isLoggedIn =
    localStorage.getItem("myfitLoggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("myfitLoggedIn");
    localStorage.removeItem("myfitUser");
    window.location.href = "/login";
  };

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      if (!user?.id || !isLoggedIn) {
        setError("Please log in again to view your bookings.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/bookings/user/${encodeURIComponent(user.id)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load bookings."
          );
        }

        if (active) {
          setBookings(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Could not connect to the backend."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      active = false;
    };
  }, [user?.id, isLoggedIn]);

  return (
    <div className="my-bookings-page">
      <nav className="my-bookings-navbar">
        <a href="/" className="my-bookings-logo">
          MYFIT
        </a>

        <div className="my-bookings-links">
          <a href="/">Home</a>
          <a href="/collection">Products</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/my-bookings">My Bookings</a>
          <a href="/payments">Payments</a>
        </div>

        <div className="my-bookings-auth">
          {isLoggedIn ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <a href="/login">Login</a>
          )}
        </div>
      </nav>

      <header className="my-bookings-header">
        <p>YOUR MYFIT ACCOUNT</p>
        <h1>My Bookings.</h1>
        <span>
          Your rental bookings saved in the database.
        </span>
      </header>

      <main className="my-bookings-container">
        {loading ? (
          <section className="my-bookings-empty">
            <h2>Loading bookings...</h2>
          </section>
        ) : error ? (
          <section className="my-bookings-empty">
            <h2>Bookings could not be loaded.</h2>
            <p>{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>

            {!isLoggedIn && (
              <p>
                <a href="/login">Login to view your bookings</a>
              </p>
            )}
          </section>
        ) : bookings.length === 0 ? (
          <section className="my-bookings-empty">
            <h2>No database bookings yet.</h2>
            <p>Your new confirmed rentals will appear here.</p>
            <a href="/collection">Explore Collection</a>
          </section>
        ) : (
          <>
            <div className="my-bookings-summary">
              <span>Total database bookings</span>
              <strong>{bookings.length}</strong>
            </div>

            {bookings.map((booking) => (
              <section
                className="my-booking-card"
                key={booking.bookingId}
              >
                <div className="my-booking-top">
                  <div>
                    <p className="my-booking-label">
                      BOOKING ID
                    </p>
                    <h2>MYF-{booking.bookingId}</h2>
                  </div>

                  <span className="my-booking-status">
                    {booking.status || "CONFIRMED"}
                  </span>
                </div>

                <div className="my-booking-item">
                  <div>
                    <h3>{booking.productName}</h3>
                    <p>Rental date: {booking.startDate}</p>
                    <p>Return date: {booking.endDate}</p>
                  </div>

                  <strong>
                    ₹{Number(booking.totalPrice || 0)}
                  </strong>
                </div>

                <div className="my-booking-total">
                  <span>Total rental amount</span>
                  <strong>
                    ₹{Number(booking.totalPrice || 0)}
                  </strong>
                </div>
              </section>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

export default MyBookings;