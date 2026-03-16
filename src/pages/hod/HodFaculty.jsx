import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { PageHeader, DataTable, UserAvatar, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { userService } from '../../services/userService'
import { useAuth } from '../../context/AuthContext'

export default function HodFaculty() {
  const { user } = useAuth()
  const { data: allUsers, loading, error } = useApi(
    () => user?.departmentId ? userService.getByDepartment(user.departmentId) : Promise.resolve([]),
    [user?.departmentId]
  )

  const faculty = allUsers?.filter(u => u.role === 'FACULTY') || []

  const columns = [
    {
      field: 'name', headerName: 'Faculty',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <UserAvatar name={row.name} size={32} />
          <Box>
            <Typography fontSize={13.5} fontWeight={500}>{row.name}</Typography>
            <Typography fontSize={12} color="text.secondary">{row.email}</Typography>
          </Box>
        </Box>
      )
    },
    { field: 'phone', headerName: 'Phone' },
    { field: 'departmentName', headerName: 'Department' },
    {
      field: 'active', headerName: 'Status',
      renderCell: ({ value }) => (
        <Box sx={{ px: 1.5, py: 0.4, borderRadius: 10, display: 'inline-block', bgcolor: value ? '#e8f5e9' : '#fce4ec', color: value ? '#00b894' : '#e94560', fontSize: 12, fontWeight: 600 }}>
          {value ? 'Active' : 'Inactive'}
        </Box>
      )
    }
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Faculty Management" subtitle="View and manage faculty in your department" />
      {error && <ErrorAlert message={error} />}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="body2" color="text.secondary" mb={2}>{faculty.length} faculty members</Typography>
          <DataTable columns={columns} rows={faculty} loading={loading} emptyMessage="No faculty in your department" />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
