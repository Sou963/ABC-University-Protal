import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const PaymentManager = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("history"); // history or add

  const loggedInStudentId = localStorage.getItem("studentId");
  const loggedInStudentName = localStorage.getItem("studentName");

  const [formData, setFormData] = useState({
    studentId: loggedInStudentId || "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    receiptNo: "",
    note: "",
  });

  const fetchPayments = useCallback(async () => {
    if (!loggedInStudentId) return;
    setLoading(true);
    try {
      const res = await fetch(`https://university-backend-ten.vercel.app/api/payment/student/${loggedInStudentId}`);
      const data = await res.json();
      if (res.ok) {
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [loggedInStudentId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://university-backend-ten.vercel.app/api/payment/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Payment Added Successfully!");
        setFormData({ ...formData, amount: "", receiptNo: "", note: "" });
        fetchPayments();
        setActiveTab("history");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error.");
    }
  };

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="payment-page-bg">
      <div className="container py-5">
        
        {/* Header Section */}
        <div className="row mb-4 align-items-center">
          <div className="col-md-7">
            <h2 className="fw-bold text-dark mb-1">
              <i className="bi bi-shield-check text-primary me-2"></i>Payment Ledger
            </h2>
            <p className="text-muted">History for: <span className="text-primary fw-bold">{loggedInStudentName}</span></p>
          </div>
          <div className="col-md-5 text-md-end">
            <div className="d-inline-flex gap-2 bg-white p-2 rounded-pill shadow-sm">
              <button 
                className={`btn btn-sm px-4 rounded-pill border-0 ${activeTab === "history" ? "btn-primary" : "text-muted"}`}
                onClick={() => setActiveTab("history")}
              >
                Transactions
              </button>
              <button 
                className={`btn btn-sm px-4 rounded-pill border-0 ${activeTab === "add" ? "btn-primary" : "text-muted"}`}
                onClick={() => setActiveTab("add")}
              >
                New Payment
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Main Content Area */}
          <div className="col-lg-8">
            {activeTab === "history" ? (
              <div className="card border-0 shadow-lg rounded-5 overflow-hidden animate-slide-up">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0 custom-payment-table">
                    <thead className="bg-light">
                      <tr className="small text-muted text-uppercase">
                        <th className="ps-4">Date & Receipt</th>
                        <th>Note</th>
                        <th className="text-end pe-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="3" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                      ) : payments.length === 0 ? (
                        <tr><td colSpan="3" className="text-center py-5 text-muted">No payments recorded yet.</td></tr>
                      ) : (
                        payments.map((p, i) => (
                          <tr key={i}>
                            <td className="ps-4 py-3">
                              <div className="fw-bold text-dark">{new Date(p.paymentDate).toLocaleDateString('en-GB')}</div>
                              <small className="text-primary font-monospace">#{p.receiptNo}</small>
                            </td>
                            <td><span className="text-muted small">{p.note || "General Tuition Fee"}</span></td>
                            <td className="text-end pe-4 fw-bold text-success fs-5">
                              ৳ {Number(p.amount).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Add Payment Form */
              <div className="card border-0 shadow-lg rounded-5 p-4 p-md-5 animate-slide-up">
                <h4 className="fw-bold mb-4">Submit Payment Information</h4>
                <form onSubmit={handleAddPayment} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">AMOUNT (BDT)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">৳</span>
                      <input type="number" className="form-control bg-light border-0" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">RECEIPT NO</label>
                    <input type="text" className="form-control bg-light border-0" placeholder="Bank/Office Receipt #" value={formData.receiptNo} onChange={(e) => setFormData({...formData, receiptNo: e.target.value})} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">PAYMENT DATE</label>
                    <input type="date" className="form-control bg-light border-0" value={formData.paymentDate} onChange={(e) => setFormData({...formData, paymentDate: e.target.value})} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">STUDENT ID (REF)</label>
                    <input type="text" className="form-control bg-light border-0 text-muted" value={formData.studentId} disabled />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">REMARKS / NOTE</label>
                    <textarea className="form-control bg-light border-0" rows="2" placeholder="Ex: Admission Fee, Midterm Fee..." value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})}></textarea>
                  </div>
                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow">
                      Confirm & Save Payment
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Side Summary Panel */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-5 p-4 bg-primary text-white mb-4">
              <h6 className="text-uppercase small opacity-75 fw-bold tracking-wider">Total Amount Paid</h6>
              <h1 className="fw-bold mb-0">৳ {totalPaid.toLocaleString()}</h1>
              <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-4">
                <div className="d-flex justify-content-between small">
                  <span>Last Payment:</span>
                  <span className="fw-bold">{payments.length > 0 ? new Date(payments[0].paymentDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-5 p-4 bg-white">
              <h6 className="fw-bold text-dark mb-3">Verification Info</h6>
              <div className="d-flex align-items-center mb-3">
                <div className="icon-circle bg-light text-primary me-3"><i className="bi bi-clock-history"></i></div>
                <div className="small">
                  <div className="fw-bold">Real-time Sync</div>
                  <div className="text-muted">Payments update instantly.</div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="icon-circle bg-light text-success me-3"><i className="bi bi-file-earmark-pdf"></i></div>
                <div className="small">
                  <div className="fw-bold">Digital Receipt</div>
                  <div className="text-muted">Available for download.</div>
                </div>
              </div>
              <button className="btn btn-outline-primary btn-sm w-100 mt-4 rounded-pill" onClick={() => window.print()}>
                <i className="bi bi-printer me-2"></i>Print Ledger
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .payment-page-bg { min-height: 100vh; background-color: #f8fafc; }
        .custom-payment-table thead th { border: none; padding: 1.2rem 1rem; }
        .custom-payment-table tbody td { border-bottom: 1px solid #f1f5f9; padding: 1.2rem 1rem; }
        .icon-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .tracking-wider { letter-spacing: 1px; }
        .animate-slide-up { animation: slideUp 0.6s ease-out; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        
        @media print {
          .btn, .bg-white.p-2.rounded-pill, .card.bg-white { display: none !important; }
          .col-lg-8 { width: 100% !important; }
          .card { box-shadow: none !important; border: 1px solid #eee !important; }
        }
      `}</style>
    </div>
  );
};

export default PaymentManager;
