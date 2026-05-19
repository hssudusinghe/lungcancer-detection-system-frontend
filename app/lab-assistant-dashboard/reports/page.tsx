"use client";

import React, { useEffect, useState } from "react";

import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  Download,
  FileDown,
} from "lucide-react";

import { FaBell, FaCog, FaFileAlt, FaThLarge } from "react-icons/fa";

import LogoutButton from "@/app/components/logoutbtn";
import toast, { Toaster } from "react-hot-toast";

type StatCardProps = {
  icon: React.ReactNode;
  text: string;
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

  medical_image?: string;
  result?: string;
  created_at?: string;
};

const API = "http://localhost:5000/api/patient/reports-all";

const StatCard: React.FC<StatCardProps> = ({ icon, text }) => {
  return (
    <div className="bg-white p-3 rounded-lg flex items-center gap-2 shadow">
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
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

const ReportsPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const [reports, setReports] = useState<Report[]>([]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    awaiting: 0,
    highRisk: 0,
    completed: 0,
  });

  const [user, setUser] = useState<User | null>(null);

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

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) return;

    // FETCH USER
    fetch(`http://localhost:5000/api/lab_assistant/get-by-id/${userId}`)
      .then((res) => res.json())
      .then((data: User) => setUser(data))
      .catch((err) => console.error("Fetch error:", err));

    // FETCH REPORTS
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        console.log("API reports:", data);

        const mapped: Report[] = data.map((item: any) => ({
          id: item.prediction_id,

          name: item.user_name || "Patient",

          date: new Date(item.created_at).toLocaleDateString(),

          risk: mapRisk(item.result),

          respond_type: item.respond_type,

          medical_image: item.medical_image,

          result: item.result,

          created_at: item.created_at,
        }));

        setReports(mapped);

        const total = mapped.length;

        const highRisk = mapped.filter((r) => r.risk === "High").length;

        const awaiting = mapped.filter(
          (r) => r.respond_type === "await",
        ).length;

        const completed = mapped.filter(
          (r) => r.respond_type === "complete",
        ).length;

        setStats({
          total,
          awaiting,
          highRisk,
          completed,
        });
      })
      .catch((err) => console.error("Reports fetch error:", err));
  }, []);

  // GET SELECTED REPORT
  const getSelectedReport = () => {
    if (!selectedReport) {
      toast.error("Please select a report row");
      return null;
    }

    return selectedReport;
  };

  // DOWNLOAD IMAGE
  const handleDownloadScan = () => {
    try {
      const report = getSelectedReport();

      if (!report) return;

      if (!report.medical_image) {
        toast.error("No image found");
        return;
      }

      const link = document.createElement("a");

      link.href = `data:image/png;base64,${report.medical_image}`;

      link.download = `scan_${report.id}.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportPDF = async () => {
    try {
      const report = getSelectedReport();
      if (!report) return;

           // 1. FETCH FEEDBACK FIRST
      let feedbackData = null;

      try {
        const res = await fetch(
          `http://localhost:5000/api/patient/complete-feedback/${report.id}`,
        );
        const data = await res.json();

        if (data?.success) {
          feedbackData = data.data;
        }
      } catch (err) {
        console.error("Feedback fetch error:", err);
      }

      // ✅ load only in browser (fixes "self is not defined")
      const html2pdf = (await import("html2pdf.js")).default;

      const element = document.createElement("div");

      element.innerHTML = `
      <div
        style="
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #1f2937;
          background: #ffffff;
          max-width: 800px;
          margin: auto;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        "
      >

        <div
          style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:30px;
            border-bottom:2px solid #7c3aed;
            padding-bottom:20px;
          "
        >
          <div>
            <h1 style="color:#7c3aed;font-size:32px;margin:0;">
              Medical Report
            </h1>

            <p style="color:#6b7280;margin-top:8px;font-size:14px;">
              AI Lung Cancer Detection System
            </p>
          </div>
        </div>

        <div
          style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:20px;
            margin-bottom:30px;
          "
        >
          <div
            style="
              background:#f9fafb;
              padding:16px;
              border-radius:12px;
              border:1px solid #e5e7eb;
            "
          >
            <p style="margin:0;color:#6b7280;font-size:13px;">
              Patient Name
            </p>
            <h3 style="margin-top:6px;">
              ${report.name}
            </h3>
          </div>

                     ${
             feedbackData
               ? `
              <div style="padding:15px;border:1px solid #ddd;border-radius:10px;">
                <p><b>Doctor:</b> ${feedbackData.doctor_name}</p>
                <p><b>Comment:</b> ${feedbackData.comment}</p>
                <p style="font-size:12px;color:gray;">
                  ${formatDateTime(feedbackData.created_at)}
                </p>
              </div>
            `
               : `<p style="color:gray;">No feedback available</p>`
           }

          <div
            style="
              background:#f9fafb;
              padding:16px;
              border-radius:12px;
              border:1px solid #e5e7eb;
            "
          >
            <p style="margin:0;color:#6b7280;font-size:13px;">
              Scan Date
            </p>
            <h3 style="margin-top:6px;">
              ${formatDateTime(report.created_at ?? "")}
            </h3>
          </div>
        </div>

        <div
          style="
            background:#fef2f2;
            border:1px solid #fecaca;
            padding:20px;
            border-radius:14px;
            margin-bottom:30px;
          "
        >
          <h2 style="margin-top:0;color:#b91c1c;">
            Diagnosis Result
          </h2>

          <p style="font-size:16px;line-height:1.7;">
            ${report.result}
          </p>
        </div>

        <div style="text-align:center;">
          <h2 style="color:#374151;margin-bottom:20px;">
            Medical Scan
          </h2>

          <img
            src="data:image/png;base64,${report.medical_image}"
            width="320"
            style="
              border-radius:16px;
              border:2px solid #d1d5db;
              padding:8px;
              background:white;
            "
          />
        </div>

        <div
          style="
            margin-top:40px;
            text-align:center;
            color:#9ca3af;
            font-size:12px;
            border-top:1px solid #e5e7eb;
            padding-top:20px;
          "
        >
          Generated automatically by AI System
        </div>

      </div>
    `;

      html2pdf()
        .from(element)
        .set({
          margin: 10,
          filename: `medical_report_${report.id}.pdf`,
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .save();
    } catch (error) {
      console.error(error);
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);

    return date.toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-purple-100 text-gray-900">
      {/* SIDEBAR */}
      <div className="w-24 md:w-64 bg-purple-200 p-3 flex flex-col gap-4">
        {/* PROFILE */}
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
          text="Lab Assistant Dashboard"
          href="/lab-assistant-dashboard/labassistant"
          active
        />
        <SidebarItem
          icon={<FaFileAlt />}
          text="Reports"
          href="/lab-assistant-dashboard/reports"
        />
        <SidebarItem
          icon={<FaBell />}
          text="Notifications"
          href="/lab-assistant-dashboard/notification"
        />
        <SidebarItem
          icon={<FaCog />}
          text="Settings"
          href="/lab-assistant-dashboard/settings"
        />
        <LogoutButton redirectPath="/lab-assistant-login" />
      </div>

      {/* MAIN */}
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold">Reports</h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={<FileText size={18} />}
            text={`Total Reports ${stats.total}`}
          />

          <StatCard
            icon={<Clock size={18} />}
            text={`Awaiting Reviews ${stats.awaiting}`}
          />

          <StatCard
            icon={<AlertTriangle size={18} />}
            text={`High-Risk Detected ${stats.highRisk}`}
          />

          <StatCard
            icon={<CheckCircle size={18} />}
            text={`Reports Completed ${stats.completed}`}
          />
        </div>

        {/* SEARCH */}
        <div className="flex flex-col md:flex-row gap-3 bg-purple-200 p-4 rounded-xl">
          <div className="flex items-center bg-white rounded-lg px-3 flex-1">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 outline-none"
            />
          </div>

          <button className="bg-white px-6 py-2 rounded-lg hover:bg-gray-100 transition">
            Search
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-purple-200 p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-3">Recent Reports</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-300">
                <tr>
                  <th className="p-2">Scan ID</th>

                  <th className="p-2">Patient Name</th>

                  <th className="p-2">Scan Date</th>

                  <th className="p-2">Risk Level</th>

                  <th className="p-2">Status</th>

                  <th className="p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedReport(row)}
                    className={`text-center border-t cursor-pointer transition ${
                      selectedReport?.id === row.id
                        ? "bg-purple-300"
                        : "hover:bg-purple-100"
                    }`}
                  >
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

                    {/* STATUS */}
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          row.respond_type === "await"
                            ? "bg-yellow-200"
                            : "bg-green-200"
                        }`}
                      >
                        {row.respond_type}
                      </span>
                    </td>

                    {/* VIEW */}
                    <td className="p-2">
                      <a
                        href={`/lab-assistant-dashboard/view-report/${row.id}`}
                        className="bg-blue-200 px-3 py-1 rounded hover:bg-blue-300 transition"
                      >
                        View Report
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col md:flex-row gap-4 bg-purple-300 p-4 rounded-xl justify-end">
          <button
            onClick={handleDownloadScan}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Download size={16} />
            Download Selected Scan
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FileDown size={16} />
            Export Selected Report
          </button>
        </div>
      </main>
      <Toaster position="top-center" />
    </div>
  );
};

export default ReportsPage;
