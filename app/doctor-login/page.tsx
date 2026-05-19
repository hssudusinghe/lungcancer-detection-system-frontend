"use client";

import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [textShow, setTextShow] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch("http://localhost:5000/api/doctor/login", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      } else {
        localStorage.setItem("user_id", data.user_id);

        toast.success("Login successful ✅");

        // optional save user
        localStorage.setItem("user", JSON.stringify(data));
setTimeout(() => {
        // redirect
        window.location.href = "/doctor-dashboard/doctor";
        }, 500);
      }
    } catch (err) {
      toast.error("Server error ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3e6f5] p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        <a
          href="/"
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-purple-600"
        >
          <ArrowLeft size={20} />
          Back to Home
        </a>

        {/* LEFT */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Doctor Login
          </h1>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border rounded-lg placeholder-gray-500 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            {/* Password */}
            <input
              type={textShow ? `text` : `password`}
              placeholder="Password"
              className="w-full mb-4 p-3 border rounded-lg placeholder-gray-500 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Error */}
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {textShow ? (
              <FaEye
                className="absolute right-3 top-3 text-gray-700"
                onClick={() => setTextShow(false)}
              />
            ) : (
              <FaEyeSlash
                className="absolute right-3 top-3 text-gray-700"
                onClick={() => setTextShow(true)}
              />
            )}{" "}
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-3 bg-purple-500 hover:bg-purple-700 text-white py-3 rounded-full w-full mt-4 transition shadow-sm"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>

            <span className="px-4 text-sm text-gray-500">OR</span>

            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* GOOGLE LOGIN */}
          <button className="flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 py-3 rounded-full w-full transition shadow-sm">
            <FcGoogle size={24} />

            <span className="font-medium text-gray-700">
              Continue with Google
            </span>
          </button>

          {/* FACEBOOK LOGIN */}
          <button className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full w-full mt-4 transition shadow-sm">
            <FaFacebook size={22} />

            <span className="font-medium">Continue with Facebook</span>
          </button>

          <p className="text-center mt-6 text-sm text-gray-500">
            Don’t have an account?{" "}
            <a className="text-blue-500" href="/doctor-register">
              Sign up
            </a>
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src="./assets/login.png"
            alt="lung"
            className="w-full max-w-md"
          />
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default DoctorLogin;
