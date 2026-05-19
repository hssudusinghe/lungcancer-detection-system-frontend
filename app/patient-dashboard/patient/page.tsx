"use client";

import LogoutButton from "@/app/components/logoutbtn";
import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaCog,
  FaFileAlt,
  FaThLarge,
  FaUserInjured,
} from "react-icons/fa";

type Feedback = {
  feedback_id: number;
  doctor_name: string;
  comment: string;
  prediction_id: number;
  created_at: string;
};

type User = {
  user_id: number;
  name: string;
  email: string;
  profile_image?: string | null;
};

type Report = {
  prediction_id: number;
  result: string;
  created_at: string;
  respond_type: string;
  medical_image?: string;
  user_id: number;
  user_name: string;
};

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  href: string;
  active?: boolean;
};

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

type RiskLevel = "Low" | "Moderate" | "High" | "In Progress";

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case "Low":
      return "bg-green-200";

    case "Moderate":
      return "bg-yellow-200";

    case "High":
      return "bg-red-200";

    case "In Progress":
      return "bg-blue-200";

    default:
      return "bg-gray-200";
  }
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [latestReport, setLatestReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [latestFeedback, setLatestFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) return;

    // USER
    fetch(`http://localhost:5000/api/patient/get-by-id/${userId}`)
      .then((res) => res.json())
      .then((data: User) => setUser(data))
      .catch((err) => console.error("User fetch error:", err));

    // LATEST REPORT
    fetch(`http://localhost:5000/api/patient/report-latest/${userId}`)
      .then((res) => res.json())
      .then((data: Report) => setLatestReport(data))
      .catch((err) => console.error("Latest report fetch error:", err));

    // ALL REPORTS
    fetch(`http://localhost:5000/api/patient/reports/${userId}`)
      .then((res) => res.json())
      .then((data: Report[]) => setReports(data))
      .catch((err) => console.error("Reports fetch error:", err));

    // LATEST FEEDBACK
    fetch(`http://localhost:5000/api/patient/feedback/latest/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLatestFeedback(data.data);
        }
      })
      .catch((err) => console.error("Latest feedback fetch error:", err));
  }, []);

  // HEALTHY / AFFECTED %
  const healthyPercentage =
    latestReport?.result === "No Abnormality Detected" ? 90 : 40;

  const affectedPercentage = 100 - healthyPercentage;

  const mapRisk = (result?: string): RiskLevel => {
    if (!result) return "In Progress";

    if (result.includes("Large Cell Carcinoma")) {
      return "High";
    }

    if (
      result.includes("Adenocarcinoma") ||
      result.includes("Squamous Cell Carcinoma")
    ) {
      return "Moderate";
    }

    if (result.includes("Healthy Lungs")) {
      return "Low";
    }

    return "In Progress";
  };

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

            <p className="text-sm text-gray-600 truncate max-w-[180px]">
              {user?.email || ""}
            </p>
          </div>
        </div>

        {/* Menu */}
        <SidebarItem
          icon={<FaThLarge />}
          text="Dashboard"
          href="/patient-dashboard/dashboard"
        />
        <SidebarItem
          icon={<FaUserInjured />}
          text="Patient"
          href="/patient-dashboard/patient"
          active
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

      {/* MAIN */}
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold">Patient</h1>

        {/* Latest Report Card */}
        <div className="bg-purple-200 p-4 rounded-xl flex justify-between items-center">
          <div>
            <p className="font-semibold text-lg">
              {latestReport?.user_name || "Loading..."}
            </p>

            <p className="text-sm text-gray-600">
              Result: {latestReport?.result || "No data"}
            </p>

            <span
              className={`px-2 py-0.5 rounded text-xs ${
                latestReport?.respond_type === "complete"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {latestReport?.respond_type}
            </span>
          </div>

          <div className="text-right">
            <p className="text-sm">
              Last Scan:
              {latestReport?.created_at
                ? new Date(latestReport.created_at).toLocaleDateString()
                : "-"}
            </p>

            <span
              className={`px-2 py-1 rounded-full text-xs ${getRiskColor(
                mapRisk(latestReport?.result),
              )}`}
            >
              {mapRisk(latestReport?.result)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QUICK ACTIONS */}
          <div className="bg-purple-200 p-4 rounded-xl space-y-3">
            <h2 className="font-semibold text-lg">Quick Actions</h2>

            <div className="flex flex-col gap-2">
              <a href="/patient-dashboard/upload-scan">
                <button className="w-full bg-white p-2 rounded-lg shadow">
                  Upload Scan
                </button>
              </a>

              <a href="/patient-dashboard/reports">
                <button className="w-full bg-white p-2 rounded-lg shadow">
                  View All Reports
                </button>
              </a>

              <a href="/patient-dashboard/view-doctor">
                <button className="w-full bg-white p-2 rounded-lg shadow">
                  Contact Doctor
                </button>
              </a>
            </div>
          </div>

          {/* ROUND CHART */}
          <div className="space-y-4">
            <div className="bg-purple-200 p-4 rounded-xl text-center">
              <h3 className="font-semibold mb-3">Current Health Status</h3>

              {/* Circle */}
              <div
                className="w-36 h-36 rounded-full mx-auto"
                style={{
                  background: `conic-gradient(
                    #4ade80 0% ${healthyPercentage}%,
                    #f87171 ${healthyPercentage}% 100%
                  )`,
                }}
              />

              <div className="flex justify-between mt-4 text-sm">
                <span className="text-green-700">
                  {healthyPercentage}% healthy
                </span>

                <span className="text-red-600">
                  {affectedPercentage}% affected
                </span>
              </div>
            </div>
          </div>
          {/* Doctor Feedback */}
          <div className="bg-purple-200 p-5 rounded-2xl shadow-md">
            {/* TITLE */}
            <h2 className="font-bold text-xl text-purple-900">
              Doctor’s Feedback
            </h2>

            {/* IF FEEDBACK EXISTS */}
            {latestFeedback ? (
              <>
                {/* Doctor Name */}
                <div className="mt-4">
                  <p className="text-xs text-purple-700">Doctor Name</p>

                  <p className="font-semibold text-lg text-gray-800">
                    Dr. {latestFeedback.doctor_name}
                  </p>
                </div>

                {/* Prediction ID */}
                <div className="mt-3">
                  <p className="text-xs text-purple-700">Report ID</p>

                  <p className="text-sm font-medium text-gray-800">
                    #{latestFeedback.prediction_id}
                  </p>
                </div>

                {/* Comment */}
                <div className="mt-4">
                  <p className="text-xs text-purple-700">Doctor Comment</p>

                  <p className="mt-1 text-sm text-gray-700 leading-relaxed bg-white p-3 rounded-xl">
                    {latestFeedback.comment}
                  </p>
                </div>

                {/* Time */}
                <div className="mt-4">
                  <p className="text-xs text-purple-700">Feedback Time</p>

                  <p className="text-sm text-gray-800">
                    {latestFeedback.created_at
                      ? new Date(latestFeedback.created_at).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-gray-700">
                  No doctor feedback available yet.
                </p>
              </div>
            )}

            {/* BUTTON */}
            <a
              href="/patient-dashboard/view-feedbacks"
              className="inline-block mt-5 bg-white text-purple-700 font-medium px-5 py-2 rounded-xl hover:bg-gray-100 transition"
            >
              View Details
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
