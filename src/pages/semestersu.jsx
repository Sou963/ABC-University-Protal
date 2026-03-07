import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const SemesterTable = () => {
  const [semesterData, setSemesterData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetch("https://university-backend-ten.vercel.app/api/semester/show");
      const result = await res.json();
      const chronologicalData = result.data ? [...result.data].reverse() : [];
      setSemesterData(chronologicalData);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", background: "#ffffff" }}
      >
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ background: "#ffffff", minHeight: "100vh" }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1
            className="fw-bold mb-1"
            style={{ letterSpacing: "-1px", color: "#1e293b" }}
          >
            Academic <span style={{ color: "#2563eb" }}>Portal</span>
          </h1>
          <div
            className="mx-auto"
            style={{ width: "50px", height: "3px", background: "#2563eb" }}
          ></div>
        </div>

        {semesterData.map((s, index) => {
          const isActive = index === 0;

          return (
            <div
              key={s._id}
              className="card border-0 shadow-sm mb-5 rounded-4 overflow-hidden"
              style={{ border: "1px solid #e2e8f0" }}
            >
              {/* Header Strip */}
              <div
                className="p-4 d-flex justify-content-between align-items-center"
                style={{ background: isActive ? "#2563eb" : "#475569" }}
              >
                <h4 className="m-0 fw-bold text-white">
                  {s.semesterName || "Unnamed Semester"}
                </h4>
                <span
                  className={`badge rounded-pill px-3 py-2 ${
                    isActive
                      ? "bg-white text-primary"
                      : "bg-secondary text-white"
                  }`}
                >
                  {isActive ? "ACTIVE" : "PREVIOUS"}
                </span>
              </div>

              {/* Data Body - Equally Spaced Pillars */}
              <div className="card-body p-4 p-md-5">
                <div className="row g-0">
                  {/* Column 1: Enrollment */}
                  <div className="col-lg-4 px-4 border-end">
                    <div className="d-flex flex-column h-100 justify-content-between">
                      <h6 className="fw-bold text-primary text-uppercase mb-4">
                        Enrollment
                      </h6>
                      <DataPoint
                        label="Registration"
                        value={`${formatDate(
                          s.registrationStartDate
                        )} - ${formatDate(s.registrationEndDate)}`}
                      />
                      <DataPoint
                        label="Add / Drop"
                        value={`${formatDate(
                          s.addDropStartDate
                        )} - ${formatDate(s.addDropEndDate)}`}
                      />
                      <DataPoint
                        label="Drop Deadline"
                        value={formatDate(s.semesterDropLastDate)}
                      />
                    </div>
                  </div>

                  {/* Column 2: Academics */}
                  <div className="col-lg-4 px-4 border-end">
                    <div className="d-flex flex-column h-100 justify-content-between">
                      <h6 className="fw-bold text-success text-uppercase mb-4">
                        Academics
                      </h6>
                      <DataPoint
                        label="Classes Start"
                        value={formatDate(s.classStartDate)}
                      />
                      <DataPoint
                        label="Mid-Term Phase"
                        value={`${formatDate(
                          s.midTermStartDate
                        )} - ${formatDate(s.midTermEndDate)}`}
                      />
                      <DataPoint
                        label="Final Exam Phase"
                        value={`${formatDate(
                          s.finalExamStartDate
                        )} - ${formatDate(s.finalExamEndDate)}`}
                      />
                    </div>
                  </div>

                  {/* Column 3: Finance */}
                  <div className="col-lg-4 px-4">
                    <div className="d-flex flex-column h-100 justify-content-between">
                      <h6 className="fw-bold text-warning text-uppercase mb-4">
                        Finance
                      </h6>
                      <DataPoint
                        label="1st Installment (40%)"
                        value={formatDate(s.firstInstallmentLastDate)}
                      />
                      <DataPoint
                        label="2nd Installment (30%)"
                        value={formatDate(s.secondInstallmentLastDate)}
                      />
                      <DataPoint
                        label="3rd Installment (30%)"
                        value={formatDate(s.thirdInstallmentLastDate)}
                      />
                      <DataPoint
                        label="TER Fill-up"
                        value={formatDate(s.terFillUpStartDate)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Sub-component with consistent spacing
const DataPoint = ({ label, value }) => (
  <div className="py-3">
    <div
      className="small text-muted text-uppercase fw-bold mb-1"
      style={{ fontSize: "0.65rem" }}
    >
      {label}
    </div>
    <div className="fw-bold text-dark">{value}</div>
  </div>
);

export default SemesterTable;
