import { useEffect, useState } from "react";
import "./Collection.css";

import dress1 from "../assets/dress1.png";
import dress2 from "../assets/dress2.png";
import shoes1 from "../assets/shoes1.png";
import bag1 from "../assets/bag1.png";
import dress3 from "../assets/dress3.png";
import accessories1 from "../assets/accessories1.png";

function Collection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [backendProducts, setBackendProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/products"
        );

        if (!response.ok) {
          throw new Error("Products load nahi ho paaye.");
        }

        const data = await response.json();
        const products = Array.isArray(data) ? data : [data];

        setBackendProducts(
          products.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.pricePerDay ?? item.price,
            category: item.category || "Other",
            image: item.imageUrl || "",
            isBackendProduct: true,
          }))
        );

        setApiError("");
      } catch (error) {
        console.error("Products API error:", error);
        setApiError(
          "Backend products load nahi hue. Backend chalu hai ya nahi check karo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const defaultProducts = [
    {
      id: "default-1",
      name: "Elegant Party Dress",
      price: 499,
      category: "Party",
      image: dress1,
      isBackendProduct: false,
    },
    {
      id: "default-2",
      name: "Floral Wedding Dress",
      price: 799,
      category: "Wedding",
      image: dress2,
      isBackendProduct: false,
    },
    {
      id: "default-3",
      name: "Classic Heels",
      price: 399,
      category: "Footwear",
      image: shoes1,
      isBackendProduct: false,
    },
    {
      id: "default-4",
      name: "Elegant Handbag",
      price: 349,
      category: "Handbags",
      image: bag1,
      isBackendProduct: false,
    },
    {
      id: "default-5",
      name: "Casual Chic Dress",
      price: 449,
      category: "Casual",
      image: dress3,
      isBackendProduct: false,
    },
    {
      id: "default-6",
      name: "Pearl Accessories",
      price: 299,
      category: "Accessories",
      image: accessories1,
      isBackendProduct: false,
    },
  ];

  const userProducts = JSON.parse(
    localStorage.getItem("myfitUserProducts") || "[]"
  );

  const uploadedProducts = userProducts.map((item) => ({
    id: item.id,
    name: item.itemName,
    price: item.price,
    category: item.category || "Other",
    image: item.image || "",
    isBackendProduct: false,
  }));

  const backendNames = new Set(
    backendProducts.map((product) =>
      (product.name || "").trim().toLowerCase()
    )
  );

  const visibleDefaultProducts = defaultProducts.filter(
    (product) =>
      !backendNames.has(product.name.trim().toLowerCase())
  );

  const visibleUploadedProducts = uploadedProducts.filter(
    (product) =>
      !backendNames.has((product.name || "").trim().toLowerCase())
  );

  const allProducts = [
    ...visibleDefaultProducts,
    ...visibleUploadedProducts,
    ...backendProducts,
  ];

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category?.toLowerCase() ===
        selectedCategory.toLowerCase();

    const matchesSearch = (product.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleRentClick = (event, product) => {
    if (!product.isBackendProduct || product.id == null) {
      event.preventDefault();

      alert(
        "Is product ki database entry abhi nahi hai. Backend mein product add hone ke baad rent kar sakte ho."
      );
    }
  };

  const isLoggedIn =
    localStorage.getItem("myfitLoggedIn") === "true";

  return (
    <div className="collection-page">
      <nav className="collection-navbar">
        <a href="/" className="collection-logo">
          MYFIT
        </a>

        <div className="collection-nav-links">
          <a href="/">Home</a>
          <a href="/collection">Products</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/my-bookings">My Bookings</a>
        </div>

        <div className="collection-auth-links">
          {isLoggedIn ? (
            <button
              type="button"
              className="collection-login"
              onClick={() => {
                localStorage.removeItem("myfitLoggedIn");
                localStorage.removeItem("myfitUser");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          ) : (
            <a href="/login" className="collection-login">
              Login
            </a>
          )}
        </div>
      </nav>

      <section className="collection-header">
        <p>MYFIT COLLECTION</p>
        <h1>Find your perfect look.</h1>
        <span>
          Stylish outfits for every occasion,
          without the designer price tag.
        </span>
      </section>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search outfits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="categories">
        {[
          "All",
          "Party",
          "Wedding",
          "Casual",
          "Footwear",
          "Handbags",
          "Accessories",
        ].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "active-category"
                : ""
            }
          >
            {category}
          </button>
        ))}
      </div>

      {loading && (
        <p className="collection-message">
          Loading backend products...
        </p>
      )}

      {apiError && (
        <p className="collection-message">{apiError}</p>
      )}

      <section className="products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div
              className="product-card"
              key={`${product.isBackendProduct ? "backend" : "local"}-${product.id}-${index}`}
            >
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="product-image-placeholder">
                    MYFIT
                  </div>
                )}
              </div>

              <div className="product-info">
                <p className="product-category">
                  {product.category}
                </p>

                <h3>{product.name}</h3>

                <p className="product-price">
                  ₹{product.price}
                  <span> / day</span>
                </p>

                <a
                  href={
                    product.isBackendProduct &&
                    product.id != null
                      ? `/rent?id=${encodeURIComponent(
                          product.id
                        )}&name=${encodeURIComponent(
                          product.name
                        )}&price=${encodeURIComponent(
                          product.price
                        )}`
                      : "#"
                  }
                  className="rent-btn"
                  onClick={(event) =>
                    handleRentClick(event, product)
                  }
                >
                  Rent Now
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <h2>No outfits found.</h2>
            <p>Try another search or category.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Collection;