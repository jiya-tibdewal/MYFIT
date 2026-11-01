import { useState } from "react";
import "./Checkout.css";

function Checkout() {
  const rentals = JSON.parse(
    localStorage.getItem("myfitRentals") || "[]"
  );

  const user = JSON.parse(
    localStorage.getItem("myfitUser") || "null"
  );

  const isLoggedIn =
    localStorage.getItem("myfitLoggedIn") === "true";

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("myfitLoggedIn");
    localStorage.removeItem("myfitUser");
    window.location.href = "/login";
  };

  const rentalDays = (item) => {
    const start = new Date(`${item.startDate}T00:00:00`);
    const end = new Date(`${item.endDate}T00:00:00`);
    return Math.round((end - start) / 86400000);
  };

  const total = rentals.reduce(
    (sum, item) => sum + Number(item.price) * rentalDays(item),
    0
  );

  const handleOrder = async (e) => {
    e.preventDefault();

    if (!user || !user.id || !isLoggedIn) {
      alert("Please log in again before placing an order.");
      window.location.href = "/login";
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Please fill all delivery details.");
      return;
    }

    if (rentals.length === 0) {
      alert("Your rental bag is empty.");
      window.location.href = "/collection";
      return;
    }

    if (
      rentals.some(
        (item) =>
          !item.productId ||
          !item.startDate ||
          !item.endDate ||
          rentalDays(item) <= 0
      )
    ) {
      alert(
        "A rental has invalid product details or dates. Please add it again."
      );
      return;
    }

    setLoading(true);

    try {
      const savedBookings = [];

      for (const item of rentals) {
        const response = await fetch(
          "http://localhost:8080/api/bookings",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: Number(user.id),
              productId: Number(item.productId),
              startDate: item.startDate,
              endDate: item.endDate,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "A rental could not be booked."
          );
        }

        savedBookings.push(data);
      }

      const orderId = "MYF" + Date.now();

      const order = {
        id: orderId,
        userEmail: user.email,
        userName: name,
        phone,
        address,
        rentals,
        total,
        status: "CONFIRMED",
        orderDate: new Date().toLocaleDateString(),
        bookingIds: savedBookings.map(
          (booking) => booking.bookingId
        ),
      };

      const existingOrders = JSON.parse(
        localStorage.getItem("myfitOrders") || "[]"
      );

      existingOrders.push(order);
      localStorage.setItem(
        "myfitOrders",
        JSON.stringify(existingOrders)
      );

      const existingTransactions = JSON.parse(
        localStorage.getItem("myfitTransactions") || "[]"
      );

      const rentalTransactions = rentals.map((item) => ({
        id: Date.now() + Math.random(),
        userEmail: user.email,
        userName: name,
        type: "RENTAL",
        description: item.name,
        amount: Number(item.price) * rentalDays(item),
        status: "PAID",
        date: new Date().toLocaleDateString(),
        orderId,
      }));

      existingTransactions.push(...rentalTransactions);

      localStorage.setItem(
        "myfitTransactions",
        JSON.stringify(existingTransactions)
      );

      localStorage.removeItem("myfitRentals");

      alert(
        "Order confirmed successfully! Booking saved to database."
      );

      window.location.href = "/my-bookings";
    } catch (error) {
      console.error("Booking error:", error);
      alert(
        "Booking failed: " +
          error.message +
          "\nPlease check My Bookings before trying again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <nav className="checkout-navbar">
        <a href="/" className="checkout-logo">
          MYFIT
        </a>

        <div className="checkout-nav-links">
          <a href="/">Home</a>
          <a href="/collection">Products</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/my-bookings">My Bookings</a>
          <a href="/payments">Payments</a>
          <a href="/bag">Bag</a>
        </div>

        <div className="checkout-auth-links">
          {isLoggedIn ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <a href="/login">Login</a>
          )}
        </div>
      </nav>

      <section className="checkout-header">
        <p>MYFIT CHECKOUT</p>
        <h1>Complete your order.</h1>
        <span>
          Just a few details and your look is ready to go.
        </span>
      </section>

      <section className="checkout-container">
        <div className="checkout-form-box">
          <h2>Delivery Details</h2>

          <form onSubmit={handleOrder}>
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <label>Delivery Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Saving booking..." : "Place Order"}
            </button>
          </form>
        </div>

        <div className="checkout-summary">
          <p className="summary-label">ORDER SUMMARY</p>

          {rentals.length === 0 ? (
            <p>Your bag is empty.</p>
          ) : (
            rentals.map((item) => (
              <div className="checkout-item" key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    {item.startDate} → {item.endDate}
                  </p>
                  <p>{rentalDays(item)} day(s)</p>
                </div>

                <strong>
                  ₹{Number(item.price) * rentalDays(item)}
                </strong>
              </div>
            ))
          )}

          <div className="checkout-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Checkout;