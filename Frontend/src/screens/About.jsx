import React from "react";
import Navbar from "../Components/Nav";
import Developer from "../Components/Developer";
import Footer from "../Components/Footer";

const About = () => {
  return (
    <div><Navbar/>
     <div className="bg-dark text-light py-5">
      <div className="container">
        {/* Heading Section */}
        <div className="text-center mb-5">
          <h1 className="fw-bold ">About Us</h1>
          <p className="lead">
            Delivering happiness with every meal  quick, tasty, and fresh.
          </p>
        </div>

        {/* Info Section */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="">
              <div className="card-body text-center">
                <h3 className="">🍴 Fresh & Healthy</h3>
                <p>
                  We serve meals prepared with farm-fresh ingredients ensuring
                  health and taste in every bite.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="">
              <div className="card-body text-center">
                <h3 className="">⚡ Super Fast</h3>
                <p>
                  Hot and delicious food delivered at your doorstep in record
                  time, always on time.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="">
              <div className="card-body text-center">
                <h3 className="">💚 Customer Care</h3>
                <p>
                  Our priority is your satisfaction. We strive to give you the
                  best food delivery experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-5">
          <h2 className="fw-bold">Why Choose <span className="text-success">Us?</span></h2>
          <p className="mb-4">
            From quick delivery to tasty meals, <strong>FoodBowl</strong> makes
            your food cravings simple & joyful.
          </p>
        
        </div>
      </div>
    </div>
    <div><Developer/></div>
    <div><Footer/></div>
    </div>
  );
};

export default About;
