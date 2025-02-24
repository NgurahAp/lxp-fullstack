import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { AuthCarousel } from "./components/AuthCarousel";
import FormInput from "./components/FormInput";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // await login.mutateAsync({ email, password });
      toast.success("Login berhasil!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login gagal");
    }
  };

  return (
    <section className="h-[100vh] flex items-center justify-center">
      {/* Left Side - Carousel */}
      <div className="w-3/5 h-full md:block hidden">
        <AuthCarousel />
      </div>

      {/* Right Side */}
      <div className="md:w-2/5 w-full h-full flex items-center justify-center">
        <div className="w-2/3 flex flex-col items-center">
          {/* Logo */}
          <img src="/landing/logo.png" className="mx-auto mb-4" alt="Logo" />

          <h1 className="self-start font-bold text-3xl pb-3">
            Lupa Sandi
          </h1>

          {/* Form Login */}
          <form className="w-full relative" onSubmit={handleSubmit}>
            <FormInput
              type="email"
              id="email"
              name="email"
              placeholder="Masukan Email"
              label="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={login.status === "pending"}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
              disabled={login.status === "pending"}
            >
              {login.status === "pending" ? "Memproses..." : "Kirim"}
            </button>
          </form>

          {/* Tambahan: Forgot Password dan Sign Up */}
          <div className="w-full flex flex-col items-center mt-4">
            <Link
              to="/login"
              className="w-full mt-3 bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded text-center hover:bg-gray-200 transition"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
