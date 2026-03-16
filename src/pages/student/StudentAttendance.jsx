import React from 'react'
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material'
import { PageHeader, DataTable, AttendanceChip, AttendanceBar, LoadingScreen, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { attendanceService } from '../../services/attendanceService'
import { useAuth } from '../../context/AuthContext'

export default function StudentAttendance() {
  const { user } = useAuth()
  const { data: attendance, loading, error } = useApi(
    () => user?.userId ? attendanceService.getByStudent(user.id) : Promise.resolve([]),
    [user?.userId]
  )

  const present = attendance?.filter(a => a.status === 'PRESENT').length || 0
  const absent = attendance?.filter(a => a.status === 'ABSENT').length || 0
  const late = attendance?.filter(a => a.status === 'LATE').length || 0
  const total = attendance?.length || 0
  const pct = total > 0 ? ((present / total) * 100) : 0

  const columns = [
    { field: 'subjectName', headerName: 'Subject' },
    { field: 'date', headerName: 'Date', renderCell: ({ value }) => new Date(value).toLocaleDateString() },
    { field: 'status', headerName: 'Status', renderCell: ({ value }) => <AttendanceChip status={value} /> },
  ]

  if (loading) return <DashboardLayout><LoadingScreen /></DashboardLayout>

  return (
    <DashboardLayout>
      <PageHeader title="My Attendance" subtitle="Track your attendance across all subjects" />
      {error && <ErrorAlert message={error} />}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Overall Attendance', value: `${pct.toFixed(1)}%`, color: pct >= 75 ? '#00b894' : '#e94560', bg: pct >= 75 ? '#e8f5e9' : '#fce4ec' },
          { label: 'Present', value: present, color: '#00b894', bg: '#e8f5e9' },
          { label: 'Absent', value: absent, color: '#e94560', bg: '#fce4ec' },
          { label: 'Late', value: late, color: '#f39c12', bg: '#fff8e1' },
        ].map(item => (
          <Grid item xs={6} sm={3} key={item.label}>
            <Card>
              <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={800} sx={{ color: item.color }}>{item.value}</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>{item.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" fontWeight={600} mb={1.5}>Overall Progress</Typography>
          <AttendanceBar percentage={pct} />
          {pct < 75 && (
            <Typography variant="caption" sx={{ color: '#e94560', mt: 1, display: 'block' }}>
              ⚠ Your attendance is below 75%. Attend more classes to avoid detainment.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>Attendance History</Typography>
          <DataTable columns={columns} rows={attendance || []} emptyMessage="No attendance records" />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
