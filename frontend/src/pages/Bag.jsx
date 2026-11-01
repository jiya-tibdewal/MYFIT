import { useState } from "react";
import "./Bag.css";

function Bag() {
  const [rentals, setRentals] = useState(
    JSON.parse(localStorage.getItem("myfitRentals")) || []
  );

  const removeItem = (id) => {
    const updatedRentals = rentals.filter(
      (item) => item.id !== id
    );

    setRentals(updatedRentals);

    localStorage.setItem(
      "myfitRentals",
      JSON.stringify(updatedRentals)
    );
  };

  const total = rentals.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  return (
    <div className="bag-page">

      {/* Navbar */}
      <nav className="bag-navbar">

        <a href="/" className="bag-logo">
          MYFIT
        </a>

        <div className="bag-nav-links">
          <a href="/">Home</a>
          <a href="/collection">Products</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/bag">Bag</a>
        </div>

      </nav>


      {/* Header */}
      <section className="bag-header">

        <p>MYFIT BAG</p>

        <h1>
          Your rental bag.
        </h1>

        <span>
          Review your selected looks before checkout.
        </span>

      </section>


      {/* Bag Content */}
      <section className="bag-container">

        {rentals.length === 0 ? (
          <div className="empty-bag">

            <h2>
              Your bag is empty.
            </h2>

            <p>
              Find something beautiful to rent from our collection.
            </p>

            <a
              href="/collection"
              className="bag-shop-btn"
            >
              Explore Collection
            </a>

          </div>
        ) : (
          <>

            <div className="bag-items">

              {rentals.map((item) => (

                <div
                  className="bag-item"
                  key={item.id}
                >

                  <div className="bag-item-info">

                    <p className="bag-category">
                      MYFIT RENTAL
                    </p>

                    <h2>
                      {item.name}
                    </h2>

                    <p>
                      Rental Date: {item.startDate}
                    </p>

                    <p>
                      Return Date: {item.endDate}
                    </p>

                    <h3>
                      ₹{item.price}
                    </h3>

                  </div>


                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>


            {/* Summary */}
            <div className="bag-summary">

              <p className="summary-label">
                RENTAL SUMMARY
              </p>

              <div className="summary-row">
                <span>
                  Items
                </span>

                <span>
                  {rentals.length}
                </span>
              </div>

              <div className="summary-row total-row">
                <span>
                  Total
                </span>

                <strong>
                  ₹{total}
                </strong>
              </div>

              <a
                href="/checkout"
                className="checkout-btn"
              >
                Proceed to Checkout
              </a>

            </div>

          </>
        )}

      </section>

    </div>
  );
}

export default Bag;