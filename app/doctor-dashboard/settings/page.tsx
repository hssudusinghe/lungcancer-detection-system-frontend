"use client";

import LogoutButton from "@/app/components/logoutbtn";
import React, { useEffect, useState } from "react";
import { FaBell, FaCog, FaFileAlt, FaThLarge } from "react-icons/fa";
import { FiBell, FiSearch } from "react-icons/fi";

type User = {
  user_id: number;
  name: string;
  email: string;
  profile_image?: string | null;
};

type ToggleProps = {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

/* ================= COMPONENTS ================= */

const Toggle: React.FC<ToggleProps> = ({ checked, setChecked }) => {
  return (
    <div
      onClick={() => setChecked((prev) => !prev)}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
        checked ? "bg-purple-400" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full transform transition ${
          checked ? "translate-x-6" : ""
        }`}
      />
    </div>
  );
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

const SettingsPage: React.FC = () => {
  const [twoFA, setTwoFA] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<boolean>(true);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) return;

    fetch(`http://localhost:5000/api/doctor/get-by-id/${userId}`)
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
          text="Doctor Dashboard"
          href="/doctor-dashboard/doctor"
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
          active
        />
        <LogoutButton redirectPath="/doctor-login" />
      </div>

      {/* MAIN */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Settings</h1>
   
        </div>

        {/* CARD */}
        <div className="bg-purple-200 p-6 rounded-2xl max-w-3xl space-y-6">
          {/* PROFILE */}
          <div>
            <h2 className="font-semibold mb-3">Profile Settings</h2>
            <div className="flex justify-between items-center bg-white p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center">
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

                <div>
                  <p className="font-semibold">{user?.name || "Loading..."}</p>
                  <p className="text-sm text-gray-600">{user?.email || ""}</p>
                </div>
              </div>
              <a
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
                href="/doctor-dashboard/update"
              >
                Edit Profile
              </a>
            </div>
          </div>

          {/* SECURITY */}
          <div>
            <h2 className="font-semibold mb-3">Security Settings</h2>
            <div className="bg-white rounded-lg divide-y">
              <a
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                href="/doctor-dashboard/change-password"
              >
                <span>Change Password</span>
                <span>›</span>
              </a>

              <div className="flex justify-between items-center p-4">
                <span>Two-Factor Authentication</span>
                <Toggle checked={twoFA} setChecked={setTwoFA} />
              </div>
            </div>
          </div>

          {/* PREFERENCES */}
          <div>
            <h2 className="font-semibold mb-3">Preferences</h2>
            <div className="bg-white rounded-lg divide-y">
              <div className="flex justify-between items-center p-4">
                <span>Notifications</span>
                <Toggle checked={notifications} setChecked={setNotifications} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
