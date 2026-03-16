import React from 'react'
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { PageHeader, DataTable, LoadingScreen, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { reportService } from '../../services/reportService'

export default function DeanReports() {
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
      <PageHeader title="Academic Reports" subtitle="College-wide performance data" />
      {error && <ErrorAlert message={error} />}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2.5}>Department Comparison</Typography>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none' }} />
                <Legend />
                <Bar dataKey="Students" fill="#e94560" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Faculty" fill="#6c5ce7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Subjects" fill="#0984e3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No data</Box>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2.5}>Department Statistics</Typography>
          <DataTable columns={columns} rows={report?.departmentStats?.map((d, i) => ({ ...d, id: i })) || []} />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
