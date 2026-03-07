import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Row, Col, Form, Button, Nav, InputGroup, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AuthPortal.css";

const AuthPortal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // নতুন সাকসেস মেসেজ স্টেট
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    name: "",
  });

  const generateUserId = () => {
    const randomId = "2026-" + Math.floor(1000 + Math.random() * 9000);
    setFormData({ ...formData, userId: randomId });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); 
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const url = `https://university-backend-ten.vercel.app${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // ✅ লগইনের সময় ডাটা সেভ করা
          localStorage.setItem("studentName", data.user.name);
          localStorage.setItem("studentId", data.user.userId);
          navigate("/home"); // আপনার ড্যাশবোর্ড রাউট অনুযায়ী
        } else {
          // ✅ রেজিস্ট্রেশনের পর সাকসেস মেসেজ এবং লগইন মোডে ফেরত নেওয়া
          setSuccess("Account created successfully! Please sign in now.");
          setIsLogin(true);
          setFormData({ userId: formData.userId, password: "", name: "" }); // Password reset for security
        }
      } else {
        setError(data.message || "Authentication failed.");
      }
    } catch (err) {
      setError("Server connection failed. Check if backend is running on port 3300.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 p-0 overflow-hidden bg-white">
      <Row className="g-0 h-100">
        {/* Left Side: Brand Panel */}
        <Col md={6} className="d-none d-md-flex flex-column align-items-center justify-content-center text-white position-relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}>
          <div className="scanline"></div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-1 px-5">
            <h5 className="text-uppercase tracking-widest mb-2 opacity-75 fw-light" style={{ letterSpacing: "4px" }}>Welcome to</h5>
            <h1 className="display-2 fw-bold mb-3 tracking-tighter">PORTAL <span style={{ color: "#60a5fa" }}>2.0</span></h1>
            <div className="mx-auto mb-4" style={{ height: "6px", width: "100px", backgroundColor: "#60a5fa", borderRadius: "2px" }}></div>
            <p className="fs-5 opacity-75 fw-light">Secure Centralized Academic Hub.</p>
          </motion.div>
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 6, repeat: Infinity }}
            className="position-absolute border border-white rounded-circle" style={{ width: "600px", height: "600px" }}></motion.div>
        </Col>

        {/* Right Side: Authentication Form */}
        <Col md={6} className="d-flex flex-column justify-content-center align-items-center bg-white shadow-lg">
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ width: "100%", maxWidth: "400px" }} className="p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-dark mb-1">{isLogin ? "Sign In" : "Register"}</h2>
              <p className="text-muted small">Authentication Required</p>
            </div>

            <AnimatePresence mode="wait">
              {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Alert variant="danger" className="py-2 small text-center">{error}</Alert>
              </motion.div>}
              {success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Alert variant="success" className="py-2 small text-center">{success}</Alert>
              </motion.div>}
            </AnimatePresence>

            <Nav className="mb-4 p-1 bg-light rounded-pill border-0">
              <Nav.Item className="w-50">
                <Nav.Link className={`text-center rounded-pill border-0 py-2 ${isLogin ? "bg-white shadow-sm text-primary fw-bold" : "text-muted"}`}
                  onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}>Login</Nav.Link>
              </Nav.Item>
              <Nav.Item className="w-50">
                <Nav.Link className={`text-center rounded-pill border-0 py-2 ${!isLogin ? "bg-white shadow-sm text-primary fw-bold" : "text-muted"}`}
                  onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}>Sign Up</Nav.Link>
              </Nav.Item>
            </Nav>

            <Form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                <motion.div key={isLogin ? "login" : "signup"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {!isLogin && (
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-secondary">FULL NAME</Form.Label>
                      <Form.Control type="text" name="name" placeholder="John Doe" className="py-2 border-0 bg-light rounded-3 shadow-none" 
                        onChange={handleChange} required />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-secondary">STUDENT ID</Form.Label>
                    <InputGroup className="bg-light rounded-3 overflow-hidden">
                      <Form.Control type="text" name="userId" value={formData.userId} placeholder="2026-XXXX" 
                        className="py-2 border-0 bg-transparent shadow-none" onChange={handleChange} required />
                      {!isLogin && (
                        <Button variant="link" onClick={generateUserId} className="text-primary text-decoration-none fw-bold bg-transparent border-0 px-3">
                          <i className="bi bi-magic me-1"></i> GEN
                        </Button>
                      )}
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-secondary">PASSWORD</Form.Label>
                    <InputGroup className="bg-light rounded-3 overflow-hidden">
                      <Form.Control type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" 
                        className="py-2 border-0 bg-transparent shadow-none" onChange={handleChange} required />
                      <InputGroup.Text className="bg-transparent border-0 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </motion.div>
              </AnimatePresence>

              <Button type="submit" disabled={loading} className="w-100 py-3 fw-bold border-0 rounded-3 shadow-sm"
                style={{ background: "#2563eb" }}>
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : 
                 isLogin ? "INITIALIZE DASHBOARD" : "CREATE ACCOUNT"}
              </Button>
            </Form>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPortal;