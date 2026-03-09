import React from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Accordion,
  Badge,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const CourseStructure = () => {
  // Total 12 Semesters structured for 154 Credits
  const curriculum = [
    {
      semester: "1st Semester",
      credits: 13,
      courses: [
        {
          code: "CSE-111",
          title: "Introduction to Computer Systems",
          cr: 3,
          type: "Theory",
        },
        {
          code: "MAT-111",
          title: "Differential & Integral Calculus",
          cr: 3,
          type: "Theory",
        },
        {
          code: "ENG-111",
          title: "English Fundamentals",
          cr: 3,
          type: "Theory",
        },
        {
          code: "CSE-112",
          title: "Computer Fundamentals Lab",
          cr: 1,
          type: "Lab",
        },
        { code: "PHY-111", title: "Physics I", cr: 3, type: "Theory" },
      ],
    },
    {
      semester: "2nd Semester",
      credits: 13,
      courses: [
        {
          code: "CSE-121",
          title: "Structured Programming Language",
          cr: 3,
          type: "Theory",
        },
        { code: "CSE-122", title: "Programming Lab", cr: 1, type: "Lab" },
        {
          code: "MAT-121",
          title: "Coordinate Geometry & Vector",
          cr: 3,
          type: "Theory",
        },
        {
          code: "PHY-121",
          title: "Physics II (Electricity & Magnetism)",
          cr: 3,
          type: "Theory",
        },
        {
          code: "EEE-121",
          title: "Basic Electrical Engineering",
          cr: 3,
          type: "Theory",
        },
      ],
    },
    {
      semester: "3rd Semester",
      credits: 13,
      courses: [
        {
          code: "CSE-131",
          title: "Object Oriented Programming",
          cr: 3,
          type: "Theory",
        },
        { code: "CSE-132", title: "OOP Lab (Java/C++)", cr: 1, type: "Lab" },
        {
          code: "MAT-131",
          title: "Linear Algebra & Complex Variables",
          cr: 3,
          type: "Theory",
        },
        {
          code: "EEE-131",
          title: "Electronic Devices & Circuits",
          cr: 3,
          type: "Theory",
        },
        {
          code: "CSE-133",
          title: "Discrete Mathematics",
          cr: 3,
          type: "Theory",
        },
      ],
    },
    {
      semester: "4th Semester",
      credits: 14,
      courses: [
        { code: "CSE-211", title: "Data Structures", cr: 3, type: "Theory" },
        { code: "CSE-212", title: "Data Structures Lab", cr: 1, type: "Lab" },
        {
          code: "CSE-213",
          title: "Digital Logic Design",
          cr: 3,
          type: "Theory",
        },
        { code: "CSE-214", title: "DLD Lab", cr: 1, type: "Lab" },
        {
          code: "MAT-211",
          title: "Statistics & Probability",
          cr: 3,
          type: "Theory",
        },
        {
          code: "ACT-211",
          title: "Financial & Managerial Accounting",
          cr: 3,
          type: "Theory",
        },
      ],
    },
    {
      semester: "5th Semester",
      credits: 13,
      courses: [
        { code: "CSE-221", title: "Algorithms", cr: 3, type: "Theory" },
        { code: "CSE-222", title: "Algorithm Lab", cr: 1, type: "Lab" },
        {
          code: "CSE-223",
          title: "Database Management Systems",
          cr: 3,
          type: "Theory",
        },
        { code: "CSE-224", title: "Database Lab", cr: 1, type: "Lab" },
        {
          code: "CSE-225",
          title: "Computer Architecture",
          cr: 3,
          type: "Theory",
        },
        {
          code: "SOC-221",
          title: "Society & Technology",
          cr: 2,
          type: "Theory",
        },
      ],
    },
    {
      semester: "6th Semester",
      credits: 13,
      courses: [
        { code: "CSE-231", title: "Operating Systems", cr: 3, type: "Theory" },
        { code: "CSE-232", title: "OS Lab (Linux/Unix)", cr: 1, type: "Lab" },
        {
          code: "CSE-233",
          title: "Microprocessor & Interfacing",
          cr: 3,
          type: "Theory",
        },
        { code: "CSE-234", title: "Microprocessor Lab", cr: 1, type: "Lab" },
        {
          code: "CSE-235",
          title: "Theory of Computation",
          cr: 3,
          type: "Theory",
        },
        {
          code: "ECO-231",
          title: "Engineering Economics",
          cr: 2,
          type: "Theory",
        },
      ],
    },
    {
      semester: "7th Semester",
      credits: 14,
      courses: [
        {
          code: "CSE-311",
          title: "Software Engineering",
          cr: 3,
          type: "Theory",
        },
        {
          code: "CSE-312",
          title: "Software Engineering Project",
          cr: 1,
          type: "Lab",
        },
        { code: "CSE-313", title: "Compiler Design", cr: 3, type: "Theory" },
        { code: "CSE-314", title: "Compiler Lab", cr: 1, type: "Lab" },
        { code: "CSE-315", title: "Data Communication", cr: 3, type: "Theory" },
        { code: "MAT-311", title: "Numerical Methods", cr: 3, type: "Theory" },
      ],
    },
    {
      semester: "8th Semester",
      credits: 13,
      courses: [
        { code: "CSE-321", title: "Computer Networks", cr: 3, type: "Theory" },
        { code: "CSE-322", title: "Networks Lab", cr: 1, type: "Lab" },
        {
          code: "CSE-323",
          title: "Artificial Intelligence",
          cr: 3,
          type: "Theory",
        },
        { code: "CSE-324", title: "AI Lab", cr: 1, type: "Lab" },
        {
          code: "CSE-325",
          title: "System Analysis & Design",
          cr: 3,
          type: "Theory",
        },
        {
          code: "MGT-321",
          title: "Industrial Management",
          cr: 2,
          type: "Theory",
        },
      ],
    },
    {
      semester: "9th Semester",
      credits: 13,
      courses: [
        { code: "CSE-331", title: "Web Technologies", cr: 3, type: "Theory" },
        { code: "CSE-332", title: "Web Lab (React/Node)", cr: 1, type: "Lab" },
        {
          code: "CSE-333",
          title: "Information System Security",
          cr: 3,
          type: "Theory",
        },
        {
          code: "CSE-334",
          title: "Technical Writing & Presentation",
          cr: 2,
          type: "Lab",
        },
        {
          code: "CSE-335",
          title: "Mobile Application Dev",
          cr: 3,
          type: "Theory",
        },
        { code: "CSE-336", title: "Mobile App Lab", cr: 1, type: "Lab" },
      ],
    },
    {
      semester: "10th Semester",
      credits: 12,
      courses: [
        { code: "CSE-411", title: "Machine Learning", cr: 3, type: "Theory" },
        { code: "CSE-412", title: "ML Lab", cr: 1, type: "Lab" },
        {
          code: "CSE-413",
          title: "Digital Signal Processing",
          cr: 3,
          type: "Theory",
        },
        {
          code: "CSE-410",
          title: "Thesis/Project Phase I",
          cr: 2,
          type: "Lab",
        },
        { code: "CSE-415", title: "Elective I", cr: 3, type: "Theory" },
      ],
    },
    {
      semester: "11th Semester",
      credits: 12,
      courses: [
        { code: "CSE-421", title: "Cloud Computing", cr: 3, type: "Theory" },
        { code: "CSE-422", title: "Cloud Lab", cr: 1, type: "Lab" },
        {
          code: "CSE-423",
          title: "Human Computer Interaction",
          cr: 3,
          type: "Theory",
        },
        {
          code: "CSE-420",
          title: "Thesis/Project Phase II",
          cr: 2,
          type: "Lab",
        },
        { code: "CSE-425", title: "Elective II", cr: 3, type: "Theory" },
      ],
    },
    {
      semester: "12th Semester",
      credits: 11,
      courses: [
        {
          code: "CSE-431",
          title: "Big Data & Analytics",
          cr: 3,
          type: "Theory",
        },
        { code: "CSE-432", title: "Big Data Lab", cr: 1, type: "Lab" },
        {
          code: "CSE-433",
          title: "Professional Ethics",
          cr: 2,
          type: "Theory",
        },
        {
          code: "CSE-430",
          title: "Grand Viva & Final Thesis",
          cr: 3,
          type: "Lab",
        },
        { code: "CSE-435", title: "Industrial Training", cr: 2, type: "Lab" },
      ],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <div className="py-4 px-4 bg-white border-bottom shadow-sm">
        <Link
          to="/home"
          className="btn btn-outline-primary btn-sm rounded-pill mb-2"
        >
          <i className="bi bi-arrow-left"></i> Dashboard
        </Link>
        <h3 className="fw-bold text-dark">Course Structure</h3>
        <p className="text-muted small">
          Academic Syllabus - Total Credits: 154
        </p>
      </div>

      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={11}>
            {/* Summary Cards */}
            <Row className="mb-4 g-3">
              {[
                { label: "Total Credits", value: "154", icon: "bi-layers" },
                { label: "Semesters", value: "12", icon: "bi-calendar-range" },
                { label: "Total Courses", value: "62", icon: "bi-book" },
              ].map((stat, i) => (
                <Col md={4} key={i}>
                  <Card className="border-0 shadow-sm p-3 rounded-4 bg-white">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                        <i className={`bi ${stat.icon} text-primary fs-4`}></i>
                      </div>
                      <div>
                        <div className="text-muted small fw-bold">
                          {stat.label}
                        </div>
                        <div className="h4 fw-bold mb-0">{stat.value}</div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Accordion for 12 Semesters */}
            <Accordion className="shadow-sm rounded-4 overflow-hidden border-0">
              {curriculum.map((sem, idx) => (
                <Accordion.Item
                  eventKey={idx.toString()}
                  key={idx}
                  className="border-bottom"
                >
                  <Accordion.Header>
                    <div className="d-flex justify-content-between w-100 pe-3">
                      <span className="fw-bold">{sem.semester}</span>
                      <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
                        {sem.credits} Credits
                      </span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="p-0">
                    <Table responsive hover className="mb-0">
                      <thead className="bg-light">
                        <tr className="small text-muted">
                          <th className="ps-4">CODE</th>
                          <th>COURSE TITLE</th>
                          <th className="text-center">CR</th>
                          <th className="text-center">TYPE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sem.courses.map((c, i) => (
                          <tr key={i} className="align-middle">
                            <td className="ps-4 fw-bold text-primary small">
                              {c.code}
                            </td>
                            <td className="small">{c.title}</td>
                            <td className="text-center fw-bold">{c.cr}</td>
                            <td className="text-center">
                              <Badge
                                bg={c.type === "Theory" ? "info" : "warning"}
                                className="fw-normal"
                              >
                                {c.type}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CourseStructure;
