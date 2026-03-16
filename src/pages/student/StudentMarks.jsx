import React from 'react'
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material'
import { PageHeader, DataTable, LoadingScreen, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { marksService } from '../../services/marksService'
import { useAuth } from '../../context/AuthContext'

const EXAM_COLORS = {
  INTERNAL_1: { bg: '#e3f2fd', color: '#0984e3' },
  INTERNAL_2: { bg: '#e3f2fd', color: '#0984e3' },
  MIDTERM: { bg: '#ede7f6', color: '#6c5ce7' },
  FINAL: { bg: '#fce4ec', color: '#e94560' },
  ASSIGNMENT: { bg: '#e8f5e9', color: '#00b894' },
  PRACTICAL: { bg: '#fff8e1', color: '#f39c12' },
}

export default function StudentMarks() {
  const { user } = useAuth()
  const { data: marks, loading, error } = useApi(
    () => user?.userId ? marksService.getByStudent(user.id) : Promise.resolve([]),
    [user?.userId]
  )

  const avg = marks?.length > 0 ? (marks.reduce((s, m) => s + m.marks, 0) / marks.length).toFixed(1) : 0
  const highest = marks?.length > 0 ? Math.max(...marks.map(m => m.marks)) : 0
  const lowest = marks?.length > 0 ? Math.min(...marks.map(m => m.marks)) : 0

  const columns = [
    { field: 'subjectName', headerName: 'Subject' },
    {
      field: 'examType', headerName: 'Exam Type',
      renderCell: ({ value }) => {
        const c = EXAM_COLORS[value] || { bg: '#f5f5f5', color: '#666' }
        return <Chip label={value?.replace('_', ' ')} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600, fontSize: 11 }} />
      }
    },
    {
      field: 'marks', headerName: 'Marks',
      renderCell: ({ value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography fontWeight={700} color={value >= 75 ? '#00b894' : value >= 50 ? '#f39c12' : '#e94560'} fontSize={15}>
            {value}
          </Typography>
          <Typography color="text.secondary" fontSize={12}>/100</Typography>
        </Box>
      )
    },
  ]

  if (loading) return <DashboardLayout><LoadingScreen /></DashboardLayout>

  return (
    <DashboardLayout>
      <PageHeader title="My Marks" subtitle="View all your examination results" />
      {error && <ErrorAlert message={error} />}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Average', value: avg, color: '#6c5ce7' },
          { label: 'Highest', value: highest, color: '#00b894' },
          { label: 'Lowest', value: lowest, color: '#e94560' },
          { label: 'Total Exams', value: marks?.length || 0, color: '#0984e3' },
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

      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>All Marks</Typography>
          <DataTable columns={columns} rows={marks || []} emptyMessage="No marks recorded yet" />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
