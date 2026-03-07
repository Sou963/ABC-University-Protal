import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const PayableManager = () => {
  const [courses, setCourses] = useState([]);
  const [waivers, setWaivers] = useState([]); // Waiver.jsx এর মতো স্টেট
  const [loading, setLoading] = useState(false);

  const CREDIT_RATE = 2500; 
  const loggedInStudentId = localStorage.getItem("studentId");
  const loggedInStudentName = localStorage.getItem("studentName");

  const fetchData = useCallback(async () => {
    if (!loggedInStudentId) return;
    setLoading(true);
    try {
      // ১. কোর্স ফেচ করা
      const courseRes = await fetch(`https://university-backend-ten.vercel.app/api/courses/student/${loggedInStudentId}`);
      const courseData = await courseRes.json();
      
      // ২. ওয়েভার ফেচ করা (আপনার Waiver.jsx এর API অনুযায়ী)
      const waiverRes = await fetch(`https://university-backend-ten.vercel.app/api/waiver/student/${loggedInStudentId}`);
      const waiverData = await waiverRes.json();

      if (courseRes.ok) setCourses(courseData.courses || []);
      if (waiverRes.ok) setWaivers(waiverData || []); // সরাসরি ডাটা সেট

    } catch (error) {
      console.error("Error loading financial data:", error);
    } finally {
      setLoading(false);
    }
  }, [loggedInStudentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔹 ওয়েভার পার্সেন্টেজ ক্যালকুলেশন (সবগুলো ওয়েভার যোগফল)
  const totalWaiverPercent = waivers.reduce((sum, w) => sum + Number(w.totalAllowedWaiver || 0), 0);

  // 🔹 সেমিস্টার অনুযায়ী গ্রুপিং
  const groupedData = courses.reduce((acc, course) => {
    const lvl = course.level || "Unassigned";
    if (!acc[lvl]) {
      acc[lvl] = { courses: [], totalCredits: 0, rawPayable: 0 };
    }
    acc[lvl].courses.push(course);
    acc[lvl].totalCredits += Number(course.credit || 0);
    acc[lvl].rawPayable += Number(course.credit || 0) * CREDIT_RATE;
    return acc;
  }, {});

  const levelOrder = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  const sortedLevels = Object.keys(groupedData).sort((a, b) => levelOrder.indexOf(a) - levelOrder.indexOf(b));

  // 🔹 ফাইনাল ফিন্যান্সিয়াল ক্যালকুলেশন
  const grandRawTotal = Object.values(groupedData).reduce((sum, item) => sum + item.rawPayable, 0);
  const totalWaiverAmount = (grandRawTotal * totalWaiverPercent) / 100;
  const netTotalPayable = grandRawTotal - totalWaiverAmount;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      
      {/* Summary Header Card */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-8 p-4 bg-white">
            <h4 className="fw-bold mb-1 text-dark">
               <i className="bi bi-wallet2 text-primary me-2"></i>Financial Account Statement
            </h4>
            <p className="text-muted mb-0 small">
              Student ID: <span className="fw-bold text-primary">{loggedInStudentId}</span> | 
              Name: <span className="fw-bold"> {loggedInStudentName}</span>
            </p>
            {totalWaiverPercent > 0 && (
               <div className="mt-3">
                 <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 border border-success border-opacity-25">
                   <i className="bi bi-stars me-1"></i> Active Scholarship: {totalWaiverPercent}% Off
                 </span>
               </div>
            )}
          </div>
          <div className="col-md-4 p-4 bg-primary d-flex flex-column justify-content-center text-white text-md-end">
            <small className="opacity-75 text-uppercase fw-bold tracking-wider">Net Payable Amount</small>
            <h2 className="fw-bold mb-0">৳ {netTotalPayable.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Left Side: Detailed Semester Tables */}
        <div className="col-lg-8">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : (
            sortedLevels.map((lvl) => (
              <div key={lvl} className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden animate-fade-in">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between">
                  <span className="fw-bold"><i className="bi bi-layers text-primary me-2"></i>Level: {lvl}</span>
                  <span className="text-muted small">Semester Subtotal: ৳ {groupedData[lvl].rawPayable.toLocaleString()}</span>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th className="ps-4">Course Details</th>
                        <th className="text-center">Credits</th>
                        <th className="text-end pe-4">Cost (Raw)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedData[lvl].courses.map((c, i) => (
                        <tr key={i}>
                          <td className="ps-4">
                            <span className="fw-bold d-block">{c.courseCode}</span>
                            <span className="text-muted small">{c.courseTitle}</span>
                          </td>
                          <td className="text-center">{c.credit}</td>
                          <td className="text-end pe-4 fw-semibold">৳ {(c.credit * CREDIT_RATE).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Final Calculation Breakdowns */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: "20px" }}>
            <h6 className="fw-bold text-dark mb-4 border-bottom pb-2">Billing Breakdown</h6>
            
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Total Gross Fee</span>
              <span className="fw-bold text-dark">৳ {grandRawTotal.toLocaleString()}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 align-items-center">
              <span className="text-muted small">Applied Waiver ({totalWaiverPercent}%)</span>
              <span className="badge bg-success bg-opacity-10 text-success">- ৳ {totalWaiverAmount.toLocaleString()}</span>
            </div>

            <hr className="my-4" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="h6 fw-bold mb-0">Net Payable</span>
              <span className="h4 fw-bold mb-0 text-primary">৳ {netTotalPayable.toLocaleString()}</span>
            </div>

            {/* Waiver Details List (From your WaiverInfo logic) */}
            {waivers.length > 0 && (
              <div className="bg-light p-3 rounded-3 mb-4">
                <p className="x-small fw-bold text-uppercase text-muted mb-2">Benefit Details</p>
                {waivers.map((w, idx) => (
                  <div key={idx} className="d-flex justify-content-between x-small mb-1">
                    <span>{w.waiverName}</span>
                    <span className="fw-bold">{w.totalAllowedWaiver}%</span>
                  </div>
                ))}
              </div>
            )}

            <button className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm mb-2" onClick={() => window.print()}>
              <i className="bi bi-printer me-2"></i>Download Statement
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .tracking-wider { letter-spacing: 1px; }
        .x-small { font-size: 11px; }
        @media print {
          .col-lg-4, .btn, .badge { display: none !important; }
          .col-lg-8 { width: 100% !important; }
          .card { border: 1px solid #eee !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PayableManager;
