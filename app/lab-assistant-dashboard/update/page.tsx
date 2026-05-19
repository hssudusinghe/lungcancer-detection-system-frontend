"use client";

import { ArrowLeft, EditIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Update = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    hospital_name: "",
    contact_no: "",
    email: "",
    password: "",
    profile_image: null as File | null,
  });

  const [preview, setPreview] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // GET USER ID
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserId(parsed.user_id);
    }
  }, []);

  // LOAD DATA
  useEffect(() => {
    if (!userId) return;

    const fetchLabAssistant = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/lab_assistant/get-by-id/${userId}`,
        );
        const data = await res.json();

        if (res.ok) {
          setFormData({
            name: data.name || "",
            hospital_name: data.hospital_name || "",
            contact_no: data.contact_no || "",
            email: data.email || "",
            password: "",
            profile_image: null,
          });

          setPreview(data.profile_image || "");
        }
      } catch {
        toast.error("Failed to load lab assistant data");
      }
    };

    fetchLabAssistant();
  }, [userId]);

  // HANDLE CHANGE
  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profile_image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev: any) => ({ ...prev, [name]: "" }));
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
    if (formData.password && formData.password.length < 6) {
      err.password = "Password must contain at least 6 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;
    if (!userId) return toast.error("User not found");

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value as any);
    });

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/lab_assistant/update/${userId}`,
        {
          method: "PUT",
          body: data,
        },
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);
      } else {
        toast.success("Lab assistant profile updated successfully ✅");
      }
    } catch {
      toast.error("Server error ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3e6f5] p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* BACK */}
        <a
          href="/lab-assistant-dashboard/settings"
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-purple-600"
        >
          <ArrowLeft size={20} />
          Back
        </a>

        {/* LEFT FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
            Update Lab Assistant Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}

            <input
              name="hospital_name"
              value={formData.hospital_name}
              onChange={handleChange}
              placeholder="Hospital Name"
              className="w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            {errors.hospital_name && (
              <p className="text-red-500">{errors.hospital_name}</p>
            )}

            <input
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              placeholder="Contact"
              className="w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            {errors.contact_no && (
              <p className="text-red-500">{errors.contact_no}</p>
            )}

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

            <button className="bg-purple-500 text-white w-full py-3 rounded-full">
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-purple-100 relative">
          <div className="relative">
            <img
              src={preview || "/default.png"}
              className="w-64 h-64 rounded-full object-cover border-4"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow"
            >
              <EditIcon className="text-gray-900" />
            </button>

            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Update;
