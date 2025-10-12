
import React,{useState} from "react";
import Navbar from "../Components/Nav";
import Footer from "../Components/Footer";
import Card from "../Components/Card";
import Carousal from "../Components/Carousal";
import CardsContainer from "../Components/CardsContainer";
import Developer from "../Components/Developer";
import FoodBlogSection from "../Components/FoodBlogSection";
import SpecialParallaxSection from "../Components/SpecialParallaxSection";
import ShopSection from "../Components/ShopSection";


const Home = () => {
  const [search,setSearch]=useState("");
  return (
    <div>
      <div> <Navbar setSearch={setSearch}/></div>
      <div><Carousal/></div>
      <div><ShopSection/></div>
      <div>  <CardsContainer search={search}/></div>
      <div><FoodBlogSection/></div>
      <div><SpecialParallaxSection/></div>

      <div><Footer /></div>
    </div>
  );
};

export default Home;