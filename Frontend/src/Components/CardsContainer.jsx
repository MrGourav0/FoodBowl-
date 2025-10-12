import Card from "./Card";
import React from "react";

const foodItems = [
  {
    id: 1,
    title: "French Fries",
    img: "/src/public/french fries.jpg",
    desc: "Crispy and golden fries",
    price: { half: 60, full: 100 },
  },
  {
    id: 2,
    title: "Pizza",
    img: "/src/public/pizza.jpeg",
    desc: "Cheesy pizza with crispy crust",
    price: { half: 120, full: 200 },
  },
  {
    id: 3,
    title: "Burger",
    img: "/src/public/burger.jpeg",
    desc: "Juicy burger with fresh veggies",
    price: { half: 80, full: 150 },
  },
  {
    id: 4,
    title: "Ice Cream",
    img: "/src/public/ice.jpeg",
    desc: "Delicious ice cream for dessert",
    price: { half: 40, full: 70 },
  },
  {
    id: 5,
    title: "Paratha",
    img: "/src/public/paratha.jpg",
    desc: "Stuffed paratha with butter",
    price: { half: 50, full: 90 },
  },
  {
    id: 6,
    title: "Poha",
    img: "/src/public/poha.webp",
    desc: "Light and healthy breakfast",
    price: { half: 40, full: 70 },
  },
  {
    id: 7,
    title: "Shahi Paneer",
    img: "/src/public/sahi2.jpg",
    desc: "Rich and creamy paneer curry",
    price: { half: 120, full: 200 },
  },
  {
    id: 8,
    title: "Cream Roll",
    img: "/src/public/roll.jpg",
    desc: "Sweet cream roll delight",
    price: { half: 30, full: 50 },
  },
  {
    id: 9,
    title: "Samosa",
    img: "/src/public/samosa.jpg",
    desc: "Crispy samosa with spicy filling",
    price: { half: 20, full: 40 },
  },
  {
    id: 10,
    title: "Biryani",
    img: "/src/public/biryani.jpg",
    desc: "Flavorful and aromatic biryani",
    price: { half: 100, full: 180 },
  },
  {
    id: 11,
    title: "Cheese Corn Pizza",
    img: "/src/public/corn pizza.jpg",
    desc: "Corn and cheese loaded pizza",
    price: { half: 130, full: 220 },
  },
  {
    id: 12,
    title: "Vanilla Ice Cream",
    img: "/src/public/venela.jpg",
    desc: "Classic vanilla ice cream",
    price: { half: 40, full: 70 },
  },
];

const CardsContainer = ({ search }) => {
  const filteredItems = foodItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container my-4">
      <div className="row">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div className="col-md-3 mb-4" key={item.id}>
              <Card
                title={item.title}
                img={item.img}
                desc={item.desc}
                price={item.price}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-danger fs-4">No food found 😢</p>
        )}
      </div>
    </div>
  );
};

export default CardsContainer;