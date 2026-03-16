import React, { useState } from 'react'
import { Card, CardContent, Typography, Box, TextField, InputAdornment } from '@mui/material'
import { Search } from '@mui/icons-material'
import { PageHeader, DataTable, UserAvatar, StatusChip, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { userService } from '../../services/userService'
import { useAuth } from '../../context/AuthContext'

export default function HodStudents() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const { data: allUsers, loading, error } = useApi(
    () => user?.departmentId ? userService.getByDepartment(user.departmentId) : Promise.resolve([]),
    [user?.departmentId]
  )

  const students = allUsers?.filter(u => u.role === 'STUDENT') || []
  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    {
      field: 'name', headerName: 'Student',
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
    { field: 'active', headerName: 'Status', renderCell: ({ value }) => <StatusChip active={value} /> },
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Student Management" subtitle="View students in your department" />
      {error && <ErrorAlert message={error} />}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <TextField
            placeholder="Search students…" size="small" value={search}
            onChange={e => setSearch(e.target.value)} sx={{ mb: 2.5, width: 300 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#aaa', fontSize: 18 }} /></InputAdornment> }}
          />
          <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No students found" />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>{filtered.length} students</Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
