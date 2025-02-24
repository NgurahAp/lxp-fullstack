import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthCarousel } from "./components/AuthCarousel";
import FormInput from "./components/FormInput";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register.mutateAsync({ name, email, password });
      toast.success("Berhasil mendaftarkan akun");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login gagal");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="h-[100vh] flex items-center justify-center">
      {/* Left Side - Carousel */}
      <div className="w-3/5 h-full">
        <AuthCarousel />
      </div>

      {/* Right Side */}
      <div className="w-2/5 h-full flex items-center justify-center">
        <div className="w-2/3 flex flex-col items-center">
          {/* Logo berada di tengah */}
          <img src="/landing/logo.png" className="mx-auto mb-2" alt="Logo" />

          {/* H1 berada di kiri */}
          <h1 className="self-start font-bold text-4xl pb-3">Daftar</h1>
          <form className="w-full relative" onSubmit={handleSubmit}>
            <FormInput
              type="text"
              id="name"
              name="name"
              placeholder="Masukan Nama Lengkap"
              label="Nama"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={register.status === "pending"}
            />
            <FormInput
              type="email"
              id="email"
              name="email"
              placeholder="Masukan Email"
              label="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={register.status === "pending"}
            />
            <div className="relative">
              <FormInput
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Masukan Kata Sandi"
                label="Kata Sandi"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={register.status === "pending"}
              />
              <span
                className="absolute right-3 top-[45%] cursor-pointer"
                onClick={togglePasswordVisibility}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.966 9.966 0 014.7-5.385M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3l18 18"
                    />
                  </svg>
                )}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
              disabled={register.status === "pending"}
            >
              {register.status === "pending" ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
