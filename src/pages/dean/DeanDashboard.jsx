import React from 'react'
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material'
import { Business, People, Book, School } from '@mui/icons-material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { StatCard, PageHeader, DataTable, LoadingScreen, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { reportService } from '../../services/reportService'
import { useAuth } from '../../context/AuthContext'

export default function DeanDashboard() {
  const { user } = useAuth()
  const { data: report, loading, error } = useApi(reportService.getSummary)

  if (loading) return <DashboardLayout><LoadingScreen /></DashboardLayout>

  const deptData = report?.departmentStats?.map(d => ({
    name: d.departmentName?.substring(0, 12),
    Students: d.studentCount,
    Faculty: d.facultyCount,
  })) || []

  const columns = [
    { field: 'departmentName', headerName: 'Department' },
    { field: 'studentCount', headerName: 'Students', renderCell: ({ value }) => <Chip label={value} size="small" sx={{ bgcolor: '#fce4ec', color: '#e94560', fontWeight: 700 }} /> },
    { field: 'facultyCount', headerName: 'Faculty', renderCell: ({ value }) => <Chip label={value} size="small" sx={{ bgcolor: '#ede7f6', color: '#6c5ce7', fontWeight: 700 }} /> },
    { field: 'subjectCount', headerName: 'Subjects', renderCell: ({ value }) => <Chip label={value} size="small" sx={{ bgcolor: '#e3f2fd', color: '#0984e3', fontWeight: 700 }} /> },
  ]

  return (
    <DashboardLayout>
      <PageHeader title={`Welcome, ${user?.name?.split(' ')[0]} 👋`} subtitle="Academic overview for today" />
      {error && <ErrorAlert message={error} />}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'Total Students', value: report?.totalStudents, icon: <School />, color: '#e94560' },
          { title: 'Total Faculty', value: report?.totalFaculty, icon: <People />, color: '#6c5ce7' },
          { title: 'Departments', value: report?.totalDepartments, icon: <Business />, color: '#0984e3' },
          { title: 'Courses', value: report?.totalCourses, icon: <Book />, color: '#00b894' },
        ].map(s => <Grid item xs={12} sm={6} lg={3} key={s.title}><StatCard {...s} /></Grid>)}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2.5}>Department Performance</Typography>
              {deptData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={deptData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Bar dataKey="Students" fill="#e94560" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Faculty" fill="#6c5ce7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No data</Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>College Summary</Typography>
              {[
                { label: 'Total Students', value: report?.totalStudents, color: '#e94560' },
                { label: 'Total Faculty', value: report?.totalFaculty, color: '#6c5ce7' },
                { label: 'HODs', value: report?.totalHods, color: '#0984e3' },
                { label: 'Departments', value: report?.totalDepartments, color: '#00b894' },
                { label: 'Courses', value: report?.totalCourses, color: '#fdcb6e' },
              ].map(item => (
                <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.2, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
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
          <Typography variant="h6" fontWeight={600} mb={2.5}>Department Statistics Table</Typography>
          <DataTable columns={columns} rows={report?.departmentStats?.map((d, i) => ({ ...d, id: i })) || []} />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
