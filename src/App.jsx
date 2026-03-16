import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute'

// Auth
import LoginPage from './pages/auth/LoginPage'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageDepartments from './pages/admin/ManageDepartments'
import ManageCourses from './pages/admin/ManageCourses'
import AdminReports from './pages/admin/AdminReports'
import AdminNotifications from './pages/admin/NotificationsPage'

// Dean
import DeanDashboard from './pages/dean/DeanDashboard'
import DeanDepartments from './pages/dean/DeanDepartments'
import DeanReports from './pages/dean/DeanReports'
import DeanNotifications from './pages/dean/NotificationsPage'

// HOD
import HodDashboard from './pages/hod/HodDashboard'
import HodFaculty from './pages/hod/HodFaculty'
import HodStudents from './pages/hod/HodStudents'
import HodSubjects from './pages/hod/HodSubjects'
import HodNotifications from './pages/hod/NotificationsPage'

// Faculty
import FacultyDashboard from './pages/faculty/FacultyDashboard'
import FacultyAttendance from './pages/faculty/FacultyAttendance'
import FacultyMarks from './pages/faculty/FacultyMarks'
import FacultyAssignments from './pages/faculty/FacultyAssignments'
import FacultyNotifications from './pages/faculty/NotificationsPage'

// Student
import StudentDashboard from './pages/student/StudentDashboard'
import StudentAttendance from './pages/student/StudentAttendance'
import StudentMarks from './pages/student/StudentMarks'
import StudentAssignments from './pages/student/StudentAssignments'
import StudentProfile from './pages/student/StudentProfile'
import StudentNotifications from './pages/student/NotificationsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ─── ADMIN ──────────────────────────────────────── */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageDepartments /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageCourses /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminReports /></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminNotifications /></ProtectedRoute>} />

        {/* ─── DEAN ───────────────────────────────────────── */}
        <Route path="/dean" element={<ProtectedRoute allowedRoles={['DEAN']}><DeanDashboard /></ProtectedRoute>} />
        <Route path="/dean/departments" element={<ProtectedRoute allowedRoles={['DEAN']}><DeanDepartments /></ProtectedRoute>} />
        <Route path="/dean/reports" element={<ProtectedRoute allowedRoles={['DEAN']}><DeanReports /></ProtectedRoute>} />
        <Route path="/dean/notifications" element={<ProtectedRoute allowedRoles={['DEAN']}><DeanNotifications /></ProtectedRoute>} />

        {/* ─── HOD ────────────────────────────────────────── */}
        <Route path="/hod" element={<ProtectedRoute allowedRoles={['HOD']}><HodDashboard /></ProtectedRoute>} />
        <Route path="/hod/faculty" element={<ProtectedRoute allowedRoles={['HOD']}><HodFaculty /></ProtectedRoute>} />
        <Route path="/hod/students" element={<ProtectedRoute allowedRoles={['HOD']}><HodStudents /></ProtectedRoute>} />
        <Route path="/hod/subjects" element={<ProtectedRoute allowedRoles={['HOD']}><HodSubjects /></ProtectedRoute>} />
        <Route path="/hod/notifications" element={<ProtectedRoute allowedRoles={['HOD']}><HodNotifications /></ProtectedRoute>} />

        {/* ─── FACULTY ────────────────────────────────────── */}
        <Route path="/faculty" element={<ProtectedRoute allowedRoles={['FACULTY']}><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/faculty/attendance" element={<ProtectedRoute allowedRoles={['FACULTY']}><FacultyAttendance /></ProtectedRoute>} />
        <Route path="/faculty/marks" element={<ProtectedRoute allowedRoles={['FACULTY']}><FacultyMarks /></ProtectedRoute>} />
        <Route path="/faculty/assignments" element={<ProtectedRoute allowedRoles={['FACULTY']}><FacultyAssignments /></ProtectedRoute>} />
        <Route path="/faculty/notifications" element={<ProtectedRoute allowedRoles={['FACULTY']}><FacultyNotifications /></ProtectedRoute>} />

        {/* ─── STUDENT ────────────────────────────────────── */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentAttendance /></ProtectedRoute>} />
        <Route path="/student/marks" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentMarks /></ProtectedRoute>} />
        <Route path="/student/assignments" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentAssignments /></ProtectedRoute>} />
        <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentNotifications /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentProfile /></ProtectedRoute>} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
