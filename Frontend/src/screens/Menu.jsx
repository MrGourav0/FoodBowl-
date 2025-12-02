import React from "react";
import Navbar from "../Components/Nav";
import Footer from "../Components/Footer";


const Menu = () => {
  const foodItems = [
    {
      id: 1,
      name: "Pizza",
      price: "₹299",
      desc: "Cheesy and delicious with fresh toppings",
      img: "images.unsplash.com/photo-1601924582971-c9d3f5b4d0c6?auto=format&fit=crop&w=600&q=80"
,
    },
    {
      id: 2,
      name: "Burger",
      price: "₹149",
      desc: "Juicy and crispy with fries",
      img: "https://source.unsplash.com/400x300/?burger",
    },
    {
      id: 3,
      name: "Pasta",
      price: "₹199",
      desc: "Creamy pasta cooked to perfection",
      img: "https://source.unsplash.com/400x300/?pasta",
    },
    {
      id: 4,
      name: "Ice Cream",
      price: "₹99",
      desc: "Cold and sweet treat with toppings",
      img: "https://source.unsplash.com/400x300/?icecream",
    },
  ];

  return (
    <div>
      <Navbar/>
    
    <div className="container mt-5">
      <h2 className="text-center mb-5 fw-bold text-danger">
        🍴 Our Delicious Menu
      </h2>

      <div className="row">
        {foodItems.map((item) => (
          <div className="col-md-3 mb-4" key={item.id}>
            <div className="card h-100 shadow-lg border-0 rounded">
              <img
                src={item.img}
                className="card-img-top"
                alt={item.name}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">{item.name}</h5>
                <p className="card-text text-muted">{item.desc}</p>
                <h6 className="text-success fw-bold mb-3">{item.price}</h6>
                <button className="btn btn-outline-danger">
                  Order Now 
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div><Footer/></div>
    </div>
  );
};

export default Menu;
