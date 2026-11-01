import { useNavigate } from "react-router-dom";
import "./Services.css";

function Services() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("myfitLoggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("myfitLoggedIn");
    localStorage.removeItem("myfitUser");
    navigate("/login");
  };

  return (
    <div className="simple-page">
      <nav className="simple-navbar">
        <a href="/" className="simple-logo">MYFIT</a>

        <div>
          <a href="/">Home</a>
          <a href="/collection">Products</a>
          <a href="/services">Services</a>
          <a href="/about">About</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/my-bookings">My Bookings</a>

          {isLoggedIn ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <a href="/login">Login</a>
          )}
        </div>
      </nav>

      <section className="simple-header">
        <p>WHAT WE OFFER</p>
        <h1>Services made for your style.</h1>
        <span>
          Everything you need to discover, rent and share fashion.
        </span>
      </section>

      <section className="service-grid">
        <div className="service-card">
          <h2>Rent Outfits</h2>
          <p>
            Discover stylish outfits for parties, weddings,
            festivals and special occasions at affordable prices.
          </p>
        </div>

        <div className="service-card">
          <h2>List Your Closet</h2>
          <p>
            Upload clothes, footwear and accessories from your
            wardrobe and earn by renting them to others.
          </p>
        </div>

        <div className="service-card">
          <h2>Easy Booking</h2>
          <p>
            Select your outfit, choose rental dates and place
            your order through a simple booking process.
          </p>
        </div>

        <div className="service-card">
          <h2>Affordable Fashion</h2>
          <p>
            Enjoy designer-inspired looks without spending
            the full purchase price.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Services;