import React from 'react'
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from 'recharts'
import { School, People, Business, Book } from '@mui/icons-material'
import { StatCard, PageHeader, DataTable, LoadingScreen, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { reportService } from '../../services/reportService'

export default function AdminReports() {
  const { data: report, loading, error } = useApi(reportService.getSummary)

  if (loading) return <DashboardLayout><LoadingScreen /></DashboardLayout>

  const deptData = report?.departmentStats?.map(d => ({
    name: d.departmentName?.substring(0, 14),
    Students: d.studentCount,
    Faculty: d.facultyCount,
    Subjects: d.subjectCount,
  })) || []

  const columns = [
    { field: 'departmentName', headerName: 'Department' },
    { field: 'studentCount', headerName: 'Students', renderCell: ({ value }) => <Chip label={value} size="small" sx={{ bgcolor: '#fce4ec', color: '#e94560', fontWeight: 700 }} /> },
    { field: 'facultyCount', headerName: 'Faculty', renderCell: ({ value }) => <Chip label={value} size="small" sx={{ bgcolor: '#ede7f6', color: '#6c5ce7', fontWeight: 700 }} /> },
    { field: 'subjectCount', headerName: 'Subjects', renderCell: ({ value }) => <Chip label={value} size="small" sx={{ bgcolor: '#e3f2fd', color: '#0984e3', fontWeight: 700 }} /> },
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Reports & Analytics" subtitle="College-wide academic statistics" />
      {error && <ErrorAlert message={error} />}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'Total Students', value: report?.totalStudents, icon: <School />, color: '#e94560' },
          { title: 'Total Faculty', value: report?.totalFaculty, icon: <People />, color: '#6c5ce7' },
          { title: 'Departments', value: report?.totalDepartments, icon: <Business />, color: '#0984e3' },
          { title: 'Total Courses', value: report?.totalCourses, icon: <Book />, color: '#00b894' },
        ].map(s => <Grid item xs={12} sm={6} lg={3} key={s.title}><StatCard {...s} /></Grid>)}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2.5}>Students & Faculty per Department</Typography>
              {deptData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={deptData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Bar dataKey="Students" fill="#e94560" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Faculty" fill="#6c5ce7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Subjects" fill="#0984e3" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                  No data available
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2.5}>Summary</Typography>
              {[
                { label: 'Total Students', value: report?.totalStudents, color: '#e94560' },
                { label: 'Total Faculty', value: report?.totalFaculty, color: '#6c5ce7' },
                { label: 'Total HODs', value: report?.totalHods, color: '#0984e3' },
                { label: 'Total Deans', value: report?.totalDeans, color: '#00b894' },
                { label: 'Departments', value: report?.totalDepartments, color: '#fdcb6e' },
                { label: 'Courses', value: report?.totalCourses, color: '#fd79a8' },
              ].map(item => (
                <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.2, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <Typography fontSize={13.5} color="text.secondary">{item.label}</Typography>
                  <Typography fontSize={15} fontWeight={700} sx={{ color: item.color }}>{item.value ?? 0}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2.5}>Department-wise Statistics</Typography>
          <DataTable
            columns={columns}
            rows={report?.departmentStats?.map((d, i) => ({ ...d, id: i })) || []}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
