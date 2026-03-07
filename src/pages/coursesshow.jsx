import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { apiUrl } from "../api";

const CourseManager = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const loggedInStudentId = localStorage.getItem("studentId");
  const loggedInStudentName = localStorage.getItem("studentName");

  const [formData, setFormData] = useState({
    studentId: loggedInStudentId || "",
    courseCode: "",
    courseTitle: "",
    level: "1st",
    section: "A",
    credit: "",
  });

  const loadCourses = useCallback(async () => {
    if (!loggedInStudentId) return;
    setLoading(true);
    try {
      const res = await fetch(
        apiUrl(`/api/courses/student/${loggedInStudentId}`)
      );
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  }, [loggedInStudentId]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses, loggedInStudentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        apiUrl("/api/courses/add"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        alert("Registration Successful!");
        setFormData({
          ...formData,
          courseCode: "",
          courseTitle: "",
          credit: "",
        });
        loadCourses();
        setActiveTab("all");
      }
    } catch (err) {
      alert("Server error.");
    }
  };

  // 🔹 গ্রুপিং লজিক (Level অনুযায়ী)
  const groupedCourses = courses.reduce((groups, course) => {
    const lvl = course.level || "Unassigned";
    if (!groups[lvl]) groups[lvl] = [];
    groups[lvl].push(course);
    return groups;
  }, {});

  const levelOrder = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  const sortedLevels = Object.keys(groupedCourses).sort((a, b) => {
    return levelOrder.indexOf(a) - levelOrder.indexOf(b);
  });

  const totalCredits = courses.reduce(
    (sum, course) => sum + Number(course.credit || 0),
    0
  );

  return (
    <div
      className="container-fluid p-4"
      style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark">
          <i className="bi bi-mortarboard-fill me-2 text-primary"></i>Academic
          Portal
        </h3>
        <p className="text-muted mb-0">
          Student ID:{" "}
          <span className="text-primary fw-bold">{loggedInStudentId}</span> |
          Name:{" "}
          <span className="text-primary fw-bold"> {loggedInStudentName}</span>
        </p>
      </div>

      <div className="row">
        {/* ================= LEFT SIDE: Main Content ================= */}
        <div className="col-lg-9">
          <div className="d-flex gap-2 mb-4 bg-white p-2 rounded-3 shadow-sm w-fit">
            <button
              className={`btn btn-sm px-4 py-2 rounded-2 border-0 transition-all ${
                activeTab === "new"
                  ? "btn-primary shadow-sm"
                  : "btn-light text-muted"
              }`}
              onClick={() => setActiveTab("new")}
            >
              <i className="bi bi-plus-circle me-1"></i> New Registration
            </button>
            <button
              className={`btn btn-sm px-4 py-2 rounded-2 border-0 transition-all ${
                activeTab === "all"
                  ? "btn-primary shadow-sm"
                  : "btn-light text-muted"
              }`}
              onClick={() => setActiveTab("all")}
            >
              <i className="bi bi-collection me-1"></i> My Curriculum
            </button>
          </div>

          <div className="card shadow-sm border-0 p-4 rounded-4 bg-white mb-4">
            {/* --- New Registration Form --- */}
            {activeTab === "new" && (
              <div className="animate-fade-in">
                <h5 className="mb-4 fw-bold text-dark border-bottom pb-2">
                  Add New Course
                </h5>
                <form onSubmit={handleSubmit} className="row g-4">
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-muted">
                      LEVEL
                    </label>
                    <select
                      className="form-select bg-light border-0"
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                    >
                      {levelOrder.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl} Level
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-muted">
                      COURSE CODE
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0"
                      placeholder="CSE-1101"
                      value={formData.courseCode}
                      onChange={(e) =>
                        setFormData({ ...formData, courseCode: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-muted">
                      COURSE TITLE
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0"
                      placeholder="Object Oriented Programming"
                      value={formData.courseTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          courseTitle: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      SECTION
                    </label>
                    <select
                      className="form-select bg-light border-0"
                      value={formData.section}
                      onChange={(e) =>
                        setFormData({ ...formData, section: e.target.value })
                      }
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      CREDITS
                    </label>
                    <input
                      type="number"
                      className="form-control bg-light border-0"
                      value={formData.credit}
                      onChange={(e) =>
                        setFormData({ ...formData, credit: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-12 pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary px-5 rounded-pill shadow"
                    >
                      Enroll Course
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* --- My Curriculum (With Section) --- */}
            {activeTab === "all" && (
              <div className="animate-fade-in">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                  </div>
                ) : sortedLevels.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    No courses registered yet.
                  </div>
                ) : (
                  sortedLevels.map((lvl) => (
                    <div
                      key={lvl}
                      className="mb-4 border rounded-3 overflow-hidden shadow-sm"
                    >
                      <div className="bg-primary bg-opacity-10 px-3 py-2 fw-bold d-flex justify-content-between align-items-center">
                        <span className="text-primary">
                          <i className="bi bi-layers me-2"></i>Level: {lvl}
                        </span>
                        <span className="badge bg-primary rounded-pill">
                          {groupedCourses[lvl].length} Courses
                        </span>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                          <thead className="table-light small text-uppercase text-muted">
                            <tr>
                              <th className="px-3">Code</th>
                              <th>Course Title</th>
                              <th className="text-center">Section</th>{" "}
                              {/* 🔹 সেকশন কলাম */}
                              <th className="text-center">Credit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {groupedCourses[lvl].map((c, i) => (
                              <tr key={i}>
                                <td className="px-3 fw-bold text-dark">
                                  {c.courseCode}
                                </td>
                                <td>{c.courseTitle}</td>
                                <td className="text-center">
                                  <span className="badge bg-light text-dark border">
                                    {c.section}
                                  </span>{" "}
                                  {/* 🔹 সেকশন ডিসপ্লে */}
                                </td>
                                <td className="text-center fw-semibold">
                                  {c.credit}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT SIDE: Summary Panel ================= */}
        <div className="col-lg-3">
          <div
            className="card shadow-sm border-0 rounded-4 p-4 sticky-top"
            style={{ top: "20px", backgroundColor: "#fff" }}
          >
            <h6 className="fw-bold text-dark mb-4 border-bottom pb-2">
              Academic Summary
            </h6>

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span className="small text-muted">Total Courses</span>
                <span className="fw-bold">{courses.length}</span>
              </div>
              <div className="progress" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-success"
                  style={{
                    width: `${Math.min((courses.length / 40) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span className="small text-muted">Total Credits</span>
                <span className="fw-bold text-primary">{totalCredits}</span>
              </div>
              <div className="progress" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-primary"
                  style={{
                    width: `${Math.min((totalCredits / 160) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-light p-3 rounded-3">
              <p className="small text-muted mb-2">
                <i className="bi bi-info-circle me-1"></i> Quick Count
              </p>
              {sortedLevels.map((lvl) => (
                <div
                  key={lvl}
                  className="d-flex justify-content-between small mb-1"
                >
                  <span>Level {lvl}</span>
                  <span className="badge bg-white text-dark border">
                    {groupedCourses[lvl].length}
                  </span>
                </div>
              ))}
            </div>

            <button
              className="btn btn-outline-primary btn-sm w-100 mt-4 rounded-pill"
              onClick={() => window.print()}
            >
              <i className="bi bi-printer me-1"></i> Download PDF
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .w-fit { width: fit-content; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .table-hover tbody tr:hover { background-color: #f8fafc; }
      `}</style>
    </div>
  );
};

export default CourseManager;
