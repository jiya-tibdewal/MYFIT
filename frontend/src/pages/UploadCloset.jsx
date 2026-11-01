
import { useState } from "react";
import "./UploadCloset.css";

const API_BASE_URL = "http://localhost:8080/api";

function UploadCloset() {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Available sizes according to category
  const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const footwearSizes = ["3", "4", "5", "6", "7", "8", "9", "10"];

  const isSizeDisabled =
    category === "Handbags" || category === "Accessories";

  const availableSizes =
    category === "Footwear" ? footwearSizes : clothingSizes;

  const isLoggedIn =
    localStorage.getItem("myfitLoggedIn") === "true";

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("myfitUser") || "null");
      return Number(user?.id);
    } catch {
      return NaN;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("myfitLoggedIn");
    localStorage.removeItem("myfitUser");
    window.location.href = "/login";
  };

  // Clear size whenever category changes
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSize("");
    setMessage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImage("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Image size must be 2 MB or less.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(String(reader.result || ""));
      setMessage("");
    };

    reader.onerror = () => {
      setMessage("Could not read the selected image. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isLoggedIn) {
      setMessage("Please login before uploading an item.");
      return;
    }

    const userId = getUserId();

    if (!Number.isInteger(userId) || userId <= 0) {
      setMessage("Your user ID was not found. Please logout and login again.");
      return;
    }

    if (
      !itemName.trim() ||
      !category ||
      (!isSizeDisabled && !size) ||
      !price
    ) {
      setMessage("Please fill all required fields.");
      return;
    }

    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      setMessage("Rental price must be greater than zero.");
      return;
    }

    const newItem = {
      userId,
      itemName: itemName.trim(),
      category,
      size: isSizeDisabled ? "" : size,
      price: Number(price),
      description: description.trim(),
      image: image || null,
    };

    setIsSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/closet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            `Upload failed with status ${response.status}.`
        );
      }

      const savedItem = {
        ...newItem,
        ...responseData,
        image: responseData?.image || newItem.image || "",
      };

      const existingClosetItems = JSON.parse(
        localStorage.getItem("myfitClosetItems") || "[]"
      );

      localStorage.setItem(
        "myfitClosetItems",
        JSON.stringify([...existingClosetItems, savedItem])
      );

      const existingProducts = JSON.parse(
        localStorage.getItem("myfitUserProducts") || "[]"
      );

      localStorage.setItem(
        "myfitUserProducts",
        JSON.stringify([...existingProducts, savedItem])
      );

      setMessage("Item saved successfully to your closet database!");

      window.setTimeout(() => {
        window.location.href = "/dashboard";
      }, 700);
    } catch (error) {
      console.error("Closet upload error:", error);

      setMessage(
        error.message?.includes("Failed to fetch")
          ? "Cannot connect to the backend. Make sure Spring Boot is running on port 8080."
          : error.message || "Could not save your item. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="upload-page">
      <nav className="upload-navbar">
        <a href="/" className="upload-logo">
          MYFIT
        </a>

        <div className="upload-nav-links">
          <a href="/">Home</a>
          <a href="/collection">Products</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/my-bookings">My Bookings</a>
          <a href="/payments">Payments</a>
        </div>

        <div className="upload-nav-actions">
          {isLoggedIn ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <a href="/login">Login</a>
          )}
        </div>
      </nav>

      <section className="upload-container">
        <div className="upload-heading">
          <p>MY CLOSET</p>
          <h1>Share your style.</h1>
          <span>
            Upload an item from your wardrobe and let someone
            else give it a new moment.
          </span>
        </div>

        <form className="upload-form" onSubmit={handleUpload}>
          <label>Item Photo</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {image && (
            <div className="image-preview">
              <img src={image} alt="Item Preview" />
            </div>
          )}

          <label>Item Name *</label>
          <input
            type="text"
            placeholder="e.g. Black Party Dress"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />

          <label>Category *</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select category</option>
            <option value="Party">Party</option>
            <option value="Wedding">Wedding</option>
            <option value="Casual">Casual</option>
            <option value="Footwear">Footwear</option>
            <option value="Handbags">Handbags</option>
            <option value="Accessories">Accessories</option>
          </select>

          <label>
            Size {isSizeDisabled ? "(Not Required)" : "*"}
          </label>

          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            disabled={!category || isSizeDisabled}
            required={!isSizeDisabled}
          >
            <option value="">
              {isSizeDisabled
                ? "Size not required"
                : !category
                ? "Select category first"
                : "Select size"}
            </option>

            {!isSizeDisabled &&
              availableSizes.map((itemSize) => (
                <option key={itemSize} value={itemSize}>
                  {itemSize}
                </option>
              ))}
          </select>

          <label>Rental Price (₹) *</label>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="e.g. 499"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            placeholder="Tell us a little about your item..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {message && (
            <p role="status" aria-live="polite">
              {message}
            </p>
          )}

          <button type="submit" disabled={isSaving}>
            {isSaving ? "Saving Item..." : "Add to My Closet"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default UploadCloset;
