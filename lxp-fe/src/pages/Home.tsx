import Clients from "../Components/Client";
import FooterHome from "../Components/FooterHome";
import NavbarHome from "../Components/NavbarHome";
import { AboutUs } from "./student/home/AboutUs";
import { Article } from "./student/home/Article";
import { Bootcamp } from "./student/home/Bootcamp";
import { Fiture } from "./student/home/Fiture";
import { Hero } from "./student/home/Hero";
import { TrainingProgram } from "./student/home/TrainingProgram";

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
