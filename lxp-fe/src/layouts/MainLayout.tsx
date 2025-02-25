import React from "react";
import { useLocation } from "react-router-dom";
import NavbarAuth from "../Components/NavbarAuth";
import FooterAuth from "../Components/FooterAuth";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgetpw" ||
    location.pathname === "/resetpw" ||
    location.pathname === "/verification";

  // Add check for QuizAttempt page using regex to match the pattern
  const isQuizAttemptPage = /^\/quizAttempt\/.*\/.*\/.*$/.test(
    location.pathname
  );

  const showNavbarAndFooter = !isHomePage && !isAuthPage && !isQuizAttemptPage;

  return (
    <div className="layout">
      {showNavbarAndFooter && <NavbarAuth />}
      <main>{children}</main>
      {showNavbarAndFooter && <FooterAuth />}
    </div>
  );
};

export default MainLayout;
