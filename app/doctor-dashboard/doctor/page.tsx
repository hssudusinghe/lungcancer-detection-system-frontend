"use client";

import LogoutButton from "@/app/components/logoutbtn";
import React, { useEffect, useState } from "react";
import { CiLock } from "react-icons/ci";
import {
  FaCheckCircle,
  FaSearch,
  FaImage,
  FaThLarge,
  FaCog,
  FaBell,
  FaFileAlt,
  FaPlus,
  FaBars,
} from "react-icons/fa";
import { FiActivity, FiAlertTriangle, FiFileText } from "react-icons/fi";

/* ================= TYPES ================= */

type StatCardProps = {
  icon: React.ReactNode;
  text: string;
  color: string;
};

const StatCard: React.FC<StatCardProps> = ({ icon, text, color }) => {
  return (
    <a className={`p-3 rounded-lg flex items-center gap-2 ${color}`}>
      {icon}
      <span className="text-sm">{text}</span>
    </a>
  );
};

type User = {
  user_id: number;
  name: string;
  email: string;
  profile_image?: string | null;
};

type RiskLevel = "Low" | "Moderate" | "High" | "In Progress";

type Report = {
  id: string;
  name: string;
  date: string;
  risk: RiskLevel;
  respond_type: "await" | "complete";
};

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

const DoctorDashboard: React.FC = () => {
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

  const [search, setSearch] = useState("");

  const [reports, setReports] = useState<Report[]>([]);

  const [stats, setStats] = useState({
    lowRisk: 0,
    awaiting: 0,
    highRisk: 0,
    completed: 0,
  });

  const [action, setAction] = useState("");

  const handleSelect = (value: string) => {
    setAction(value);
    localStorage.setItem("action", value);
  };

  const filteredReports = reports.filter(
    (r) =>
      String(r.id).toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase()),
  );

  const mapRisk = (result: string): RiskLevel => {
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

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    const savedAction = localStorage.getItem("action");
    if (savedAction) {
      setAction(savedAction);
    }

    if (!userId) return;

    fetch(`http://localhost:5000/api/doctor/get-by-id/${userId}`)
      .then((res) => res.json())
      .then((data: User) => setUser(data))
      .catch((err) => console.error("Fetch error:", err));

    if (!userId) return;

    fetch(`http://localhost:5000/api/patient/reports-all`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API reports:", data);

        const mapped: Report[] = data.map((item: any) => ({
          id: item.prediction_id,
          name: item.user_name || "Patient",
          date: new Date(item.created_at).toLocaleDateString(),
          risk: mapRisk(item.result),
          respond_type: item.respond_type,
        }));

        setReports(mapped);

        // ✅ CALCULATE STATS
        const lowRisk = mapped.filter((r) => r.risk === "Low").length;

        const highRisk = mapped.filter((r) => r.risk === "High").length;

        const awaiting = data.filter(
          (r: any) => r.respond_type === "await",
        ).length;

        const completed = data.filter(
          (r: any) => r.respond_type === "complete",
        ).length;

        setStats({
          lowRisk,
          awaiting,
          highRisk,
          completed,
        });
      })
      .catch((err) => console.error("Reports fetch error:", err));
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
          text="Doctor Dashboard"
          href="/doctor-dashboard/doctor"
          active
        />
        <SidebarItem
          icon={<FaFileAlt />}
          text="Reports"
          href="/doctor-dashboard/reports"
        />
        <SidebarItem
          icon={<FaBell />}
          text="Notifications"
          href="/doctor-dashboard/notification"
        />
        <SidebarItem
          icon={<FaCog />}
          text="Settings"
          href="/doctor-dashboard/settings"
        />
        <LogoutButton redirectPath="/doctor-login" />
      </div>

      {/* MAIN */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <FaBars size={22} />
          <h1 className="text-2xl md:text-3xl font-bold">Doctor Dashboard</h1>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={<FaCheckCircle size={18} />}
            text={`Total Patients Reviewed ${stats.completed}`}
            color="bg-green-200"
          />
          <StatCard
            icon={<FiActivity size={18} />}
            text={`Positive Cases Today ${stats.lowRisk}`}
            color="bg-red-200"
          />
          <StatCard
            icon={<CiLock size={18} />}
            text={`Pending Reports ${stats.awaiting}`}
            color="bg-blue-200"
          />
          <StatCard
            icon={<FiAlertTriangle size={18} />}
            text={`High-Risk Alerts ${stats.highRisk}`}
            color="bg-red-300"
          />
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 w-full bg-white p-3 rounded-lg border hover:bg-gray-50 transition">
                  <FaSearch size={18} />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 outline-none"
                  />
                </div>
                <a
                  href="/doctor-dashboard/patient-register"
                  className="flex items-center gap-2 w-full bg-white p-3 rounded-lg border hover:bg-gray-50 transition"
                >
                  <FaPlus size={18} /> Add New Patient
                </a>
                <a
                  href="/doctor-dashboard/upload-scan"
                  className="flex items-center gap-2 w-full bg-white p-3 rounded-lg border hover:bg-gray-50 transition"
                >
                  <FaImage size={18} /> Upload Scan
                </a>
                <a
                  href="/doctor-dashboard/reports"
                  className="flex items-center gap-2 w-full bg-white p-3 rounded-lg border hover:bg-gray-50 transition"
                >
                  <FiFileText size={18} /> View All Reports
                </a>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="xl:col-span-2 bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Patient Review Table
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Scan ID</th>
                    <th className="p-2">Patient Name</th>
                    <th className="p-2">Scan Date</th>
                    <th className="p-2">Risk Level</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((row, i) => (
                    <tr key={i} className="text-center border-t">
                      <td className="p-2">{row.id}</td>
                      <td className="p-2">{row.name}</td>
                      <td className="p-2">{row.date}</td>

                      {/* RISK */}
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getRiskColor(
                            row.risk,
                          )}`}
                        >
                          {row.risk}
                        </span>
                      </td>

                      {/* RESPONSE TYPE */}
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            row.respond_type === "await"
                              ? "bg-yellow-200"
                              : row.respond_type === "complete"
                                ? "bg-green-200"
                                : "bg-blue-200"
                          }`}
                        >
                          {row.respond_type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="bg-purple-200 p-4 rounded-xl max-w-md">
          <h3 className="font-semibold mb-3">Doctor’s Observation</h3>

          <div className="space-y-3">
            {!action && (
              <>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="action"
                    value="confirm"
                    onChange={() => handleSelect("confirm")}
                  />
                  Confirm AI result
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="action"
                    value="rescan"
                    onChange={() => handleSelect("rescan")}
                  />
                  Request Re-scan
                </label>
              </>
            )}

            {action === "confirm" && (
              <p className="text-green-600">You selected: Confirm AI result</p>
            )}

            {action === "rescan" && (
              <p className="text-red-600">You selected: Request Re-scan</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
