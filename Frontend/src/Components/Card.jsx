import React, { useState } from "react";

const Card = ({ title, img, desc, price }) => {
  // price = { half: 100, full: 180 }  <-- Parent se milega

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("half");

  // Calculate price
  const finalPrice = qty * price[size];

  return (
    <div
      className="card mt-3 rounded-0"
      style={{ width: "18rem", maxHeight: "380px" }}
    >
      <img
        src={img}
        className="card-img-top rounded-0"
        style={{ height: "200px" }}
        alt={title}
      />
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          {/* Left side - Title */}
          <h5 className="card-title mb-0">{title}</h5>

          {/* Right side - Price */}
          <h5 className="fw-bold mb-0" style={{ fontSize: "1.3rem" }}>
            ₹ {finalPrice}
          </h5>
        </div>

        <p className="card-text">{desc}</p>

        <div className="container w-100 d-flex justify-content-between align-items-center">
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

          {/* Size Select */}
          <select
            className="m-2 h-100 bg-success text-white rounded-0"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="half">Half</option>
            <option value="full">Full</option>
          </select>

          {/* Add Button */}
          <button className="btn btn-success rounded-0">Add</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
