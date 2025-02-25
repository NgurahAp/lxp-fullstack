import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { AuthCarousel } from "./components/AuthCarousel";
import FormInput from "./components/FormInput";
import { useSearchParams } from "react-router-dom";

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const { login } = useAuth();

  // Password validation
  useEffect(() => {
    // Check if passwords match
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("Kata sandi tidak cocok");
      setIsValid(false);
    }
    // Check password strength
    else if (password.length > 0 && password.length < 8) {
      setPasswordError("Kata sandi minimal 8 karakter");
      setIsValid(false);
    }
    // All valid
    else if (
      password.length >= 8 &&
      password === confirmPassword &&
      confirmPassword
    ) {
      setPasswordError("");
      setIsValid(true);
    }
    // Not enough info yet
    else {
      setPasswordError("");
      setIsValid(false);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      toast.error("Pastikan kata sandi valid dan cocok");
      return;
    }

    if (!token) {
      toast.error("Token reset password tidak ditemukan");
      return;
    }

    try {
      // Here you would call your API to reset the password
      // await resetPassword(token, password);

      toast.success(
        "Password berhasil diubah! Silahkan login dengan kata sandi baru."
      );
      // Redirect to login page after successful reset
      // navigate("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Reset password gagal"
      );
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
          <h1 className="self-start font-bold text-4xl pb-3">Reset Password</h1>
          <p className="self-start text-gray-600 mb-6">
            Buat kata sandi baru untuk akun Anda
          </p>

          {/* Form Reset Password */}
          <form className="w-full relative space-y-5" onSubmit={handleSubmit}>
            {/* New Password Field */}
            <div className="relative">
              <FormInput
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Masukkan kata sandi baru"
                label="Kata Sandi Baru"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={login.status === "pending"}
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
                placeholder="Konfirmasi kata sandi baru"
                label="Konfirmasi Kata Sandi"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={login.status === "pending"}
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

            {/* Error message for password match */}
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}

            {/* Matching indicator */}
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
                "Ubah Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
