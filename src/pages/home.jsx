import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const NUBStudentPortal = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [studentInfo, setStudentInfo] = useState(null);
  const navigate = useNavigate();

  // 🔹 লগইন চেক এবং ডাটা লোড করা
  useEffect(() => {
    const savedName = localStorage.getItem("studentName");
    const savedId = localStorage.getItem("studentId");

    if (savedName && savedId) {
      setStudentInfo({ name: savedName, userId: savedId });
    } else {
      // যদি ডাটা না থাকে তবে লগইন পেজে পাঠিয়ে দিবে
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ডাটা লোড হওয়ার আগে কিছু দেখাবে না (বা একটি স্পিনার দিতে পারেন)
  if (!studentInfo) return null;

  const menuCards = [
    {
      title: "Semester Schedule",
      icon: "bi-calendar3",
      path: "/schedule",
      color: "#6366f1",
    },
    {
      title: "Semester Registration",
      icon: "bi-journal-check",
      path: "/registration",
      color: "#3b82f6",
    },
    {
      title: "Financial Details",
      icon: "bi-currency-dollar",
      path: "/finance",
      color: "#f59e0b",
    },
    {
      title: "Result Information",
      icon: "bi-pencil-square",
      path: "/result",
      color: "#ef4444",
    },
    {
      title: "Cost Package",
      icon: "bi-box-seam",
      path: "/cost",
      color: "#8b5cf6",
    },
    {
      title: "Waiver Info",
      icon: "bi-shield-check",
      path: "/waiver",
      color: "#10b981",
    },
    {
      title: "Payable List",
      icon: "bi-list-ul",
      path: "/payable",
      color: "#06b6d4",
    },
    {
      title: "All Payments",
      icon: "bi-hand-thumbs-up",
      path: "/payments",
      color: "#3b82f6",
    },
  ];

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}
    >
      {/* SIDEBAR */}
      <div
        className={`${isSidebarOpen ? "d-block" : "d-none"}`}
        style={{
          width: "280px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        <div className="p-4 d-flex align-items-center mb-2">
          <div
            className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{ width: "35px", height: "35px" }}
          >
            <span className="text-white fw-bold small">NUB</span>
          </div>
          <h5 className="mb-0 fw-bold text-dark letter-spacing-1">
            PORTAL <span className="text-primary">2.0</span>
          </h5>
        </div>

        <div className="px-3 mt-4">
          <ul className="nav flex-column gap-1 list-unstyled">
            <SidebarLink icon="bi-grid" label="Dashboard" active />
            <SidebarLink
              icon="bi-calendar3"
              label="Semester Schedule"
              to="/schedule"
            />
            <SidebarLink icon="bi-book" label="Course Structure" />
            <div className="my-3 border-top mx-3"></div>
            <p
              className="text-muted small fw-bold px-3 text-uppercase"
              style={{ fontSize: "0.7rem" }}
            >
              Financials
            </p>
            <SidebarLink icon="bi-wallet2" label="Financial Summary" />
            <SidebarLink icon="bi-award" label="Academic Result" />

            {/* Logout Button in Sidebar */}
            <li className="mt-4">
              <button
                onClick={handleLogout}
                className="sidebar-link text-danger border-0 bg-transparent w-100 text-start"
              >
                <i className="bi bi-box-arrow-right me-3"></i>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* NAVBAR */}
        <nav className="navbar navbar-expand px-4 py-3 bg-white border-bottom shadow-sm">
          <button
            className="btn btn-link text-muted p-0 me-3"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className="bi bi-list fs-2"></i>
          </button>

          <div className="ms-auto d-flex align-items-center gap-4">
            <div className="text-end d-none d-md-block">
              <div className="text-dark fw-bold small">{studentInfo.name}</div>
              <div
                className="text-primary fw-semibold"
                style={{ fontSize: "0.7rem" }}
              >
                ID: {studentInfo.userId}
              </div>
            </div>
            {/* 🔹 ডাইনামিক অ্যাভাটার (নামের প্রথম অক্ষর দিয়ে) */}
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "45px", height: "45px" }}
            >
              {studentInfo.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </nav>

        {/* BODY */}
        <div className="p-4 overflow-auto">
          {/* WELCOME BANNER */}
          <div
            className="mb-4 p-5 rounded-4 text-white shadow-sm border-0"
            style={{
              background: "linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)",
            }}
          >
            <h1 className="display-5 fw-bold mb-2">
              Welcome Back, {studentInfo.name.split(" ")[0]}!
            </h1>
            <p className="opacity-75 fs-5 mb-0">
              Your academic overview is ready for today.
            </p>
          </div>

          {/* GRID CARDS */}
          <div className="row g-4">
            {menuCards.map((card, index) => (
              <div className="col-12 col-sm-6 col-lg-3" key={index}>
                <div
                  className="card border-0 shadow-sm p-4 h-100 student-card"
                  onClick={() => card.path && navigate(card.path)}
                  style={{
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                >
                  <div
                    className="mb-3 d-inline-block p-3 rounded-4"
                    style={{
                      backgroundColor: `${card.color}15`,
                      width: "fit-content",
                    }}
                  >
                    <i
                      className={`bi ${card.icon} fs-2`}
                      style={{ color: card.color }}
                    ></i>
                  </div>
                  <h6 className="text-dark fw-bold mb-1">{card.title}</h6>
                  <p className="text-muted small mb-0">Open Module</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .student-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; border-left: 4px solid #3b82f6 !important; }
        .sidebar-link { padding: 10px 15px; border-radius: 8px; color: #4b5563; text-decoration: none; display: flex; align-items: center; transition: 0.2s; font-weight: 500; }
        .sidebar-link:hover { background-color: #f3f4f6; color: #2563eb; }
        .sidebar-link.active { background-color: #eff6ff; color: #2563eb; font-weight: 600; }
      `}</style>
    </div>
  );
};

const SidebarLink = ({ icon, label, to = "#", active = false }) => (
  <li>
    <Link to={to} className={`sidebar-link ${active ? "active" : ""}`}>
      <i className={`bi ${icon} me-3`}></i>
      <span>{label}</span>
    </Link>
  </li>
);

export default NUBStudentPortal;
