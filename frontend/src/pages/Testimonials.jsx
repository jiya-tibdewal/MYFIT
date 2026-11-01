import { useNavigate } from "react-router-dom";
import "./Testimonials.css";

function Testimonials() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("myfitLoggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("myfitLoggedIn");
    localStorage.removeItem("myfitUser");
    navigate("/login");
  };

  const testimonials = [
    {
      name: "Aarushi",
      text: "I found the perfect outfit for my college event without buying a new dress.",
    },
    {
      name: "Meera",
      text: "MyFit makes renting stylish clothes simple and affordable.",
    },
    {
      name: "Riya",
      text: "I love the idea of sharing clothes from my closet and earning from them.",
    },
  ];

  return (
    <div className="testimonials-page">
      <nav className="testimonials-navbar">
        <a href="/" className="testimonials-logo">
          MYFIT
        </a>

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

      <section className="testimonials-header">
        <p>MYFIT COMMUNITY</p>

        <h1>Loved by fashion lovers.</h1>

        <span>
          What our users say about their MyFit experience.
        </span>
      </section>

      <section className="testimonial-grid">
        {testimonials.map((item, index) => (
          <div className="testimonial-card" key={index}>
            <div className="stars">★★★★★</div>

            <p>"{item.text}"</p>

            <h3>{item.name}</h3>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Testimonials;