"use client";

import LogoutButton from "@/app/components/logoutbtn";
import React, { useEffect, useState } from "react";
import { CgBlock } from "react-icons/cg";
import {
  FaThLarge,
  FaUserInjured,
  FaBell,
  FaCog,
  FaBars,
  FaFileAlt,
} from "react-icons/fa";

type User = {
  user_id: number;
  name: string;
  email: string;
  profile_image?: string | null;
};

/* ================= TYPES ================= */
type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  href: string;
  active?: boolean;
};

type ActionBtnProps = {
  text: string;
};

/* ================= COMPONENTS ================= */

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  href,
  active = false,
}) => (
  <a
    href={href}
    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
      active ? "bg-purple-300 font-medium" : "hover:bg-purple-300"
    }`}
  >
    {icon}
    <span className="hidden md:block">{text}</span>
  </a>
);

const ActionBtn: React.FC<ActionBtnProps> = ({ text }) => (
  <button className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md text-sm transition w-full">
    {text}
  </button>
);

/* ================= MAIN ================= */

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const [latestReport, setLatestReport] = useState<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) return;

    // USER DETAILS
    fetch(`http://localhost:5000/api/patient/get-by-id/${userId}`)
      .then((res) => res.json())
      .then((data: User) => setUser(data))
      .catch((err) => console.error("Fetch error:", err));

    // LATEST REPORT
    fetch(`http://localhost:5000/api/patient/report-latest/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Latest Report:", data);
        setLatestReport(data);
      })
      .catch((err) => console.error("Report fetch error:", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-purple-100 text-gray-900">
      {/* SIDEBAR */}
      <div className="w-24 md:w-64 bg-purple-200 p-3 flex flex-col gap-4">
        {/* Profile */}
        <div className="flex items-center md:flex-row flex-col gap-3 mb-6">
          <div className="w-10 h-10 min-w-10 min-h-10 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
            {user?.profile_image ? (
              <img
                src={user.profile_image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-purple-600">
                {user?.name?.charAt(0) || "U"}
              </span>
            )}
          </div>

          <div className="hidden md:block">
            <p className="font-semibold truncate max-w-[180px]">
              {user?.name || "Loading..."}
            </p>

            <p
              className="text-sm text-gray-600 truncate max-w-[180px]"
              title={user?.email || ""}
            >
              {user?.email || ""}
            </p>
          </div>
        </div>

        {/* Menu */}
        <SidebarItem
          icon={<FaThLarge />}
          text="Dashboard"
          href="/patient-dashboard/dashboard"
          active
        />
        <SidebarItem
          icon={<FaUserInjured />}
          text="Patient"
          href="/patient-dashboard/patient"
        />
        <SidebarItem
          icon={<FaFileAlt />}
          text="Reports"
          href="/patient-dashboard/reports"
        />
        <SidebarItem
          icon={<FaBell />}
          text="Notifications"
          href="/patient-dashboard/notification"
        />
        <SidebarItem
          icon={<FaCog />}
          text="Settings"
          href="/patient-dashboard/settings"
        />
        <LogoutButton redirectPath="/patient-login" />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <FaBars size={22} />
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Lung Comparison */}
          <div className="bg-purple-200 p-4 rounded-xl col-span-2">
            <h2 className="font-semibold mb-3">AI Lung Visual Comparison</h2>

            <div className="flex justify-around flex-wrap gap-4">
              <div className="text-center">
                <img
                  src="../assets/good _lung_patient_dashbord.png"
                  alt="healthy"
                  className="w-24 h-24 object-cover mx-auto rounded"
                />
                <p className="text-sm mt-1">Healthy Structural Lung</p>
              </div>

              <div className="text-center">
                <img
                  src="../assets/bad_lung_patientdashboard.png"
                  alt="cancer"
                  className="w-24 h-24 object-cover mx-auto rounded"
                />
                <p className="text-sm mt-1">Cancer Affected Lung</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border border-purple-200 shadow-sm p-5 rounded-xl flex items-center gap-4">
            {/* IMAGE / ICON */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-purple-50 flex items-center justify-center flex-shrink-0">
              {latestReport?.medical_image ? (
                <img
                  src={`data:image/jpeg;base64,${latestReport.medical_image}`}
                  alt="CT Scan"
                  className="w-full h-full object-cover"
                />
              ) : (
                <CgBlock className="text-purple-400 text-2xl" />
              )}
            </div>

            {/* TEXT */}
            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                Today’s AI Scan Summary
              </p>

              {latestReport ? (
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-purple-500">Result:</span>{" "}
                    {latestReport.result}
                  </p>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      latestReport.respond_type === "complete"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {latestReport.respond_type}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  No reports available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION */}
        <div className="mt-4 w-full">
          {/* Quick Actions */}
          <div className="bg-purple-200 p-4 rounded-xl w-full">
            <h2 className="font-semibold text-center mb-4">Quick Actions</h2>

            <div className="grid grid-cols-2 gap-3 w-full">
              <a href="/patient-dashboard/upload-scan" className="w-full">
                <ActionBtn text="Upload Scan" />
              </a>

              <a href="/patient-dashboard/reports" className="w-full">
                <ActionBtn text="View All Reports" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <h2 className="text-center font-bold mt-6 text-lg">
          Your Health is your Greatest Wealth!
        </h2>
      </div>
    </div>
  );
};

export default Dashboard;
