import Clients from "../Components/Client";
import FooterHome from "../Components/FooterHome";
import NavbarHome from "../Components/NavbarHome";
import { AboutUs } from "./home/AboutUs";
import { Article } from "./home/Article";
import { Bootcamp } from "./home/Bootcamp";
import { Fiture } from "./home/Fiture";
import { Hero } from "./home/Hero";
import { TrainingProgram } from "./home/TrainingProgram";

export default function Home() {
  return (
    <>
      <NavbarHome />
      <Hero />
      <Fiture />
      <TrainingProgram />
      <Bootcamp />
      <AboutUs />
      <Clients />
      <Article />
      <FooterHome />
    </>
  );
}
