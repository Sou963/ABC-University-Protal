import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const CostPackage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loggedInStudentId = localStorage.getItem("studentId");
  const loggedInStudentName = localStorage.getItem("studentName");

  const fetchPackageData = async () => {
    if (!loggedInStudentId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://university-backend-ten.vercel.app/api/package/student/${loggedInStudentId}`);
      const data = await response.json();
      if (response.ok) {
        setPackages(data);
      } else {
        setError(data.message || "No cost package assigned.");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackageData();
  }, [loggedInStudentId]);

  return (
    <div className="package-container-fluid">
      <div className="container py-5">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{height: '60vh'}}>
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : error ? (
          <div className="text-center py-5 shadow-sm rounded-4 bg-white border">
            <i className="bi bi-info-circle fs-1 text-primary mb-3"></i>
            <h4 className="text-dark">{error}</h4>
            <p className="text-muted">Please contact the accounts department.</p>
          </div>
        ) : (
          packages.map((pkg, idx) => (
            <div key={idx} className="row g-0 shadow-lg rounded-5 overflow-hidden animate-entry">
              
              {/* Left Panel: Package Identity */}
              <div className="col-lg-4 bg-primary p-5 text-white d-flex flex-column justify-content-between">
                <div>
                  <div className="d-inline-block p-3 bg-white bg-opacity-10 rounded-4 mb-4">
                    <i className="bi bi-box-seam fs-2"></i>
                  </div>
                  <h6 className="text-uppercase opacity-75 tracking-widest small fw-bold">Active Package</h6>
                  <h2 className="fw-bold mb-3">{pkg.packageName}</h2>
                  <div className="badge bg-white text-primary px-3 py-2 rounded-pill fw-bold">
                    Code: {pkg.packageCode}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="p-3 bg-white bg-opacity-10 rounded-4 border border-white border-opacity-10">
                    <p className="small opacity-75 mb-1">Total Package Value</p>
                    <h3 className="fw-bold mb-0">
                      {pkg.currency === "BDT" ? "৳" : "$"} {pkg.costRates.reduce((acc, curr) => acc + curr.costAmount, 0).toLocaleString()}
                    </h3>
                  </div>
                  <p className="mt-4 small opacity-50 fst-italic">
                    * This amount represents the base cost before any applicable waivers.
                  </p>
                </div>
              </div>

              {/* Right Panel: Cost Details */}
              <div className="col-lg-8 bg-white p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="fw-bold text-dark mb-1">Cost Breakdown</h4>
                    <p className="text-muted small mb-0">Student: {loggedInStudentName} ({loggedInStudentId})</p>
                  </div>
                  <button className="btn btn-light border rounded-circle p-2" onClick={() => window.print()}>
                    <i className="bi bi-printer-fill text-primary"></i>
                  </button>
                </div>

                <div className="list-group list-group-flush mt-2">
                  {pkg.costRates.map((rate, rIdx) => (
                    <div key={rIdx} className="list-group-item px-0 py-4 d-flex justify-content-between align-items-center bg-transparent border-bottom">
                      <div className="d-flex align-items-center">
                        <div className="item-icon me-3">
                          <i className="bi bi-dot fs-1 text-primary"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark mb-0">{rate.costHead}</h6>
                          <span className="badge bg-light text-muted border-0 small mt-1">
                            {rate.frequencyType}
                          </span>
                        </div>
                      </div>
                      <div className="text-end">
                        <h6 className="fw-bold text-primary mb-0">
                          {pkg.currency === "BDT" ? "৳" : "$"} {rate.costAmount.toLocaleString()}
                        </h6>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-4 rounded-4 bg-light d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold text-dark mb-0">Reference Number</h6>
                    <small className="text-muted">ID: {pkg.serialNumber}</small>
                  </div>
                  <div className="text-end">
                    <span className={`status-pill ${pkg.isActive ? 'active' : 'inactive'}`}>
                      {pkg.isActive ? 'Officially Active' : 'Suspended'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      <style>{`
        .package-container-fluid {
          background-color: #f0f4f8;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }
        .tracking-widest { letter-spacing: 2px; }
        
        .item-icon {
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
        }

        .status-pill {
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-pill.active { background: #dcfce7; color: #166534; }
        .status-pill.inactive { background: #fee2e2; color: #991b1b; }

        .animate-entry {
          animation: slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 991px) {
          .rounded-5 { border-radius: 20px !important; }
        }

        @media print {
          .btn-light, .package-container-fluid { background: white !important; }
          .row { box-shadow: none !important; border: 1px solid #ddd; }
          .col-lg-4 { background: #0d6efd !important; color: white !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default CostPackage;