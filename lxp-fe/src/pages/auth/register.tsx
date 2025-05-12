import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthCarousel } from "./components/AuthCarousel";
import FormInput from "./components/FormInput";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [emailError, setEmailError] = useState("");

  const { register } = useAuth();

  // Form validation
  useEffect(() => {

    // Validate email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Format email tidak valid");
    } else {
      setEmailError("");
    }

    // Check if form is valid
    if (
      name &&
      email &&
      password &&
      confirmPassword &&
      password === confirmPassword &&
      password.length >= 8 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [name, email, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      toast.error("Mohon periksa kembali data Anda");
      return;
    }

    try {
      await register.mutateAsync({ name, email, password });
      toast.success(
        "Berhasil mendaftarkan akun! Silakan cek email Anda untuk verifikasi."
      );
      // Clear form after successful registration
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Pendaftaran gagal");
    }
  };

  const togglePasswordVisibility = (field: "password" | "confirm") => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center">
      {/* Left Side - Carousel */}
      <div className="w-3/5 h-full  md:block hidden">
        <AuthCarousel />
      </div>

      {/* Right Side */}
      <div className="md:w-2/5 w-full h-full flex items-center justify-center">
        <div className="w-2/3 flex flex-col items-center">
          {/* Logo */}
          <img src="/landing/logo.png" className="mx-auto mb-4" alt="Logo" />

          {/* Title */}
          <h1 className="self-start font-bold text-4xl pb-3">Daftar</h1>
          <p className="self-start text-gray-600 mb-6">
            Buat akun baru untuk memulai
          </p>

          {/* Form Register */}
          <form className="w-full relative space-y-4" onSubmit={handleSubmit}>
            {/* Name Field */}
            <FormInput
              type="text"
              id="name"
              name="name"
              placeholder="Masukkan Nama Lengkap"
              label="Nama"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={register.status === "pending"}
            />

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
                disabled={register.status === "pending"}
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
                disabled={register.status === "pending"}
              />
              <span
                className="absolute right-3 top-[45%] cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => togglePasswordVisibility("password")}
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

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="w-full space-y-1">
                <div className="flex gap-1">
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      password.length >= 8 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      password.length >= 8 && /[A-Z]/.test(password)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      password.length >= 8 && /[0-9]/.test(password)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  Kata sandi minimal 8 karakter. Disarankan menggunakan huruf
                  besar dan angka.
                </p>
              </div>
            )}

            {/* Confirm Password Field */}
            <div className="relative">
              <FormInput
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Konfirmasi Kata Sandi"
                label="Konfirmasi Kata Sandi"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={register.status === "pending"}
              />
              <span
                className="absolute right-3 top-[45%] cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => togglePasswordVisibility("confirm")}
                role="button"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
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

            {/* Password match indicator */}
            {confirmPassword && (
              <div className="flex items-center gap-2">
                {password === confirmPassword ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-green-500">
                      Kata sandi cocok
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-red-500">
                      Kata sandi tidak cocok
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start mt-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600">
                  Saya menyetujui{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    Syarat dan Ketentuan
                  </a>{" "}
                  serta{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    Kebijakan Privasi
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full mt-6 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ${
                isValid
                  ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isValid || register.status === "pending"}
            >
              {register.status === "pending" ? (
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
                "Daftar"
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:underline font-medium"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
