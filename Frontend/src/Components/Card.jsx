import React, { useState } from "react";

const Card = ({ item, onAddToCart, shopId, shopName }) => {
  // item prop mein poora item object hoga (jismein _id, name, price, image, category, foodType, desc/title hoga)
  // onAddToCart ek function hoga jo parent se milega

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("full"); // Default size

  // Check if price has 'half' and 'full' options (like in CardsContainer's static data)
  const hasSizeOptions = typeof item.price === 'object' && item.price !== null && ('half' in item.price || 'full' in item.price);

  // Calculate current price based on size selection or single price
  const currentPrice = hasSizeOptions ? item.price[size] : item.price;
  const finalPrice = qty * currentPrice;

  const handleAddClick = () => {
    if (onAddToCart) {
      // Item object ko prepare karein jismein selected quantity aur price ho
      const itemToAdd = {
        ...item,
        price: currentPrice, // Selected size ke hisaab se price
        quantity: qty, // Selected quantity
        selectedSize: hasSizeOptions ? size : undefined, // Agar size options the to selected size bhi bhejein
      };
      onAddToCart(itemToAdd, shopId, shopName); // Parent ke handler ko call karein
    }
  };

  return (
    <div
      className="card mt-3 rounded-0 w-100"
      style={{ maxWidth: "18rem", maxHeight: "380px" }}
    >
      <img
        src={item.image || item.img} // item.image for backend, item.img for static
        className="card-img-top rounded-0"
        style={{ height: "200px", objectFit: "cover" }}
        alt={item.name || item.title} // item.name for backend, item.title for static
      />
      <div className="card-body d-flex flex-column"> {/* Added flex-column for better layout */}
        <div className="d-flex justify-content-between align-items-center">
          {/* Left side - Title */}
          <h5 className="card-title mb-0">{item.name || item.title}</h5>

          {/* Right side - Price */}
          <h5 className="fw-bold mb-0" style={{ fontSize: "1.3rem" }}>
            ₹ {finalPrice}
          </h5>
        </div>

        <p className="card-text text-muted flex-grow-1">{item.desc || item.category}</p> {/* Use item.desc or item.category */}

        <div className="container w-100 d-flex justify-content-between align-items-center mt-auto"> {/* mt-auto to push to bottom */}
          {/* Quantity Select */}
          <select
            className="m-2 h-100 bg-success text-white rounded-0"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          >
            {Array.from(Array(6), (e, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          {/* Size Select - only if item has half/full price options */}
          {hasSizeOptions && (
            <select
              className="m-2 h-100 bg-success text-white rounded-0"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {item.price.half && <option value="half">Half</option>}
              {item.price.full && <option value="full">Full</option>}
            </select>
          )}

          {/* Add Button */}
          <button className="btn btn-success rounded-0" onClick={handleAddClick}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
