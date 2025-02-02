import React from "react";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <>
      <Toaster position="bottom-left" />
      <AppRoutes />
    </>
  );
};

export default App;
