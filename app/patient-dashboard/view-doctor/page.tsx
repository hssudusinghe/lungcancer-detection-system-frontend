"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, Building2, BadgeCheck, ArrowLeft } from "lucide-react";

type Doctor = {
  doctor_id: number;
  name: string;
  hospital_name: string;
  slmc_reg_no: string;
  contact_no: string;
  email: string;
  profile_image: string;
};

const ViewDoctorPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/doctor/get-all-doctors")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      // ✅ LOADING U
      <div className="min-h-screen flex items-center justify-center bg-[#f3e6f5]">
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3e6f5] p-6">
      {/* BACK BUTTON */}
      <a
        href="/patient-dashboard/patient"
        className="absolute top-4 left-4  flex items-center gap-2 text-gray-600 hover:text-purple-600"
      >
        <ArrowLeft size={20} />
        Back
      </a>
      <h1 className="text-2xl font-bold mb-6 mt-5 text-purple-800">
        Available Doctors
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.doctor_id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition"
          >
            {/* IMAGE + NAME */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={doc.profile_image || "https://via.placeholder.com/80"}
                className="w-16 h-16 rounded-full object-cover border"
              />

              <div>
                <h2 className="font-semibold text-gray-500 text-lg">
                  {doc.name}
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <BadgeCheck size={14} /> SLMC: {doc.slmc_reg_no}
                </p>
              </div>
            </div>

            {/* INFO */}
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Building2 size={14} />
                {doc.hospital_name}
              </p>

              <p className="flex items-center gap-2">
                <Phone size={14} />
                {doc.contact_no}
              </p>

              <p className="flex items-center gap-2">
                <Mail size={14} />
                {doc.email}
              </p>
            </div>

            {/* BUTTONS */}
            <div className="mt-4 flex gap-2">
              <a
                href={`tel:${doc.contact_no}`}
                className="flex-1 bg-green-100 text-green-700 text-center py-2 rounded-lg hover:bg-green-200 transition"
              >
                Call
              </a>

              <a
                href={`mailto:${doc.email}`}
                className="flex-1 bg-blue-100 text-blue-700 text-center py-2 rounded-lg hover:bg-blue-200 transition"
              >
                Email
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDoctorPage;
