
import { useState } from "react";
import "./PaymentHistory.css";

function PaymentHistory() {
  const user =
    JSON.parse(localStorage.getItem("myfitUser")) || null;

  const isLoggedIn =
    localStorage.getItem("myfitLoggedIn") === "true";

  const [transactions, setTransactions] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("myfitTransactions")) || []
    );
  });

  const userTransactions = transactions.filter(
    (transaction) =>
      !user || transaction.userEmail === user.email
  );

  const handleLogout = () => {
    localStorage.removeItem("myfitLoggedIn");
    localStorage.removeItem("myfitUser");
    window.location.href = "/login";
  };

  const payDamage = (id) => {
    const updatedTransactions = transactions.map((transaction) => {
      if (
        transaction.id === id &&
        transaction.type === "DAMAGE" &&
        transaction.status === "PENDING" &&
        (!user || transaction.userEmail === user.email)
      ) {
        return {
          ...transaction,
          status: "PAID",
          paidDate: new Date().toLocaleDateString(),
        };
      }

      return transaction;
    });

    setTransactions(updatedTransactions);

    localStorage.setItem(
      "myfitTransactions",
      JSON.stringify(updatedTransactions)
    );

    alert("Payment completed successfully!");
  };

  const pendingAmount = userTransactions
    .filter(
      (transaction) =>
        transaction.type === "DAMAGE" &&
        transaction.status === "PENDING"
    )
    .reduce(
      (sum, transaction) => sum + Number(transaction.amount || 0),
      0
    );

  return (
    <div className="payments-page">
      <nav className="payments-navbar">
        <a href="/" className="payments-logo">
          MYFIT
        </a>

        <div className="payments-nav-links">
          <a href="/">Home</a>
          <a href="/collection">Products</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/my-bookings">My Bookings</a>
          <a href="/payments">Payments</a>
        </div>

        <div className="payments-nav-actions">
          {isLoggedIn ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <a href="/login">Login</a>
          )}
        </div>
      </nav>

      <section className="payments-header">
        <p>MYFIT PAYMENTS</p>

        <h1>Payment history.</h1>

        <span>
          View your rental payments and damage charges in one place.
        </span>
      </section>

      {pendingAmount > 0 && (
        <div className="pending-banner">
          <h2>Pending Payment: ₹{pendingAmount}</h2>

          <p>
            You have an unpaid damage charge. Please clear it before
            renting another outfit.
          </p>
        </div>
      )}

      <section className="payments-container">
        <div className="payment-summary-card">
          <p>TOTAL TRANSACTIONS</p>
          <h2>{userTransactions.length}</h2>
        </div>

        <div className="payment-summary-card">
          <p>PENDING DAMAGE PAYMENT</p>
          <h2>₹{pendingAmount}</h2>
        </div>

        <div className="transactions-section">
          <p className="section-label">TRANSACTION HISTORY</p>

          {userTransactions.length === 0 ? (
            <div className="empty-payments">
              <h2>No transactions yet.</h2>
              <p>
                Your rental and damage payments will appear here.
              </p>
            </div>
          ) : (
            userTransactions
              .slice()
              .reverse()
              .map((transaction) => (
                <div
                  className={`transaction-card ${
                    transaction.status === "PENDING"
                      ? "pending-transaction"
                      : ""
                  }`}
                  key={transaction.id}
                >
                  <div className="transaction-left">
                    <p className="transaction-type">
                      {transaction.type === "DAMAGE"
                        ? "DAMAGE CHARGE"
                        : "RENTAL PAYMENT"}
                    </p>

                    <h2>{transaction.description}</h2>

                    <p>Date: {transaction.date}</p>

                    {transaction.damageType && (
                      <p>Damage: {transaction.damageType}</p>
                    )}

                    {transaction.penaltyPoints && (
                      <p>
                        Penalty Points: +{transaction.penaltyPoints}
                      </p>
                    )}

                    {transaction.paidDate && (
                      <p>Paid Date: {transaction.paidDate}</p>
                    )}
                  </div>

                  <div className="transaction-right">
                    <h2>₹{transaction.amount}</h2>

                    {transaction.status === "PENDING" &&
                    transaction.type === "DAMAGE" ? (
                      <button
                        type="button"
                        onClick={() => payDamage(transaction.id)}
                      >
                        Pay Now
                      </button>
                    ) : transaction.status === "PENDING" ? (
                      <span className="pending-status">PENDING</span>
                    ) : (
                      <span className="paid-status">✓ PAID</span>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
}

export default PaymentHistory;
