import React, { useState } from 'react'
import {
  Card, CardContent, Typography, Box, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { PageHeader, DataTable, UserAvatar, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { userService } from '../../services/userService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const INIT = { name: '', email: '', password: '', phone: '' }

export default function HodFaculty() {
  const { user } = useAuth()
  const { data: allUsers, loading, error, refetch } = useApi(
    () => user?.departmentId ? userService.getByDepartment(user.departmentId) : Promise.resolve([]),
    [user?.departmentId]
  )
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(INIT)
  const [saving, setSaving] = useState(false)

  const faculty = allUsers?.data?.filter(u => u.role === 'FACULTY') ||
                  allUsers?.filter(u => u.role === 'FACULTY') || []

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all required fields'); return
    }
    setSaving(true)
    try {
      await userService.hodCreate({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: 'FACULTY',
        departmentId: user.departmentId
      })
      toast.success('Faculty created successfully')
      setOpen(false)
      setForm(INIT)
      refetch()
    } catch (err) {
      toast.error(err?.message || 'Failed to create faculty')
    } finally { setSaving(false) }
  }

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
        <Box sx={{ px: 1.5, py: 0.4, borderRadius: 10, display: 'inline-block',
          bgcolor: value ? '#e8f5e9' : '#fce4ec',
          color: value ? '#00b894' : '#e94560', fontSize: 12, fontWeight: 600 }}>
          {value ? 'Active' : 'Inactive'}
        </Box>
      )
    }
  ]

  return (
    <DashboardLayout>
      <PageHeader
        title="Faculty Management"
        subtitle="View and manage faculty in your department"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
            Add Faculty
          </Button>
        }
      />
      {error && <ErrorAlert message={error} />}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {faculty.length} faculty members
          </Typography>
          <DataTable columns={columns} rows={faculty} loading={loading}
            emptyMessage="No faculty in your department" />
        </CardContent>
      </Card>

      {/* Add Faculty Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>Add Faculty</Typography>
          <Typography variant="body2" color="text.secondary">
            Faculty will be added to your department
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name *" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email *" type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Password *" type="password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={saving}>
            {saving ? 'Creating…' : 'Add Faculty'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}