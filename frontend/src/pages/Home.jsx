import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("myfitLoggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("myfitLoggedIn");
    localStorage.removeItem("myfitUser");
    navigate("/login");
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <a href="/" className="logo">MYFIT</a>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/collection">Products</a>
          <a href="/services">Services</a>
          <a href="/about">About Us</a>
          <a href="/testimonials">Testimonials</a>
        </div>

        <div className="nav-buttons">
          {isLoggedIn ? (
            <>
              <a href="/dashboard" className="login-btn">
                Dashboard
              </a>

              <a href="/my-bookings" className="signup-btn">
                My Bookings
              </a>

              <button
                type="button"
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="login-btn">
                Login
              </a>

              <a href="/signup" className="signup-btn">
                Sign Up
              </a>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-small">FASHION RENTAL PLATFORM</p>

          <h1>
            Wear More.
            <br />
            Spend Less.
            <br />
            Repeat.
          </h1>

          <p className="hero-text">
            Discover stylish outfits for every occasion without
            spending a fortune. Rent, wear and return with MyFit.
          </p>

          <div className="hero-buttons">
            <a href="/collection" className="primary-btn">
              Explore Collection
            </a>

            <a href="#how-it-works" className="secondary-btn">
              How It Works
            </a>
          </div>
        </div>

        <div className="hero-image">
          <div className="fashion-placeholder">
            <span>MYFIT</span>
            <p>Style. Rent. Repeat.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-heading">
          <p>HOW IT WORKS</p>
          <h2>Fashion made simple.</h2>
        </div>

        <div className="steps">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Explore</h3>
            <p>
              Browse our collection and find the perfect outfit
              for your occasion.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Rent</h3>
            <p>
              Select your outfit, choose your rental dates and
              place your order.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Wear &amp; Return</h3>
            <p>
              Wear your favourite look and return it after your
              rental period.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;