import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topnav from './components/Topnav';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/students/StudentList';
import StudentForm from './pages/students/StudentForm';
import StudentDetail from './pages/students/StudentDetail';
import TeacherList from './pages/teachers/TeacherList';
import TeacherForm from './pages/teachers/TeacherForm';
import TeacherDetail from './pages/teachers/TeacherDetail';
import BatchList from './pages/batches/BatchList';
import BatchForm from './pages/batches/BatchForm';
import BatchDetail from './pages/batches/BatchDetail';
import MarkAttendance from './pages/attendance/MarkAttendance';
import AttendanceHistory from './pages/attendance/AttendanceHistory';
import PaymentSelection from './pages/payments/PaymentSelection';
import PaymentList from './pages/payments/PaymentList';
import StudentPaymentForm from './pages/payments/StudentPaymentForm';
import TeacherPaymentForm from './pages/payments/TeacherPaymentForm';
import PendingFees from './pages/payments/PendingFees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarShow, setSidebarShow] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('stc_token');

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarShow(false);
  }, [location.pathname]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Sidebar show={sidebarShow} onToggle={() => setSidebarShow(!sidebarShow)} />
      {sidebarShow && <div className="sidebar-backdrop" onClick={() => setSidebarShow(false)} />}
      <Topnav onToggleSidebar={() => setSidebarShow(!sidebarShow)} />
      <div id="main-content">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Core Layout protected routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        
        {/* Students */}
        <Route path="/students" element={<Layout><StudentList /></Layout>} />
        <Route path="/students/add" element={<Layout><StudentForm /></Layout>} />
        <Route path="/students/edit/:id" element={<Layout><StudentForm /></Layout>} />
        <Route path="/students/detail/:id" element={<Layout><StudentDetail /></Layout>} />

        {/* Teachers */}
        <Route path="/teachers" element={<Layout><TeacherList /></Layout>} />
        <Route path="/teachers/add" element={<Layout><TeacherForm /></Layout>} />
        <Route path="/teachers/edit/:id" element={<Layout><TeacherForm /></Layout>} />
        <Route path="/teachers/detail/:id" element={<Layout><TeacherDetail /></Layout>} />

        {/* Batches */}
        <Route path="/batches" element={<Layout><BatchList /></Layout>} />
        <Route path="/batches/add" element={<Layout><BatchForm /></Layout>} />
        <Route path="/batches/edit/:id" element={<Layout><BatchForm /></Layout>} />
        <Route path="/batches/detail/:id" element={<Layout><BatchDetail /></Layout>} />

        {/* Attendance */}
        <Route path="/attendance" element={<Layout><MarkAttendance /></Layout>} />
        <Route path="/attendance/history" element={<Layout><AttendanceHistory /></Layout>} />

        {/* Payments */}
        <Route path="/payments" element={<Layout><PaymentList /></Layout>} />
        <Route path="/payments/selection" element={<Layout><PaymentSelection /></Layout>} />
        <Route path="/payments/add-student" element={<Layout><StudentPaymentForm /></Layout>} />
        <Route path="/payments/add-teacher" element={<Layout><TeacherPaymentForm /></Layout>} />
        <Route path="/payments/pending" element={<Layout><PendingFees /></Layout>} />

        {/* Reports & Settings */}
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
