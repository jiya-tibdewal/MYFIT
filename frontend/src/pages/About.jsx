import { useNavigate } from "react-router-dom";
import "./About.css";

function About() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("myfitLoggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("myfitLoggedIn");
    localStorage.removeItem("myfitUser");
    navigate("/login");
  };

  return (
    <div className="about-page">
      <nav className="about-navbar">
        <a href="/" className="about-logo">MYFIT</a>

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

      <section className="about-content">
        <p>ABOUT MYFIT</p>

        <h1>Fashion that goes further.</h1>

        <div className="about-text">
          <p>
            MYFIT is a fashion rental platform that allows
            users to rent stylish outfits at affordable prices.
          </p>

          <p>
            Users can also list unused clothes, footwear and
            accessories from their wardrobe and earn by renting
            them to other users.
          </p>

          <p>
            Our goal is to make fashion more affordable,
            accessible and sustainable by encouraging people
            to reuse clothing instead of buying something new
            for every occasion.
          </p>
        </div>

        <h2>Wear More. Spend Less. Repeat.</h2>
      </section>
    </div>
  );
}

export default About;