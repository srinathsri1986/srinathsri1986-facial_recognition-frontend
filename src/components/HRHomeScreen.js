import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const iconBaseUrl = "https://your-bucket-url/icons"; // 🔁 Replace with your bucket URL
const logoUrl = "https://bm5jx0spql58.objectstorage.ap-mumbai-1.oci.customer-oci.com/n/bm5jx0spql58/b/facerec-uploads/o/Icon%2Facl_logoACL-Logo-Black.webp";

const HRHomeScreen = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("hr_email");
    navigate("/hr-login");
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-20" : "w-64"} bg-white dark:bg-gray-800 shadow-lg flex flex-col justify-between items-center py-6 transition-all duration-300 border-r`}>
        <div className="flex flex-col items-center space-y-8 w-full">
          {/* Logo with Tooltip */}
          <div
            className="w-10 h-10 mb-4 cursor-pointer"
            title="ACL Digital"
            onClick={() => navigate("/hr/home")}
          >
            <img
              src={logoUrl}
              alt="ACL Logo"
              className="object-contain w-full h-full rounded-full"
            />
          </div>

          {/* Navigation Icons */}
          <div className="space-y-6">
            <div
              onClick={() => navigate("/hr-dashboard")}
              title="HR Dashboard"
              className="cursor-pointer hover:scale-110 transition-transform"
            >
              <img src={`${iconBaseUrl}/dashboard-icon.png`} alt="Dashboard" className="w-8 h-8 object-contain" />
            </div>

            <div
              onClick={() => navigate("/hr/analytics")}
              title="Analytics"
              className="cursor-pointer hover:scale-110 transition-transform"
            >
              <img src={`${iconBaseUrl}/analytics-icon.png`} alt="Analytics" className="w-8 h-8 object-contain" />
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col items-center space-y-4">
          <button
            title="Toggle Theme"
            onClick={() => setDarkMode(!darkMode)}
            className="text-xs p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            🌓
          </button>

          <button
            title="Collapse Sidebar"
            onClick={() => setCollapsed(!collapsed)}
            className="text-xs p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>

          <div
            onClick={handleLogout}
            title="Sign Out"
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <img src={`${iconBaseUrl}/logout-icon.png`} alt="Logout" className="w-7 h-7 object-contain" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center text-xl font-semibold">
        Welcome HR! Choose an option from the sidebar.
      </main>
    </div>
  );
};

export default HRHomeScreen;
