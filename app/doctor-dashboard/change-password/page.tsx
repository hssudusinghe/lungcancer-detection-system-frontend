"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [userId] = useState<string | null>(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user_id") || "{}")
      : null,
  );

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>({});
  const [textShow, setTextShow] = useState(false);
  const [textShow1, setTextShow1] = useState(false);
  const [textShow2, setTextShow2] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };

  const validate = () => {
    let err: any = {};

    // Current Password
    if (!formData.current_password) {
      err.current_password = "Please enter your current password";
    }

    // New Password
    if (!formData.new_password) {
      err.new_password = "Please enter a new password";
    } else if (formData.new_password.length < 6) {
      err.new_password = "Password must be at least 6 characters";
    }

    // Confirm Password
    if (!formData.confirm_password) {
      err.confirm_password = "Please confirm your new password";
    } else if (formData.new_password !== formData.confirm_password) {
      err.confirm_password = "Passwords do not match";
    }

    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;
    if (!userId) return toast.error("User not found");

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/doctor/change-password/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            current_password: formData.current_password,
            new_password: formData.new_password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      } else {
        toast.success("Password changed successfully ✅");
        setFormData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      }
    } catch {
      toast.error("Server error ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3e6f5] p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        {/* BACK */}
        <a
          href="/doctor-dashboard/settings"
          className="flex items-center gap-2 mb-4 text-gray-600"
        >
          <ArrowLeft size={18} /> Back
        </a>

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Change Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={textShow1 ? `text` : `password`}
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              placeholder="Current Password"
              className="w-full p-3 border rounded-lg text-gray-700"
            />
            {error.current_password && (
              <p className="text-red-500 text-sm">{error.current_password}</p>
            )}{" "}
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
            )}
          </div>

          <div className="relative">
            <input
              type={textShow1 ? `text` : `password`}
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full p-3 border rounded-lg text-gray-700"
            />
            {error.new_password && (
              <p className="text-red-500 text-sm">{error.new_password}</p>
            )}{" "}
            {textShow1 ? (
              <FaEye
                className="absolute right-3 top-3 text-gray-700"
                onClick={() => setTextShow1(false)}
              />
            ) : (
              <FaEyeSlash
                className="absolute right-3 top-3 text-gray-700"
                onClick={() => setTextShow1(true)}
              />
            )}
          </div>
          <div className="relative">
            <input
              type={textShow2 ? `text` : `password`}
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-lg text-gray-700"
            />
            {error.confirm_password && (
              <p className="text-red-500 text-sm">{error.confirm_password}</p>
            )}{" "}
            {textShow2 ? (
              <FaEye
                className="absolute right-3 top-3 text-gray-700"
                onClick={() => setTextShow2(false)}
              />
            ) : (
              <FaEyeSlash
                className="absolute right-3 top-3 text-gray-700"
                onClick={() => setTextShow2(true)}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-full"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
