import React, { useState, useEffect } from "react";
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
  const [selectedCandidateId, setSelectedCandidateId] = useState(localStorage.getItem("selected_candidate_id") || "");
  const [candidateList, setCandidateList] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("hr_email");
    navigate("/hr-login");
  };

  const fetchCandidates = async () => {
    try {
      const response = await fetch("http://141.148.219.190:8000/api/hr/candidates");
      const data = await response.json();
      setCandidateList(data.candidates || []);
    } catch (err) {
      console.error("Failed to fetch candidates", err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const navItemClasses = "flex items-center justify-center hover:scale-110 transition-transform p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700";

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-20" : "w-64"} bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 border-r flex flex-col justify-between py-6`}>
        {/* Top Section */}
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <img
            src={logoUrl}
            alt="ACL Logo"
            className="h-10 w-10 object-contain cursor-pointer"
            title="ACL Digital"
            onClick={() => navigate("/hr/home")}
          />

          {/* Candidate Dropdown */}
          <select
            value={selectedCandidateId}
            onChange={(e) => {
              setSelectedCandidateId(e.target.value);
              localStorage.setItem("selected_candidate_id", e.target.value);
            }}
            className="w-40 p-2 text-sm rounded border bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Candidate</option>
            {candidateList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name}
              </option>
            ))}
          </select>

          {/* Navigation */}
          <div className="flex flex-col space-y-4 mt-6">
            <div onClick={() => navigate("/hr-dashboard")} title="Dashboard" className={navItemClasses}>
              <FiGrid size={24} />
              {!collapsed && <span className="ml-2 font-semibold">Dashboard</span>}
            </div>
            <div
              onClick={() => navigate(`/hr/candidate/${selectedCandidateId}/analytics`)}
              title="Analytics"
              className={`${navItemClasses} ${!selectedCandidateId && "opacity-50 pointer-events-none"}`}
            >
              <FiPieChart size={24} />
              {!collapsed && <span className="ml-2 font-semibold">Analytics</span>}
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col items-center space-y-4 mb-4">
          <button onClick={() => setDarkMode(!darkMode)} title="Toggle Theme" className={navItemClasses}>
            <FiMoon size={22} />
          </button>
          <button onClick={() => setCollapsed(!collapsed)} title="Collapse Sidebar" className={navItemClasses}>
            {collapsed ? <FiChevronRight size={22} /> : <FiChevronLeft size={22} />}
          </button>
          <div onClick={handleLogout} title="Logout" className={navItemClasses}>
            <FiLogOut size={22} />
            {!collapsed && <span className="ml-2 font-semibold">Logout</span>}
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
