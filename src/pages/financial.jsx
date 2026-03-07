import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { apiUrl } from "../api";

const FinancialReport = () => {
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [waivers, setWaivers] = useState([]); // ওয়েভার ডাটা স্টোর করার জন্য

  const CREDIT_RATE = 2500;
  const loggedInStudentId = localStorage.getItem("studentId");
  const loggedInStudentName = localStorage.getItem("studentName");

  const fetchData = useCallback(async () => {
    if (!loggedInStudentId) return;
    try {
      // ১. কোর্স লিস্ট ফেচ (Payable)
      const courseRes = await fetch(
        apiUrl(`/api/courses/student/${loggedInStudentId}`)
      );
      const courseData = await courseRes.json();

      // ২. পেমেন্ট লিস্ট ফেচ (Paid)
      const paymentRes = await fetch(
        apiUrl(`/api/payment/student/${loggedInStudentId}`)
      );
      const paymentData = await paymentRes.json();

      // ৩. ওয়েভার ডাটা ফেচ (Waiver.jsx এর মতো)
      const waiverRes = await fetch(
        apiUrl(`/api/waiver/student/${loggedInStudentId}`)
      );
      const waiverData = await waiverRes.json();

      if (courseRes.ok) setCourses(courseData.courses || []);
      if (paymentRes.ok) setPayments(paymentData.payments || []);
      if (waiverRes.ok) setWaivers(waiverData || []);
    } catch (error) {
      console.error("Data loading error:", error);
    }
  }, [loggedInStudentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, loggedInStudentId]);

  // --- Financial Calculations ---
  const rawTotalPayable = courses.reduce(
    (sum, c) => sum + Number(c.credit || 0) * CREDIT_RATE,
    0
  );

  // সকল ওয়েভার পার্সেন্টেজ যোগ করা
  const totalWaiverPercent = waivers.reduce(
    (sum, w) => sum + Number(w.totalAllowedWaiver || 0),
    0
  );
  const waiverDeduction = (rawTotalPayable * totalWaiverPercent) / 100;

  const netTotalPayable = rawTotalPayable - waiverDeduction;
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const dueBalance = netTotalPayable - totalPaid;

  const paymentPercentage =
    netTotalPayable > 0 ? (totalPaid / netTotalPayable) * 100 : 0;

  return (
    <div className="report-container">
      <div className="container py-5">
        {/* Header Section */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white border-start border-primary border-5">
          <div className="row align-items-center">
            <div className="col-md-7">
              <h2 className="fw-bold text-dark mb-1">
                Financial Summary Report
              </h2>
              <p className="text-muted mb-0">
                Student: <span className="fw-bold">{loggedInStudentName}</span>{" "}
                | ID:{" "}
                <span className="fw-bold text-primary">
                  {loggedInStudentId}
                </span>
              </p>
              {totalWaiverPercent > 0 && (
                <div className="mt-2 small text-success fw-bold">
                  <i className="bi bi-patch-check-fill me-1"></i> Active Waiver
                  Applied: {totalWaiverPercent}%
                </div>
              )}
            </div>
            <div className="col-md-5 text-md-end">
              <button
                className="btn btn-primary rounded-pill px-4 shadow-sm"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer-fill me-2"></i>Official PDF Copy
              </button>
            </div>
          </div>
        </div>

        {/* Financial Cards (Summary) */}
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card border-0 shadow-lg rounded-4 p-4 bg-white h-100 text-center border-bottom border-primary border-4">
              <h6 className="text-muted small text-uppercase fw-bold">
                Raw Payable
              </h6>
              <h4 className="fw-bold text-dark">
                ৳ {rawTotalPayable.toLocaleString()}
              </h4>
              <small className="text-muted">Before Waiver</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-lg rounded-4 p-4 bg-white h-100 text-center border-bottom border-success border-4">
              <h6 className="text-muted small text-uppercase fw-bold">
                Waiver Amt.
              </h6>
              <h4 className="fw-bold text-success">
                - ৳ {waiverDeduction.toLocaleString()}
              </h4>
              <small className="text-muted">Applied Savings</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-lg rounded-4 p-4 bg-white h-100 text-center border-bottom border-info border-4">
              <h6 className="text-muted small text-uppercase fw-bold">
                Total Paid
              </h6>
              <h4 className="fw-bold text-info">
                ৳ {totalPaid.toLocaleString()}
              </h4>
              <small className="text-muted">
                {payments.length} Transactions
              </small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-lg rounded-4 p-4 bg-primary text-white h-100 text-center shadow-primary">
              <h6 className="small text-uppercase fw-bold opacity-75">
                Net Due Balance
              </h6>
              <h3 className="fw-bold">৳ {dueBalance.toLocaleString()}</h3>
              <small className="opacity-75">Total Outstanding</small>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden bg-white">
              <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Transaction & Fee History</h6>
                <div className="d-flex gap-2">
                  <span className="badge bg-primary rounded-pill">
                    Courses: {courses.length}
                  </span>
                  <span className="badge bg-success rounded-pill">
                    Payments: {payments.length}
                  </span>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light x-small text-uppercase fw-bold">
                    <tr>
                      <th className="ps-4">Description</th>
                      <th>Reference / Code</th>
                      <th className="text-end pe-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Courses (Payable) */}
                    {courses.map((c, i) => (
                      <tr key={`c-${i}`}>
                        <td className="ps-4">
                          <div className="fw-bold small text-dark">
                            {c.courseTitle}
                          </div>
                          <div className="text-muted x-small">
                            Course Enrollment
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {c.courseCode}
                          </span>
                        </td>
                        <td className="text-end pe-4 small">
                          ৳ {(c.credit * CREDIT_RATE).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {/* Waivers (Deductions) */}
                    {waivers.map((w, i) => (
                      <tr
                        key={`w-${i}`}
                        className="table-success table-opacity-10"
                      >
                        <td className="ps-4">
                          <div className="fw-bold small text-success">
                            {w.waiverName}
                          </div>
                          <div className="text-muted x-small">
                            Waiver Discount
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success">
                            {w.waiverCode}
                          </span>
                        </td>
                        <td className="text-end pe-4 small fw-bold text-success">
                          - ৳{" "}
                          {(
                            (rawTotalPayable * w.totalAllowedWaiver) /
                            100
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {/* Payments (Paid) */}
                    {payments.map((p, i) => (
                      <tr key={`p-${i}`} className="table-light">
                        <td className="ps-4">
                          <div className="fw-bold small">Payment Received</div>
                          <div className="text-muted x-small">
                            {new Date(p.paymentDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <span className="text-primary small fw-bold">
                            #{p.receiptNo}
                          </span>
                        </td>
                        <td className="text-end pe-4 small fw-bold text-info">
                          ৳ {Number(p.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-dark text-white">
                    <tr>
                      <td colSpan="2" className="ps-4 fw-bold">
                        Current Net Due
                      </td>
                      <td className="text-end pe-4 fw-bold h5 mb-0">
                        ৳ {dueBalance.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Quick Status */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h6 className="fw-bold text-dark mb-3">Settlement Status</h6>
              <div className="text-center mb-4">
                <div className="display-6 fw-bold text-primary">
                  {paymentPercentage.toFixed(1)}%
                </div>
                <div className="text-muted small uppercase fw-bold">
                  Fees Covered
                </div>
              </div>
              <div
                className="progress rounded-pill mb-3"
                style={{ height: "10px" }}
              >
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${paymentPercentage}%` }}
                ></div>
              </div>
              <ul className="list-unstyled small mt-3">
                <li className="d-flex justify-content-between mb-2">
                  <span>Net Tuition Fee:</span>
                  <span className="fw-bold">
                    ৳ {netTotalPayable.toLocaleString()}
                  </span>
                </li>
                <li className="d-flex justify-content-between mb-2 text-success">
                  <span>Total Paid:</span>
                  <span className="fw-bold">
                    ৳ {totalPaid.toLocaleString()}
                  </span>
                </li>
                <li className="d-flex justify-content-between pt-2 border-top">
                  <span>Payable Balance:</span>
                  <span className="fw-bold text-danger">
                    ৳ {dueBalance.toLocaleString()}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .report-container { background-color: #f8fafc; min-height: 100vh; }
        .x-small { font-size: 11px; }
        .shadow-primary { box-shadow: 0 10px 20px rgba(13, 110, 253, 0.2) !important; }
        .table > :not(caption) > * > * { padding: 1rem 0.5rem; }
        
        @media print {
          .btn, .progress, .col-lg-4 { display: none !important; }
          .container { max-width: 100% !important; width: 100% !important; }
          .col-lg-8 { width: 100% !important; }
          .card { border: 1px solid #ddd !important; box-shadow: none !important; }
          tfoot { background: #000 !important; color: #fff !important; }
        }
      `}</style>
    </div>
  );
};

export default FinancialReport;
