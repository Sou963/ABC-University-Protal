import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const NUBStudentPortal = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [studentInfo, setStudentInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedName = localStorage.getItem("studentName");
    const savedId = localStorage.getItem("studentId");

    if (savedName && savedId) {
      setStudentInfo({ name: savedName, userId: savedId });
    } else {
      navigate("/");
    }

    const handleResize = () => {
      if (window.innerWidth <= 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  useEffect(() => {
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!studentInfo) return null;

  const menuCards = [
    { title: "Semester Schedule", icon: "bi-calendar3", path: "/schedule", color: "#6366f1" },
    { title: "Semester Registration", icon: "bi-journal-check", path: "/registration", color: "#3b82f6" },
    { title: "Financial Details", icon: "bi-currency-dollar", path: "/finance", color: "#f59e0b" },
    { title: "Result Information", icon: "bi-pencil-square", path: "/result", color: "#ef4444" },
    { title: "Cost Package", icon: "bi-box-seam", path: "/cost", color: "#8b5cf6" },
    { title: "Waiver Info", icon: "bi-shield-check", path: "/waiver", color: "#10b981" },
    { title: "Payable List", icon: "bi-list-ul", path: "/payable", color: "#06b6d4" },
    { title: "All Payments", icon: "bi-hand-thumbs-up", path: "/payments", color: "#3b82f6" },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div 
          className="position-fixed w-100 h-100 top-0 start-0 bg-dark opacity-50" 
          style={{ zIndex: 1040 }}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`bg-white shadow-sm sidebar-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
        style={{
          width: "280px",
          position: window.innerWidth <= 768 ? "fixed" : "relative",
          height: "100vh",
          overflowY: "auto",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 1050,
          left: isSidebarOpen ? "0" : "-280px",
          borderRight: "1px solid #f0f0f0"
        }}
      >
        <div className="p-4 d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded-3 d-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px" }}>
              <span className="text-white fw-bold fs-6">ABC</span>
            </div>
            <h5 className="mb-0 fw-bold text-dark tracking-tight">PORTAL <span className="text-primary">2.0</span></h5>
          </div>
          <button className="btn d-md-none p-0 border-0" onClick={() => setIsSidebarOpen(false)}>
             <i className="bi bi-x-lg fs-4"></i>
          </button>
        </div>

        <div className="px-3 mt-3">
          <ul className="nav flex-column gap-2 list-unstyled">
            <SidebarLink icon="bi-grid-fill" label="Dashboard" to="/home" active={location.pathname === "/home"} />
            <SidebarLink icon="bi-calendar-event" label="Semester Schedule" to="/schedule" active={location.pathname === "/schedule"} />
            <SidebarLink icon="bi-book-half" label="Course Structure" to="/course-structure" active={location.pathname === "/course-structure"} />

            <div className="my-3 border-top mx-3 opacity-50"></div>
            <p className="text-muted small fw-bold px-3 text-uppercase mb-2" style={{ fontSize: "0.65rem", letterSpacing: "1px" }}>
              Financials
            </p>

            <SidebarLink icon="bi-wallet2" label="Financial Summary" to="/finance" active={location.pathname === "/finance"} />
            <SidebarLink icon="bi-award" label="Academic Result" to="/result" active={location.pathname === "/result"} />

            <li className="mt-5 mb-4">
              <button onClick={handleLogout} className="sidebar-link text-danger border-0 bg-transparent w-100 text-start">
                <i className="bi bi-box-arrow-right me-3 fs-5"></i>
                <span className="fw-semibold">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow-1 d-flex flex-column w-100 overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
        
        {/* HEADER (Deep White Navbar) */}
        <div className="d-flex justify-content-between align-items-center p-3 p-md-4 bg-white">
          <button
            className="btn btn-white shadow-sm rounded-3 d-flex align-items-center justify-content-center border-0"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ width: "45px", height: "45px", backgroundColor: "#ffffff", border: "1px solid #f0f0f0" }}
          >
            <i className={`bi ${isSidebarOpen ? "bi-text-indent-right" : "bi-list"} fs-4 text-primary`}></i>
          </button>

          <div className="d-flex align-items-center gap-2 gap-md-3 bg-white p-2 ps-3 pe-2 rounded-3 shadow-sm border-0" style={{ border: "1px solid #f0f0f0" }}>
            <div className="text-end d-none d-sm-block">
              <div className="text-dark fw-bold small" style={{ lineHeight: "1.1" }}>{studentInfo.name}</div>
              <div className="text-muted fw-semibold" style={{ fontSize: "0.7rem" }}>ID: {studentInfo.userId}</div>
            </div>
            <div
              className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "35px", height: "35px", fontSize: "1rem" }}
            >
              {studentInfo.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="px-3 px-md-4 pb-4 overflow-auto">
          {location.pathname === "/home" ? (
            <>
              {/* WELCOME BANNER (Shape Removed) */}
              <div
                className="mb-4 p-4 p-md-5 rounded-4 text-white border-0 position-relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)" }}
              >
                <div className="position-relative" style={{ zIndex: 2 }}>
                  <h1 className="h2 fw-bold mb-2">
                    Welcome Back, {studentInfo.name.split(" ")[0]}! 👋
                  </h1>
                  <p className="opacity-75 small mb-0">
                    Your academic overview is ready for today. Keep tracking your progress.
                  </p>
                </div>
              </div>

              {/* GRID CARDS */}
              <div className="row g-3 g-md-4">
                {menuCards.map((card, index) => (
                  <div className="col-6 col-md-4 col-lg-3" key={index}>
                    <div
                      className="card border-0 shadow-sm p-3 p-md-4 h-100 student-card"
                      onClick={() => card.path && navigate(card.path)}
                      style={{ borderRadius: "12px", cursor: "pointer", backgroundColor: "#fff", border: "1px solid #f8fafc" }}
                    >
                      <div
                        className="mb-3 d-flex align-items-center justify-content-center rounded-3"
                        style={{ backgroundColor: `${card.color}10`, width: "50px", height: "50px" }}
                      >
                        <i className={`bi ${card.icon} fs-4`} style={{ color: card.color }}></i>
                      </div>
                      <h6 className="text-dark fw-bold mb-1" style={{ fontSize: "0.9rem" }}>{card.title}</h6>
                      <div className="d-none d-md-flex align-items-center text-muted small mt-2">
                        <span>Open</span>
                        <i className="bi bi-arrow-right ms-2 transition-icon"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-4 bg-white rounded-3 shadow-sm border" style={{ borderColor: "#f0f0f0" }}>
              <h5 className="fw-bold text-dark">Module Content</h5>
              <p className="text-muted">Navigating to {location.pathname}...</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sidebar-open { transform: translateX(0); }
        .sidebar-closed { transform: translateX(-280px); width: 0 !important; min-width: 0 !important; }
        
        .student-card { transition: all 0.3s ease; }
        .student-card:hover { transform: translateY(-5px); box-shadow: 0 12px 20px rgba(0,0,0,0.05) !important; border-color: #3b82f6 !important; }

        .sidebar-link { 
          padding: 12px 16px; 
          border-radius: 8px; 
          color: #64748b; 
          text-decoration: none; 
          display: flex; 
          align-items: center; 
          transition: 0.2s; 
          font-weight: 500; 
        }
        .sidebar-link:hover { background-color: #f8fafc; color: #2563eb; }
        .sidebar-link.active { background-color: #3b82f6; color: white !important; }

        @media (max-width: 768px) {
          .sidebar-container { position: fixed !important; }
        }
      `}</style>
    </div>
  );
};

const SidebarLink = ({ icon, label, to = "#", active = false }) => (
  <li>
    <Link to={to} className={`sidebar-link ${active ? "active" : ""}`}>
      <i className={`bi ${icon} me-3 fs-5`}></i>
      <span style={{ whiteSpace: "nowrap" }}>{label}</span>
    </Link>
  </li>
);

export default NUBStudentPortal;