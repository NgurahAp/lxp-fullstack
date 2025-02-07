import React from "react";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-left" />
      <AppRoutes />
    </QueryClientProvider>
  );
};

export default App;
