import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { AuthCarousel } from "./components/AuthCarousel";
import FormInput from "./components/FormInput";

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [emailError, setEmailError] = useState("");

  const { login } = useAuth();

  // Form validation
  useEffect(() => {
    // Validate email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Format email tidak valid");
      setIsValid(false);
    } else {
      setEmailError("");
      // Form is valid if both email and password are provided
      setIsValid(!!email && !!password);
    }
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      toast.error("Mohon periksa kembali email dan kata sandi Anda");
      return;
    }

    try {
      await login.mutateAsync({ email, password });
      toast.success("Login berhasil!");
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
      <div className="w-3/5 h-full md:block hidden">
        <AuthCarousel />
      </div>

      {/* Right Side */}
      <div className="md:w-2/5 w-full h-full flex items-center justify-center">
        <div className="w-2/3 flex flex-col items-center">
          {/* Logo */}
          <img src="/landing/logo.png" className="mx-auto mb-4" alt="Logo" />

          {/* Title */}
          <h1 className="self-start font-bold text-4xl pb-3">Masuk</h1>
          <p className="self-start text-gray-600 mb-6">
            Selamat datang kembali! Silahkan masuk ke akun Anda
          </p>

          {/* Form Login */}
          <form className="w-full relative space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <FormInput
                type="email"
                id="email"
                name="email"
                placeholder="Masukkan Email"
                label="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={login.status === "pending"}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <FormInput
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Masukkan Kata Sandi"
                label="Kata Sandi"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={login.status === "pending"}
              />
              <span
                className="absolute right-3 top-[45%] cursor-pointer text-gray-500 hover:text-gray-700"
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

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgetpw"
                className="text-sm text-blue-500 hover:underline"
              >
                Lupa kata sandi?
              </Link>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-gray-600"
              >
                Ingat saya
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full mt-6 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ${
                isValid
                  ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isValid || login.status === "pending"}
            >
              {login.status === "pending" ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </div>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:underline font-medium"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
