"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type LabForm = {
  name: string;
  hospital_name: string;
  contact_no: string;
  email: string;
  password: string;
  confirmPassword: string;
  profile_image: File | null;
};

const LabAssistantRegister = () => {
  const [formData, setFormData] = useState<LabForm>({
    name: "",
    hospital_name: "",
    contact_no: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_image: null,
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [textShow, setTextShow] = useState(false);
  const [textShow1, setTextShow1] = useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  // VALIDATION
  const validate = () => {
    let err: any = {};

    // Name
    if (!formData.name) {
      err.name = "Please enter your name";
    }

    // Hospital Name
    if (!formData.hospital_name) {
      err.hospital_name = "Please enter hospital name";
    }

    // Contact Number
    if (!formData.contact_no) {
      err.contact_no = "Please enter contact number";
    } else if (!/^(\+94|0)\d{9}$/.test(formData.contact_no)) {
      err.contact_no = "Please enter a valid Sri Lankan phone number";
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      err.email = "Please enter email address";
    } else if (!emailPattern.test(formData.email)) {
      err.email = "Please enter a valid email address";
    }

    // Password
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!formData.password) {
      err.password = "Please enter password";
    } else if (!passwordPattern.test(formData.password)) {
      err.password =
        "Password must contain uppercase, lowercase, number and special character";
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      err.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    // Profile Image
    if (!formData.profile_image) {
      err.profile_image = "Please upload profile image";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "confirmPassword") {
        data.append(key, formData[key as keyof LabForm] as any);
      }
    });

    try {
      const res = await fetch(
        "http://localhost:5000/api/lab_assistant/register",
        {
          method: "POST",
          body: data,
        },
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Error occurred");
      } else {
        toast.success("Lab Assistant registered successfully ✅");

        setFormData({
          name: "",
          hospital_name: "",
          contact_no: "",
          email: "",
          password: "",
          confirmPassword: "",
          profile_image: null,
        });
      }
    } catch (error) {
      toast.error("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3e6f5] p-4 text-gray-900">
      <div className="relative w-full max-w-5xl bg-gray-100 rounded-md p-6 md:p-10 overflow-hidden">
        {/* Design */}
        <div className="absolute left-0 top-0 h-full flex gap-2 pl-2">
          <div className="w-2 bg-purple-200"></div>
          <div className="w-2 bg-purple-300"></div>
          <div className="w-2 bg-purple-200"></div>
        </div>

        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-200 rounded-full"></div>

        {/* FORM */}
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Register (Lab Assistant)
          </h1>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-3">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}

            <input
              name="hospital_name"
              placeholder="Hospital / Clinic Name"
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
            {errors.hospital_name && (
              <p className="text-red-500">{errors.hospital_name}</p>
            )}

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

            <div className="relative">
              <input
                name="password"
                type={textShow ? `text` : `password`}
                placeholder="Password"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
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
                name="confirmPassword"
                type={textShow1 ? `text` : `password`}
                placeholder="Confirm Password"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword}</p>
              )}
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

            <input
              name="contact_no"
              placeholder="Contact Number (+94)"
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
            {errors.contact_no && (
              <p className="text-red-500">{errors.contact_no}</p>
            )}

            <input
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
            {errors.profile_image && (
              <p className="text-red-500">{errors.profile_image}</p>
            )}

            <button
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-700 px-10 py-2 rounded-full text-white w-full"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <a className="text-blue-500" href="/lab-assistant-login">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default LabAssistantRegister;
