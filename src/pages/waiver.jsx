import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { apiUrl } from "../api";

const WaiverInfo = () => {
  const [waivers, setWaivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loggedInStudentId = localStorage.getItem("studentId");
  const loggedInStudentName = localStorage.getItem("studentName");

  const fetchWaiverData = useCallback(async () => {
    if (!loggedInStudentId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        apiUrl(`/api/waiver/student/${loggedInStudentId}`)
      );
      const data = await response.json();
      if (response.ok) {
        setWaivers(data);
      } else {
        setError(data.message || "No records found.");
      }
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, [loggedInStudentId]);

  useEffect(() => {
    fetchWaiverData();
  }, [fetchWaiverData, loggedInStudentId]);

  return (
    <div className="waiver-wrapper-fixed">
      {/* Background soft shapes to match your portal theme */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      <div className="main-waiver-card animate-pop-in">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
            <p className="mt-2 text-muted small">Loading Profile...</p>
          </div>
        ) : error ? (
          <div className="text-center p-4">
            <i className="bi bi-info-circle fs-1 text-primary mb-3"></i>
            <h6 className="text-dark fw-bold">{error}</h6>
            <p className="text-muted small">
              Please contact registrar office if this is an error.
            </p>
          </div>
        ) : (
          <>
            {/* Top Identity Section */}
            <div className="header-identity">
              <div className="icon-badge">
                <i className="bi bi-award-fill"></i>
              </div>
              <h3 className="student-name-text">{loggedInStudentName}</h3>
              <p className="student-id-label">
                STUDENT OFFICIAL ID: {loggedInStudentId}
              </p>
            </div>

            <div className="content-body">
              {waivers.map((w, index) => (
                <div key={index} className="waiver-benefit-box">
                  <div className="row align-items-center">
                    <div className="col-8 text-start">
                      <span className="type-tag">Scholarship Type</span>
                      <h5 className="waiver-title">{w.waiverName}</h5>
                      <div className="code-pill">
                        <i className="bi bi-shield-lock me-1"></i>{" "}
                        {w.waiverCode}
                      </div>
                    </div>
                    <div className="col-4 text-end">
                      <div className="percent-circle-small">
                        <span className="num">{w.totalAllowedWaiver}%</span>
                        <span className="txt">OFF</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="footer-actions mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="status-indicator">
                  <span className="dot pulse"></span> Document Verified
                </span>
                <span className="date-stamp">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <button
                className="btn-print-action"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer me-2"></i> Print Official Copy
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .waiver-wrapper-fixed {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100vh;
          background-color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow: hidden;
          z-index: 1000;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          z-index: 0;
          opacity: 0.5;
        }
        .shape-1 { width: 400px; height: 400px; background: #dbeafe; top: -100px; left: -100px; }
        .shape-2 { width: 300px; height: 300px; background: #e0e7ff; bottom: -50px; right: -50px; }

        .main-waiver-card {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 32px;
          padding: 40px;
          position: relative;
          z-index: 10;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0,0,0,0.02);
          border: 1px solid rgba(255,255,255,0.8);
        }

        .header-identity {
          text-align: center;
          margin-bottom: 30px;
        }
        .icon-badge {
          width: 60px; height: 60px;
          background: #0d6efd;
          color: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 15px;
          box-shadow: 0 10px 20px rgba(13, 110, 253, 0.2);
        }
        .student-name-text { font-weight: 800; color: #1e293b; margin: 0; }
        .student-id-label { font-size: 11px; color: #64748b; letter-spacing: 1px; margin-top: 5px; font-weight: 600; }

        .waiver-benefit-box {
          background: #f1f5f9;
          border-radius: 24px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .type-tag { font-size: 10px; font-weight: 700; color: #3b82f6; text-uppercase: uppercase; letter-spacing: 0.5px; }
        .waiver-title { font-weight: 700; color: #334155; margin: 4px 0; font-size: 1.1rem; }
        .code-pill {
          display: inline-block;
          font-size: 11px;
          background: #fff;
          padding: 4px 12px;
          border-radius: 100px;
          color: #64748b;
          border: 1px solid #e2e8f0;
          font-weight: 600;
        }

        .percent-circle-small {
          width: 75px; height: 75px;
          background: #ffffff;
          border: 3px solid #0d6efd;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(13, 110, 253, 0.1);
        }
        .percent-circle-small .num { font-size: 20px; font-weight: 800; color: #0d6efd; line-height: 1; }
        .percent-circle-small .txt { font-size: 9px; font-weight: 700; color: #94a3b8; }

        .btn-print-action {
          width: 100%;
          background: #0d6efd;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 16px;
          font-weight: 700;
          transition: all 0.3s;
        }
        .btn-print-action:hover { background: #0b5ed7; transform: translateY(-2px); box-shadow: 0 8px 15px rgba(13, 110, 253, 0.2); }

        .status-indicator { font-size: 12px; color: #475569; font-weight: 600; display: flex; align-items: center; }
        .dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; margin-right: 8px; }
        .pulse { animation: pulse-green 2s infinite; }
        .date-stamp { font-size: 12px; color: #94a3b8; }

        @keyframes pulse-green {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        .animate-pop-in { animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

        @media print {
          .waiver-wrapper-fixed { position: static; height: auto; background: white; padding: 0; }
          .bg-shape, .btn-print-action { display: none; }
          .main-waiver-card { box-shadow: none; border: 1px solid #eee; margin: 0 auto; }
        }
      `}</style>
    </div>
  );
};

export default WaiverInfo;
