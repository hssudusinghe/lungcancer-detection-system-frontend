"use client";
import React, { useEffect, useState } from "react";
import {
  Bell,
  AlertTriangle,
  Clock,
  Upload,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import { FaBell, FaCog, FaFileAlt, FaThLarge } from "react-icons/fa";
import LogoutButton from "@/app/components/logoutbtn";

/* ================= TYPES ================= */

type NotificationType = "info" | "alert" | "time" | "upload" | "done";

type Notification = {
  text: string;
  time: string;
  type: NotificationType;
  read?: boolean;
};

type FilterType = "All" | "Unread";

type User = {
  user_id: number;
  name: string;
  email: string;
  profile_image?: string | null;
};

/* ================= HELPERS ================= */

const getIcon = (type: NotificationType): React.ReactNode => {
  switch (type) {
    case "alert":
      return <AlertTriangle className="text-red-500" size={18} />;
    case "time":
      return <Clock className="text-yellow-500" size={18} />;
    case "upload":
      return <Upload className="text-green-500" size={18} />;
    case "done":
      return <FileCheck className="text-blue-500" size={18} />;
    default:
      return <Bell size={18} />;
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

/* ================= MAIN ================= */

const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>("Unread");

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      text: "Your scan report is ready",
      time: "30 mins ago",
      type: "info",
      read: false,
    },
    {
      text: "High-risk patient detected",
      time: "22 mins ago",
      type: "alert",
      read: false,
    },
    {
      text: "Scheduled follow-up scan for patient ID: 2145654",
      time: "1 hour ago",
      type: "time",
      read: true,
    },
    {
      text: "Lab Assistant uploaded a new lung scan (Patient ID: 331345)",
      time: "3 days ago",
      type: "upload",
      read: true,
    },
    {
      text: "Dr. John Doe completed review (Patient ID: 547472)",
      time: "NOW",
      type: "done",
      read: false,
    },
  ]);

  /* ================= LOGIC ================= */

  const filteredNotifications =
    filter === "Unread" ? notifications.filter((n) => !n.read) : notifications;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) return;

    fetch(`http://localhost:5000/api/lab_assistant/get-by-id/${userId}`)
      .then((res) => res.json())
      .then((data: User) => setUser(data))
      .catch((err) => console.error("Fetch error:", err));
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
          text="Lab Assistant Dashboard"
          href="/lab-assistant-dashboard/labassistant"
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
          active
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
        <h1 className="text-3xl font-bold">Notifications</h1>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <div className="flex gap-2">
            {(["All", "Unread"] as FilterType[]).map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === item ? "bg-purple-300" : "bg-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={markAllAsRead}
            className="bg-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition"
          >
            Mark All as Read <ChevronRight size={16} />
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {filteredNotifications.map((n, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-lg transition cursor-pointer ${
                n.read
                  ? "bg-purple-200 hover:bg-purple-300"
                  : "bg-white border border-purple-300"
              }`}
            >
              <div className="flex items-center gap-3">
                {getIcon(n.type)}
                <p className="text-sm">{n.text}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{n.time}</span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
