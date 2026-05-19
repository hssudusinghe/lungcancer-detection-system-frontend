"use client";

import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type FormDataType = {
  name: string;
  age: string;
  nic: string;
  contact_no: string;
  gender: string;
  email: string;
  password: string;
  confirmPassword: string;
  profile_image: File | null;
};

const Register = () => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    age: "",
    nic: "",
    contact_no: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_image: null,
  });

  const [errors, setErrors] = useState<any>({});
  const [textShow, setTextShow] = useState(false);
  const [textShow1, setTextShow1] = useState(false);

  // HANDLE CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name as keyof FormDataType]: files ? files[0] : value,
    }));

    setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  // VALIDATION
  const validate = () => {
    let err: any = {};

    // Name
    if (!formData.name) err.name = "Name required";

    // NIC
    if (!formData.nic) err.nic = "NIC required";

    // Email Pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      err.email = "Email required";
    } else if (!emailPattern.test(formData.email)) {
      err.email = "Invalid email format";
    }

    // Password Pattern
    // Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.password) {
      err.password = "Password required";
    } else if (!passwordPattern.test(formData.password)) {
      err.password =
        "Password must contain uppercase, lowercase, number & special character";
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    // Age
    if (!formData.age) err.age = "Age required";

    // Gender
    if (!formData.gender) err.gender = "Select gender";

    // Contact Number
    if (!formData.contact_no) {
      err.contact_no = "Contact required";
    } else if (!/^(\+94|0)\d{9}$/.test(formData.contact_no)) {
      err.contact_no = "Invalid number";
    }

    // Profile Image
    if (!formData.profile_image) {
      err.profile_image = "Upload image";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "confirmPassword") {
        data.append(key, formData[key as keyof FormDataType] as any);
      }
    });

    try {
      const res = await fetch("http://localhost:5000/api/patient/register", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);
      } else {
        toast.success("Registered successfully ✅");
      }
    } catch {
      toast.error("Server error ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3e6f5] p-4 text-gray-900">
      <a
        href="/doctor-dashboard/doctor"
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-purple-600"
      >
        <ArrowLeft size={20} />
        Back
      </a>
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Register (Patient)
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* LEFT */}
          <div className="w-full md:w-1/2 space-y-3">
            <div>
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                name="nic"
                placeholder="NIC / ID"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.nic && (
                <p className="text-red-500 text-sm">{errors.nic}</p>
              )}
            </div>

            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                name="password"
                type={textShow ? `text` : `password`}
                placeholder="Password"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
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
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
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

            <div>
              <input
                name="age"
                type="number"
                placeholder="Age"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <p>Gender</p>
              <label className="mr-4">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                />{" "}
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                />{" "}
                Female
              </label>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender}</p>
              )}
            </div>

            <div>
              <input
                name="contact_no"
                placeholder="Contact Number (+94)"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.contact_no && (
                <p className="text-red-500 text-sm">{errors.contact_no}</p>
              )}
            </div>

            <div>
              <p>Profile image</p>
              <input
                name="profile_image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.profile_image && (
                <p className="text-red-500 text-sm">{errors.profile_image}</p>
              )}
            </div>

            <button className="w-full bg-purple-500 hover:bg-purple-700 text-white py-2 rounded-full mt-4">
              Submit
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full md:w-1/2 flex items-start">
            <img
              src="../assets/register.png"
              alt="lungs"
              className="rounded-lg w-full max-h-[600px] object-cover"
            />
          </div>
        </form>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Register;
