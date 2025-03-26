import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiPieChart, FiGrid, FiMoon, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./HRHomeScreen.css";

const OCI_PAR_TOKEN = "KlvNhT0KOfX5pjeFJaSs5VPTdiEjcCmjAdZ93FopD-8ZEM5LZivVaGEWI6N9i7o9";
const OCI_NAMESPACE = "bm5jx0spql58";
const OCI_BUCKET_NAME = "facerec-uploads";
const BASE_PAR_URL = `https://${OCI_NAMESPACE}.objectstorage.ap-mumbai-1.oci.customer-oci.com/p/${OCI_PAR_TOKEN}/n/${OCI_NAMESPACE}/b/${OCI_BUCKET_NAME}/o/`;
const ICON_URL = `${BASE_PAR_URL}Icon`;
const logoUrl = `${ICON_URL}/acl_logoACL-Logo-Black.webp`;

const HRHomeScreen = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("hr_email");
    navigate("/hr-login");
  };

  const navItemClasses = "nav-button";

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* Top Section */}
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <img
            src={logoUrl}
            alt="ACL Logo"
            className="logo cursor-pointer"
            title="ACL Digital"
            onClick={() => navigate("/hr/home")}
          />

          {/* Navigation */}
          <div className="flex flex-col space-y-4 mt-6 w-full items-center">
            <div onClick={() => navigate("/hr-dashboard")} title="Dashboard" className={navItemClasses}>
              <FiGrid size={24} />
              {!collapsed && <span>Dashboard</span>}
            </div>

            <div
              onClick={() => navigate("/hr/candidate/5/analytics")}
              title="Analytics"
              className={navItemClasses}
            >
              <FiPieChart size={24} />
              {!collapsed && <span>Analytics</span>}
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="bottom-controls">
          <button onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
            <FiMoon size={22} />
          </button>
          <button onClick={() => setCollapsed(!collapsed)} title="Collapse Sidebar">
            {collapsed ? <FiChevronRight size={22} /> : <FiChevronLeft size={22} />}
          </button>
          <div onClick={handleLogout} title="Logout">
            <FiLogOut size={22} />
            {!collapsed && <span>Logout</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        Welcome HR! Choose an option from the sidebar.
      </main>
    </div>
  );
};

export default HRHomeScreen;
