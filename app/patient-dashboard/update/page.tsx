"use client";

import { ArrowLeft, EditIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const PatientUpdate = () => {
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    nic: "",
    contact_no: "",
    gender: "",
    email: "",
    password: "",
    profile_image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  // GET USER ID
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserId(user.user_id);
    }
  }, []);

  // LOAD USER DATA
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/patient/get-by-id/${userId}`,
        );
        const data = await res.json();

        if (res.ok) {
          setFormData({
            name: data.name || "",
            age: data.age?.toString() || "",
            nic: data.nic || "",
            contact_no: data.contact_no || "",
            gender: data.gender || "",
            email: data.email || "",
            password: "",
            profile_image: null,
          });

          setPreview(data.profile_image || null);
        }
      } catch {
        toast.error("Failed to load user data");
      }
    };

    fetchUser();
  }, [userId]);

  // HANDLE CHANGE
  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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

    // Age
    if (!formData.age) {
      err.age = "Please enter your age";
    } else if (isNaN(Number(formData.age))) {
      err.age = "Please enter a valid age";
    }

    // NIC
    const nicPattern = /^([0-9]{9}[vVxX]|[0-9]{12})$/;

    if (!formData.nic) {
      err.nic = "Please enter NIC number";
    } else if (!nicPattern.test(formData.nic)) {
      err.nic = "Please enter a valid NIC number";
    }

    // Contact Number
    if (!formData.contact_no) {
      err.contact_no = "Please enter contact number";
    } else if (!/^(\+94|0)\d{9}$/.test(formData.contact_no)) {
      err.contact_no = "Please enter a valid Sri Lankan phone number";
    }

    // Gender
    if (!formData.gender) {
      err.gender = "Please select gender";
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

    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof typeof formData]) {
        data.append(key, formData[key as keyof typeof formData] as any);
      }
    });

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/patient/update/${userId}`,
        {
          method: "PUT",
          body: data,
        },
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);
      } else {
        toast.success("Profile updated successfully ✅");
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
          href="/patient-dashboard/settings"
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-purple-600"
        >
          <ArrowLeft size={20} />
          Back
        </a>

        {/* LEFT FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
            Update Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-3 border rounded-lg text-gray-700"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}

            <input
              name="age"
              value={formData.age || ""}
              onChange={handleChange}
              placeholder="Age"
              className="w-full p-3 border rounded-lg text-gray-700"
            />
            {errors.age && <p className="text-red-500">{errors.age}</p>}

            <input
              name="nic"
              value={formData.nic || ""}
              onChange={handleChange}
              placeholder="NIC"
              className="w-full p-3 border rounded-lg text-gray-700"
            />
            {errors.nic && <p className="text-red-500">{errors.nic}</p>}

            <input
              name="contact_no"
              value={formData.contact_no || ""}
              onChange={handleChange}
              placeholder="Contact"
              className="w-full p-3 border rounded-lg text-gray-700"
            />
            {errors.contact_no && (
              <p className="text-red-500">{errors.contact_no}</p>
            )}

            {/* GENDER */}
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg text-gray-700"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            {errors.gender && <p className="text-red-500">{errors.gender}</p>}

            <input
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border rounded-lg text-gray-700"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

            <button className="bg-purple-400 hover:bg-purple-500 text-white py-3 rounded-full w-full">
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-purple-100 relative">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Profile"
                className="w-64 h-64 object-cover rounded-full border-4 border-white shadow"
              />

              {/* PENCIL ICON */}
              <button
                type="button"
                onClick={handleFileClick}
                className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                <EditIcon className="text-gray-900" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center">
                No Image
              </div>

              <button
                type="button"
                onClick={handleFileClick}
                className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                <EditIcon className="text-gray-900" />
              </button>
            </div>
          )}

          {/* HIDDEN FILE INPUT */}
          <input
            type="file"
            name="profile_image"
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default PatientUpdate;
