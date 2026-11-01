import { useState } from "react";
import "./DamageManagement.css";

function DamageManagement() {
  const [orders] = useState(
    JSON.parse(localStorage.getItem("myfitOrders")) || []
  );

  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [damageType, setDamageType] = useState("");
  const [damageCost, setDamageCost] = useState("");
  const [notes, setNotes] = useState("");

  const damagePoints = {
    "Minor Stain": 50,
    "Major Tear": 200,
    "Irreparable Damage": 500,
  };

  const currentPoints = damagePoints[damageType] || 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !selectedOrder ||
      !selectedItem ||
      !damageType ||
      !damageCost
    ) {
      alert("Please fill all damage details.");
      return;
    }

    const order = orders.find(
      (item) => item.id === selectedOrder
    );

    if (!order) {
      alert("Order not found.");
      return;
    }

    const rental = order.rentals.find(
      (item) => String(item.id) === String(selectedItem)
    );

    if (!rental) {
      alert("Rental item not found.");
      return;
    }

    const user =
      JSON.parse(localStorage.getItem("myfitUser")) || null;

    if (!user) {
      alert("User account not found.");
      return;
    }

    // Add penalty points
    const oldPoints = Number(user.penaltyPoints || 0);
    const newPoints = oldPoints + currentPoints;

    const newStatus =
      newPoints >= 1000 ? "BLOCKED" : "ACTIVE";

    const updatedUser = {
      ...user,
      penaltyPoints: newPoints,
      status: newStatus,
    };

    localStorage.setItem(
      "myfitUser",
      JSON.stringify(updatedUser)
    );

    // Save damage report
    const damageReports =
      JSON.parse(
        localStorage.getItem("myfitDamageReports")
      ) || [];

    const report = {
      id: Date.now(),
      orderId: order.id,
      renterName: order.userName,
      renterEmail: order.userEmail,
      outfitName: rental.name,
      damageType,
      damageCost: Number(damageCost),
      penaltyPoints: currentPoints,
      notes,
      status: "PENDING",
      date: new Date().toLocaleDateString(),
    };

    damageReports.push(report);

    localStorage.setItem(
      "myfitDamageReports",
      JSON.stringify(damageReports)
    );

    // Add pending payment transaction
    const transactions =
      JSON.parse(
        localStorage.getItem("myfitTransactions")
      ) || [];

    transactions.push({
      id: Date.now() + 1,
      userEmail: order.userEmail,
      userName: order.userName,
      type: "DAMAGE",
      description: `${rental.name} - Damage Charge`,
      damageType,
      amount: Number(damageCost),
      penaltyPoints: currentPoints,
      status: "PENDING",
      date: new Date().toLocaleDateString(),
      orderId: order.id,
    });

    localStorage.setItem(
      "myfitTransactions",
      JSON.stringify(transactions)
    );

    if (newStatus === "BLOCKED") {
      alert(
        `Damage recorded. +${currentPoints} penalty points added. Total points: ${newPoints}. The account has been BLOCKED.`
      );
    } else {
      alert(
        `Damage recorded successfully. ₹${damageCost} payment is now pending and +${currentPoints} penalty points were added.`
      );
    }

    setSelectedOrder("");
    setSelectedItem("");
    setDamageType("");
    setDamageCost("");
    setNotes("");

    window.location.reload();
  };

  const selectedOrderData = orders.find(
    (order) => order.id === selectedOrder
  );

  return (
    <div className="damage-page">
      <nav className="damage-navbar">
        <a href="/" className="damage-logo">
          MYFIT
        </a>

        <div className="damage-nav-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/payments">Payments</a>
          <a href="/collection">Products</a>
        </div>
      </nav>

      <section className="damage-header">
        <p>MYFIT STAFF</p>

        <h1>Damage management.</h1>

        <span>
          Inspect returned outfits and record verified damage costs.
        </span>
      </section>

      <section className="damage-container">
        <div className="damage-policy">
          <p className="damage-label">PENALTY POINT POLICY</p>

          <div className="damage-rules">
            <div>
              <strong>Minor Stain</strong>
              <span>+50 points</span>
            </div>

            <div>
              <strong>Major Tear</strong>
              <span>+200 points</span>
            </div>

            <div>
              <strong>Irreparable Damage</strong>
              <span>+500 points</span>
            </div>
          </div>

          <p className="policy-note">
            Penalty points are based on damage severity. The damage
            payment is separately entered by MyFit staff according to
            the actual cleaning or repair cost.
          </p>
        </div>

        <div className="damage-form-box">
          <h2>Record Returned Outfit Damage</h2>

          <form onSubmit={handleSubmit}>
            <label>Select Order</label>

            <select
              value={selectedOrder}
              onChange={(e) => {
                setSelectedOrder(e.target.value);
                setSelectedItem("");
              }}
            >
              <option value="">Select an order</option>

              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id} - {order.userName}
                </option>
              ))}
            </select>

            <label>Select Outfit</label>

            <select
              value={selectedItem}
              onChange={(e) =>
                setSelectedItem(e.target.value)
              }
              disabled={!selectedOrderData}
            >
              <option value="">Select outfit</option>

              {selectedOrderData?.rentals.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <label>Damage Type</label>

            <select
              value={damageType}
              onChange={(e) =>
                setDamageType(e.target.value)
              }
            >
              <option value="">Select damage</option>
              <option value="Minor Stain">
                Minor Stain
              </option>
              <option value="Major Tear">
                Major Tear
              </option>
              <option value="Irreparable Damage">
                Irreparable Damage
              </option>
            </select>

            {damageType && (
              <div className="points-display">
                Penalty Points:{" "}
                <strong>+{currentPoints}</strong>
              </div>
            )}

            <label>
              Actual Cleaning / Repair Cost
            </label>

            <input
              type="number"
              min="0"
              placeholder="Enter actual cost in ₹"
              value={damageCost}
              onChange={(e) =>
                setDamageCost(e.target.value)
              }
            />

            <p className="amount-note">
              MyFit staff enters the actual verified amount
              required for cleaning or repairing the outfit.
            </p>

            <label>Inspection Notes</label>

            <textarea
              placeholder="Enter inspection details..."
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
            />

            <button type="submit">
              Record Damage
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default DamageManagement;