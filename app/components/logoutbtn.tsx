"use client";

import React, { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";

type LogoutButtonProps = {
  redirectPath?: string;
};

const LogoutButton = ({
  redirectPath = "/patient-dashboard/patient",
}: LogoutButtonProps) => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("action");
    localStorage.removeItem("user_id");

    console.log("Logged out from:", pathname);

    router.push(redirectPath);
  };

  return (
    <>
      <button onClick={() => setShowLogoutPopup(true)} className="w-full">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-100 text-red-600">
          <FaSignOutAlt />
          <span>Log out</span>
        </div>
      </button>

      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[320px]">
            <h2 className="text-xl font-bold mb-2">Confirm Logout</h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;
