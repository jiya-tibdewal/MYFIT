
import { useEffect, useState } from "react";
import "./Dashboard.css";

const API_BASE_URL = "http://localhost:8080/api";

function Dashboard() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("myfitUser")) || null;
    } catch {
      return null;
    }
  });

  const [closetItems, setClosetItems] = useState([]);
  const [closetLoading, setClosetLoading] = useState(true);
  const [closetError, setClosetError] = useState("");

  const orders = JSON.parse(localStorage.getItem("myfitOrders") || "[]");
  const transactions = JSON.parse(
    localStorage.getItem("myfitTransactions") || "[]"
  );

  const isLoggedIn = localStorage.getItem("myfitLoggedIn") === "true";

  useEffect(() => {
    const loadClosetItems = async () => {
      const savedUser = JSON.parse(
        localStorage.getItem("myfitUser") || "null"
      );

      setUser(savedUser);

      const userId = Number(savedUser?.id);

      if (!userId || !Number.isFinite(userId)) {
        setClosetItems([]);
        setClosetError(
          "Please log in again to view your saved closet items."
        );
        setClosetLoading(false);
        return;
      }

      try {
        setClosetLoading(true);
        setClosetError("");

        const response = await fetch(
          `${API_BASE_URL}/closet/user/${userId}`
        );

        if (!response.ok) {
          throw new Error("Could not load closet items from the database.");
        }

        const data = await response.json();
        const items = Array.isArray(data) ? data : [];

        setClosetItems(items);

        // Keep local storage in sync with the database response.
        localStorage.setItem("myfitClosetItems", JSON.stringify(items));
      } catch (error) {
        console.error("Closet loading error:", error);

        // Show previously saved items if the backend is unavailable.
        const localItems = JSON.parse(
          localStorage.getItem("myfitClosetItems") || "[]"
        );

        setClosetItems(localItems);
        setClosetError(
          "Database se closet load nahi ho paaya. Backend check karo; neeche saved local items dikh sakte hain."
        );
      } finally {
        setClosetLoading(false);
      }
    };

    loadClosetItems();
  }, []);

  const userOrders = orders.filter(
    (order) => !user || order.userEmail === user.email
  );

  const userTransactions = transactions.filter(
    (transaction) => !user || transaction.userEmail === user.email
  );

  const pendingDamage = userTransactions.filter(
    (transaction) =>
      transaction.type === "DAMAGE" &&
      transaction.status === "PENDING"
  );

  const pendingAmount = pendingDamage.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const penaltyPoints = Number(user?.penaltyPoints || 0);

  const handleLogout = () => {
    localStorage.removeItem("myfitLoggedIn");
    localStorage.removeItem("myfitUser");
    window.location.href = "/login";
  };

  const removeItem = () => {
    alert(
      "Database se item delete karne ka feature abhi connect nahi hua hai. Item remove nahi kiya gaya."
    );
  };

  return (
    <div className="dashboard-page">
      <nav className="dashboard-navbar">
        <a href="/" className="dashboard-logo">
          MYFIT
        </a>

        <div className="dashboard-nav-links">
          <a href="/">Home</a>
          <a href="/collection">Products</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/my-bookings">My Bookings</a>
          <a href="/payments">Payments</a>
        </div>

        <div className="dashboard-nav-actions">
          <a href="/collection" className="shop-btn">
            Explore Collection
          </a>

          {isLoggedIn ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <a href="/login" className="shop-btn">
              Login
            </a>
          )}
        </div>
      </nav>

      <section className="dashboard-header">
        <p>MY ACCOUNT</p>
        <h1>Hello, {user?.name || "Fashion Lover"}.</h1>
        <span>
          Manage your rentals, closet, payments and account activity
          from one place.
        </span>
      </section>

      <section className="dashboard-content">
        {/* PROFILE */}
        <div className="dashboard-card profile-card">
          <p className="card-label">PROFILE</p>
          <h2>{user?.name || "MyFit User"}</h2>
          <p>{user?.email || "user@example.com"}</p>

          <button
            type="button"
            onClick={() =>
              alert("Profile editing is not available yet.")
            }
          >
            Edit Profile
          </button>
        </div>

        {/* PENALTY POINTS */}
        <div className="dashboard-card penalty-card">
          <p className="card-label">PENALTY POINTS</p>
          <h2>{penaltyPoints} / 1000</h2>

          <div className="points-bar">
            <div
              className="points-progress"
              style={{
                width: `${Math.min(
                  Math.max(penaltyPoints, 0) / 10,
                  100
                )}%`,
              }}
            />
          </div>

          {user?.status === "BLOCKED" ? (
            <p className="blocked-text">Account Blocked</p>
          ) : (
            <p>Your account is active.</p>
          )}
        </div>

        {/* PENDING PAYMENT */}
        <div className="dashboard-card payment-warning-card">
          <p className="card-label">PENDING PAYMENT</p>

          {pendingAmount > 0 ? (
            <>
              <h2>₹{pendingAmount}</h2>
              <p>You have an unpaid damage charge.</p>
              <a href="/payments" className="card-button">
                Pay Now
              </a>
            </>
          ) : (
            <>
              <h2>₹0</h2>
              <p>You have no pending payments.</p>
              <a href="/payments" className="card-link">
                View Payment History →
              </a>
            </>
          )}
        </div>

        {/* CLOSET */}
        <div className="dashboard-card closet-card">
          <p className="card-label">MY CLOSET</p>

          {closetLoading ? (
            <>
              <h2>Loading your closet...</h2>
              <p>Please wait while we fetch your saved items.</p>
            </>
          ) : (
            <>
              {closetError && (
                <p role="alert">{closetError}</p>
              )}

              {closetItems.length > 0 ? (
                <>
                  <h2>
                    {closetItems.length} Item
                    {closetItems.length > 1 ? "s" : ""}
                  </h2>

                  <p>
                    Your listed outfits are available in your MyFit
                    closet.
                  </p>

                  <div className="closet-items">
                    {closetItems.map((item) => (
                      <div
                        className="closet-item"
                        key={item.id}
                      >
                        {item.image && (
                          <div className="closet-image">
                            <img
                              src={item.image}
                              alt={item.itemName || "Closet item"}
                            />
                          </div>
                        )}

                        <h3>{item.itemName}</h3>
                        <p>Category: {item.category}</p>
                        <p>Size: {item.size}</p>
                        <p>Rental Price: ₹{item.price}</p>

                        {item.description && (
                          <p>{item.description}</p>
                        )}

                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={removeItem}
                        >
                          Remove Item
                        </button>
                      </div>
                    ))}
                  </div>

                  <a href="/upload-closet" className="card-button">
                    Add Another Item
                  </a>
                </>
              ) : (
                <>
                  <h2>0 Items</h2>
                  <p>
                    Share your unused clothes and let others rent
                    them.
                  </p>

                  <a href="/upload-closet" className="card-button">
                    Add to Closet
                  </a>
                </>
              )}
            </>
          )}
        </div>

        {/* RENTALS */}
        <div className="dashboard-card">
          <p className="card-label">MY RENTALS</p>

          {userOrders.length > 0 &&
          userOrders[0].rentals?.length > 0 ? (
            <>
              <h2>{userOrders[0].rentals[0]?.name}</h2>
              <p>₹{userOrders[0].rentals[0]?.price} rental</p>
              <p>
                {userOrders[0].rentals[0]?.startDate}
                {" → "}
                {userOrders[0].rentals[0]?.endDate}
              </p>
              <p className="status-text">Rental Confirmed</p>
            </>
          ) : (
            <>
              <h2>No Rentals</h2>
              <p>You haven't rented anything yet.</p>
            </>
          )}

          <a href="/my-bookings" className="card-link">
            View My Bookings →
          </a>

          <br />

          <a href="/collection" className="card-link">
            Browse Collection →
          </a>
        </div>

        {/* ORDERS */}
        <div className="dashboard-card">
          <p className="card-label">MY ORDERS</p>

          {userOrders.length > 0 ? (
            <>
              <h2>Order #{userOrders[0].id}</h2>

              <p>
                {userOrders[0].rentals?.length || 0} outfit
                {userOrders[0].rentals?.length > 1 ? "s" : ""}
              </p>

              <p>Total: ₹{userOrders[0].total}</p>
              <p className="status-text">Order Confirmed ✓</p>
            </>
          ) : (
            <>
              <h2>0 Orders</h2>
              <p>Your orders will appear here.</p>
              <a href="/collection" className="card-button">
                Start Shopping
              </a>
            </>
          )}

          <a href="/my-bookings" className="card-link">
            View All Bookings →
          </a>
        </div>

        {/* PAYMENTS */}
        <div className="dashboard-card">
          <p className="card-label">PAYMENTS</p>
          <h2>{userTransactions.length}</h2>
          <p>Total transactions recorded on your account.</p>

          <a href="/payments" className="card-button">
            View Payment History
          </a>
        </div>

        {/* NOTIFICATIONS */}
        <div className="dashboard-card notification-card">
          <p className="card-label">NOTIFICATIONS</p>

          {pendingAmount > 0 ? (
            <>
              <h2>Payment required</h2>
              <p>
                Please clear your pending damage payment before
                renting another outfit.
              </p>
              <a href="/payments" className="card-link">
                Pay Pending Amount →
              </a>
            </>
          ) : user?.status === "BLOCKED" ? (
            <>
              <h2>Account Blocked</h2>
              <p>Your penalty points have reached 1000.</p>
            </>
          ) : (
            <>
              <h2>You're all caught up.</h2>
              <p>No pending payment or account alerts.</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
