import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Semsudule from "./pages/semestersu";
import AuthPortal from "./log/AuthPortal";
import Courses from "./pages/coursesshow";
import FinancialDetails from "./pages/financial";
import WaiverInfo from "./pages/waiver";
import CostPackage from "./pages/costpackage";
import Result from "./pages/result";
import Payablelist from "./pages/payable";
import Payment from "./pages/payment";
import CourseStructure from "./pages/course_structure";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPortal />} />
        <Route path="/home" element={<Home />} />
        <Route path="/schedule" element={<Semsudule />} />
        <Route path="/registration" element={<Courses />} />
        <Route path="/finance" element={<FinancialDetails />} />
        <Route path="/waiver" element={<WaiverInfo />} />
        <Route path="/cost" element={<CostPackage />} />
        <Route path="/result" element={<Result />} />
        <Route path="/payable" element={<Payablelist />} />
        <Route path="/payments" element={<Payment />} />
        <Route path="/course-structure" element={<CourseStructure />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
