import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { apiUrl } from "../api";

const StudentResults = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loggedInStudentId = localStorage.getItem("studentId");
  const loggedInStudentName = localStorage.getItem("studentName");

  const fetchResults = useCallback(async () => {
    if (!loggedInStudentId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        apiUrl(`/api/courses/student/${loggedInStudentId}`)
      );
      const data = await response.json();
      if (response.ok && data.courses) {
        setCourses(data.courses);
      } else {
        setError("No result records found for this student.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [loggedInStudentId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults, loggedInStudentId]);

  // GPA calculation logic
  const calculateCGPA = () => {
    const gradedCourses = courses.filter((c) => c.result?.gradePoint != null);
    if (gradedCourses.length === 0) return "0.00";
    const totalPoints = gradedCourses.reduce(
      (acc, curr) => acc + curr.result.gradePoint * (curr.credit || 3),
      0
    );
    const totalCredits = gradedCourses.reduce(
      (acc, curr) => acc + (curr.credit || 3),
      0
    );
    return (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <div className="results-page-bg">
      <div className="container py-5">
        {/* Profile & Summary Header */}
        <div className="row mb-4 animate-fade-in">
          <div className="col-lg-8">
            <div className="d-flex align-items-center mb-3">
              <div className="result-icon-box me-3">
                <i className="bi bi-mortarboard-fill text-white fs-3"></i>
              </div>
              <div>
                <h2 className="fw-bold text-dark mb-0">
                  {loggedInStudentName}
                </h2>
                <p className="text-muted mb-0">
                  Academic Record • ID: {loggedInStudentId}
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 text-lg-end">
            <div className="cgpa-card shadow-sm border-0 card p-3 bg-white rounded-4">
              <span className="text-uppercase small fw-bold text-muted tracking-widest">
                Current CGPA
              </span>
              <h2 className="fw-bold text-primary mb-0">{calculateCGPA()}</h2>
            </div>
          </div>
        </div>

        {/* Results Table Section */}
        <div className="card border-0 shadow-lg rounded-5 overflow-hidden animate-slide-up">
          <div className="card-header bg-white py-4 px-4 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 text-dark">
              Semester Wise Grade Sheet
            </h5>
            <button
              className="btn btn-primary rounded-pill px-4 btn-sm"
              onClick={() => window.print()}
            >
              <i className="bi bi-printer me-2"></i> Print Transcript
            </button>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
                <p className="mt-2 text-muted">Fetching academic records...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5 p-4">
                <i className="bi bi-clipboard-x fs-1 text-muted"></i>
                <h6 className="mt-3 text-dark fw-bold">{error}</h6>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 result-table">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-4">Course Info</th>
                      <th>Level/Semester</th>
                      <th>Section</th>
                      <th>Credit</th>
                      <th>Mark</th>
                      <th>Grade</th>
                      <th className="pe-4 text-center">GP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c, index) => (
                      <tr key={index}>
                        <td className="ps-4 py-3">
                          <div className="fw-bold text-dark">
                            {c.courseTitle}
                          </div>
                          <small className="text-muted font-monospace">
                            {c.courseCode}
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border fw-normal">
                            {c.level || "N/A"}
                          </span>
                        </td>
                        <td>{c.section || "-"}</td>
                        <td className="fw-semibold">{c.credit || "3.0"}</td>
                        <td>{c.result?.mark || "-"}</td>
                        <td>
                          <span
                            className={`grade-badge ${getGradeColor(
                              c.result?.grade
                            )}`}
                          >
                            {c.result?.grade || "N/A"}
                          </span>
                        </td>
                        <td className="pe-4 text-center fw-bold text-primary">
                          {c.result?.gradePoint?.toFixed(2) || "0.00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Notice Footer */}
        <div className="mt-4 text-center">
          <p className="text-muted small">
            <i className="bi bi-info-circle me-1"></i>
            This is a computer-generated transcript. For official verification,
            please contact the Controller of Examinations.
          </p>
        </div>
      </div>

      <style>{`
        .results-page-bg {
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: 'Inter', sans-serif;
        }

        .result-icon-box {
          width: 60px; height: 60px;
          background: #0d6efd;
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 20px rgba(13, 110, 253, 0.2);
        }

        .cgpa-card { border-left: 5px solid #0d6efd !important; }

        .result-table thead th {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #64748b;
          border: none;
          padding: 15px 10px;
        }

        .grade-badge {
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 12px;
        }
        
        /* Grade Colors */
        .grade-a { background: #dcfce7; color: #166534; }
        .grade-b { background: #dbeafe; color: #1e40af; }
        .grade-f { background: #fee2e2; color: #991b1b; }
        .grade-default { background: #f1f5f9; color: #475569; }

        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
        .animate-slide-up { animation: slideUp 0.6s ease-out; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @media print {
          .btn, .results-page-bg { background: white !important; }
          .card { box-shadow: none !important; border: 1px solid #ddd; }
          .results-page-bg { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
};

// Helper function to color code grades
const getGradeColor = (grade) => {
  if (!grade) return "grade-default";
  if (grade.startsWith("A")) return "grade-a";
  if (grade.startsWith("B")) return "grade-b";
  if (grade === "F") return "grade-f";
  return "grade-default";
};

export default StudentResults;
