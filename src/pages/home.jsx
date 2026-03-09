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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

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
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div
          className="position-fixed w-100 h-100 top-0 start-0 bg-dark opacity-50"
          style={{ zIndex: 1040, backdropFilter: "blur(4px)" }}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`sidebar-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
        style={{
          width: "290px",
          position: window.innerWidth <= 768 ? "fixed" : "relative",
          height: "100vh",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 1050,
          borderRight: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {/* SIDEBAR LOGO */}
        <div className="p-4 d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center">
            <div
              className="bg-primary rounded-4 d-flex align-items-center justify-content-center shadow-lg"
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              }}
            >
              <span className="text-white fw-bold fs-5">ABC</span>
            </div>
            <div className="ms-3">
              <h5
                className="mb-0 fw-bold text-dark tracking-tighter"
                style={{ fontSize: "1.2rem" }}
              >
                PORTAL <span className="text-primary">2.0</span>
              </h5>
              <small
                className="text-muted fw-medium"
                style={{ fontSize: "0.75rem" }}
              >
                University System
              </small>
            </div>
          </div>
          <button
            className="btn d-md-none p-0 border-0"
            onClick={() => setIsSidebarOpen(false)}
          >
            <i className="bi bi-x-circle-fill text-muted fs-4"></i>
          </button>
        </div>

        {/* SIDEBAR NAVIGATION */}
        <div className="px-3 flex-grow-1 overflow-auto custom-scrollbar">
          <ul className="nav flex-column gap-1 list-unstyled">
            <SidebarLink
              icon="bi-grid-fill"
              label="Dashboard"
              to="/home"
              active={location.pathname === "/home"}
            />
            <SidebarLink
              icon="bi-calendar-event"
              label="Semester Schedule"
              to="/schedule"
              active={location.pathname === "/schedule"}
            />
            <SidebarLink
              icon="bi-book-half"
              label="Course Structure"
              to="/course-structure"
              active={location.pathname === "/course-structure"}
            />

            <div className="px-3 mt-4 mb-2">
              <p
                className="text-muted fw-bold text-uppercase m-0"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "1.5px",
                  opacity: 0.6,
                }}
              >
                Student Life
              </p>
            </div>

            <SidebarLink
              icon="bi-wallet2"
              label="Financial Summary"
              to="/finance"
              active={location.pathname === "/finance"}
            />
            <SidebarLink
              icon="bi-award"
              label="Academic Result"
              to="/result"
              active={location.pathname === "/result"}
            />
            <button
              onClick={handleLogout}
              className="sidebar-link-logout text-danger border-0 w-100 text-start d-flex align-items-center p-3 rounded-4"
            >
              <i className="bi bi-box-arrow-right me-3 fs-4"></i>
              <span className="fw-bold">Logout Account</span>
            </button>
          </ul>
        </div>

        {/* SIDEBAR FOOTER (LOGOUT) */}
        {/* <div
          className="p-3 border-top mt-auto"
          style={{ backgroundColor: "#fdfdfd" }}
        >
          <button
            onClick={handleLogout}
            className="sidebar-link-logout text-danger border-0 w-100 text-start d-flex align-items-center p-3 rounded-4"
          >
            <i className="bi bi-box-arrow-right me-3 fs-4"></i>
            <span className="fw-bold">Logout Account</span>
          </button>
        </div> */}
      </div>

      {/* MAIN CONTENT */}
      <div
        className="flex-grow-1 d-flex flex-column w-100 overflow-hidden shadow-sm"
        style={{ backgroundColor: "#f8fafc" }}
      >
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center p-3 p-md-4 bg-white border-bottom">
          <button
            className="btn btn-light shadow-sm rounded-4 d-flex align-items-center justify-content-center border-0"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ width: "48px", height: "48px" }}
          >
            <i
              className={`bi ${
                isSidebarOpen ? "bi-text-indent-right" : "bi-list"
              } fs-3 text-primary`}
            ></i>
          </button>

          <div className="d-flex align-items-center gap-3 bg-light p-1 ps-3 pe-2 rounded-pill shadow-sm">
            <div className="text-end d-none d-sm-block">
              <div className="text-dark fw-bold" style={{ fontSize: "1rem" }}>
                {studentInfo.name}
              </div>
              <div
                className="text-muted fw-medium"
                style={{ fontSize: "0.8rem" }}
              >
                ID: {studentInfo.userId}
              </div>
            </div>
            <div
              className="rounded-pill bg-white shadow-sm text-primary d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "40px",
                height: "40px",
                fontSize: "1.2rem",
                border: "2px solid #3b82f6",
              }}
            >
              {studentInfo.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="px-3 px-md-4 py-4 overflow-auto scroll-smooth">
          {location.pathname === "/home" ? (
            <>
              <div
                className="mb-4 p-4 p-md-5 rounded-5 text-white shadow-lg border-0 position-relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(25deg, #1e40af 0%, #3b82f6 100%)",
                }}
              >
                <div className="position-relative" style={{ zIndex: 2 }}>
                  <h1
                    className="display-6 fw-bold mb-3"
                    style={{ letterSpacing: "-1.5px" }}
                  >
                    Welcome Back, {studentInfo.name.split(" ")[0]}!
                  </h1>
                  <p
                    className="opacity-75 mb-0 fs-5 fw-light"
                    style={{ maxWidth: "550px" }}
                  >
                    Track your semester progress from your dashboard.
                  </p>
                </div>
                {/* Decorative circle */}
                {/* <div className="position-absolute bg-white opacity-10 rounded-circle shadow-lg" style={{ width: "250px", height: "250px", top: "-50px", right: "-50px" }}></div> */}
              </div>

              <div className="row g-4">
                {menuCards.map((card, index) => (
                  <div className="col-6 col-md-4 col-lg-3" key={index}>
                    <div
                      className="card border-0 shadow-sm p-4 h-100 student-card position-relative overflow-hidden"
                      onClick={() => navigate(card.path)}
                      style={{
                        borderRadius: "24px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div
                        className="mb-4 d-flex align-items-center justify-content-center rounded-4 shadow-sm"
                        style={{
                          backgroundColor: `${card.color}15`,
                          width: "65px",
                          height: "65px",
                        }}
                      >
                        <i
                          className={`bi ${card.icon} fs-2`}
                          style={{ color: card.color }}
                        ></i>
                      </div>
                      <h5
                        className="text-dark fw-bold mb-3"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {card.title}
                      </h5>
                      <div
                        className="d-flex align-items-center text-primary fw-bold"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <span>Explore</span>
                        <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-5 bg-white rounded-5 shadow-sm border text-center border-0">
              <h3 className="fw-bold text-dark">Viewing {location.pathname}</h3>
              <p className="text-muted">This module is being updated.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .sidebar-open { transform: translateX(0); box-shadow: 20px 0 60px -15px rgba(0,0,0,0.05); }
        .sidebar-closed { transform: translateX(-290px); width: 0 !important; }
        
        .student-card:hover { 
          transform: translateY(-12px); 
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.12) !important;
          background-color: #ffffff;
        }

        .sidebar-link { 
          padding: 14px 18px; 
          margin: 4px 8px;
          border-radius: 14px; 
          color: #64748b; 
          text-decoration: none; 
          display: flex; 
          align-items: center; 
          transition: all 0.3s ease; 
          font-weight: 500;
          font-size: 1.05rem;
          position: relative;
        }
        
        .sidebar-link:hover { background-color: #f1f5f9; color: #1e293b; }
        
        .sidebar-link.active { 
          background-color: #3b82f6; 
          color: white !important; 
          font-weight: 600;
          box-shadow: 0 8px 20px -6px rgba(59, 130, 246, 0.5);
        }

        .sidebar-link.active::before {
          content: "";
          position: absolute;
          left: -10px;
          top: 20%;
          bottom: 20%;
          width: 4px;
          background: #3b82f6;
          border-radius: 0 4px 4px 0;
        }

        .sidebar-link-logout {
          background-color: transparent;
          transition: all 0.2s;
        }
        .sidebar-link-logout:hover {
          background-color: #fff1f2;
          color: #e11d48 !important;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

        @media (max-width: 768px) {
          .sidebar-container { position: fixed !important; top: 0; bottom: 0; left: 0; }
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
