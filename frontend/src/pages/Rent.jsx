
import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Rent.css";

function Rent() {
  const params = new URLSearchParams(useLocation().search);
  const productId = params.get("id");
  const productName = params.get("name") || "Selected Outfit";
  const productPrice = Number(params.get("price") || 499);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isLoggedIn =
    localStorage.getItem("myfitLoggedIn") === "true";

  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleLogout = () => {
    localStorage.removeItem("myfitLoggedIn");
    localStorage.removeItem("myfitUser");
    window.location.href = "/login";
  };

  const handleRent = (e) => {
    e.preventDefault();

    const user = JSON.parse(
      localStorage.getItem("myfitUser") || "null"
    );

    if (!user || !isLoggedIn) {
      alert("Please login before renting an outfit.");
      window.location.href = "/login";
      return;
    }

    if (!productId || !Number.isFinite(Number(productId))) {
      alert("This product does not have a valid database ID.");
      return;
    }

    if (user.status === "BLOCKED") {
      alert("Your MyFit account is blocked.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select rental dates.");
      return;
    }

    if (startDate < localToday || endDate <= startDate) {
      alert("Please select valid rental and return dates.");
      return;
    }

    const transactions = JSON.parse(
      localStorage.getItem("myfitTransactions") || "[]"
    );

    const pendingDamage = transactions.some(
      (t) =>
        t.userEmail === user.email &&
        t.type === "DAMAGE" &&
        t.status === "PENDING"
    );

    if (pendingDamage) {
      alert("Please clear pending damage payments before renting.");
      return;
    }

    const rental = {
      id: Date.now(),
      productId: Number(productId),
      name: productName,
      price: productPrice,
      startDate,
      endDate,
      renterEmail: user.email,
      renterName: user.name,
    };

    const rentals = JSON.parse(
      localStorage.getItem("myfitRentals") || "[]"
    );

    rentals.push(rental);
    localStorage.setItem("myfitRentals", JSON.stringify(rentals));

    alert("Added to your rental bag!");
    window.location.href = "/bag";
  };

  return (
    <div className="rent-page">
      <nav className="rent-navbar">
        <a href="/" className="rent-logo">
          MYFIT
        </a>

        <div className="rent-nav-links">
          <a href="/">Home</a>
          <a href="/collection">Products</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/my-bookings">My Bookings</a>
          <a href="/payments">Payments</a>
        </div>

        <div className="rent-auth-links">
          {isLoggedIn ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <a href="/login">Login</a>
          )}
        </div>
      </nav>

      <section className="rent-header">
        <p>MYFIT RENTAL</p>
        <h1>Reserve your look.</h1>
        <span>
          Select your rental dates and get ready to wear it your way.
        </span>
      </section>

      <section className="rent-container">
        <div className="rent-card">
          <div className="rent-card-heading">
            <p className="rent-label">SELECTED OUTFIT</p>
            <span className="rent-step">MYFIT COLLECTION</span>
          </div>

          <div className="rent-outfit">
            <div className="rent-outfit-icon">✧</div>
            <div>
              <h2>{productName}</h2>
              <p className="rent-price">
                ₹{productPrice} <span>/ day</span>
              </p>
            </div>
          </div>

          <div className="rent-divider"></div>

          <form onSubmit={handleRent}>
            <h3>Choose your rental dates</h3>
            <p className="rent-form-description">
              Select when you want to wear your favourite look.
            </p>

            <div className="rent-date-fields">
              <div className="rent-date-group">
                <label htmlFor="startDate">Rental Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  min={localToday}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (endDate && e.target.value >= endDate) {
                      setEndDate("");
                    }
                  }}
                  required
                />
              </div>

              <div className="rent-date-group">
                <label htmlFor="endDate">Return Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  min={startDate || localToday}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="rent-submit-btn">
              Add to Rental Bag <span>→</span>
            </button>
          </form>

          <p className="rent-secure-note">
            ♡ A little love for your wardrobe, a little joy for someone else.
          </p>
        </div>

        <div className="rent-info">
          <p className="rent-label">THE MYFIT PROMISE</p>

          <h2>Wear it. Enjoy it. Return it responsibly.</h2>

          <p className="rent-info-description">
            Every outfit is checked by MyFit before it reaches
            the next renter. We take care of the cleaning and
            quality checks so you can enjoy your special moments.
          </p>

          <div className="rent-policy-list">
            <div className="rent-policy-item">
              <span>01</span>
              <div>
                <strong>Quality checked</strong>
                <p>Every item is inspected before delivery.</p>
              </div>
            </div>

            <div className="rent-policy-item">
              <span>02</span>
              <div>
                <strong>Responsible returns</strong>
                <p>Return your outfit to MyFit after your rental.</p>
              </div>
            </div>

            <div className="rent-policy-item">
              <span>03</span>
              <div>
                <strong>Care matters</strong>
                <p>Please return your outfit in the same condition.</p>
              </div>
            </div>
          </div>

          <div className="damage-note">
            <strong>Important reminder</strong>
            <p>
              Pending damage payments must be cleared before
              renting again.
            </p>
          </div>
        </div>
      </section>

      <footer className="rent-footer">
        MYFIT — Wear More. Spend Less. Repeat.
      </footer>
    </div>
  );
}

export default Rent;
