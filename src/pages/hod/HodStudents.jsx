import React, { useState } from 'react'
import {
  Card, CardContent, Typography, Box, TextField,
  InputAdornment, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, MenuItem
} from '@mui/material'
import { Search, Add } from '@mui/icons-material'
import { PageHeader, DataTable, UserAvatar, StatusChip, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { userService } from '../../services/userService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]
const INIT = { name: '', email: '', password: '', phone: '', semester: '', branch: '' }

export default function HodStudents() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(INIT)
  const [saving, setSaving] = useState(false)

  const { data: allUsers, loading, error, refetch } = useApi(
    () => user?.departmentId ? userService.getByDepartment(user.departmentId) : Promise.resolve([]),
    [user?.departmentId]
  )

  const students = allUsers?.data?.filter(u => u.role === 'STUDENT') ||
                   allUsers?.filter(u => u.role === 'STUDENT') || []

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password || !form.semester || !form.branch) {
      toast.error('Please fill all required fields'); return
    }
    setSaving(true)
    try {
      await userService.hodCreate({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: 'STUDENT',
        departmentId: user.departmentId,
        semester: Number(form.semester),
        branch: form.branch
      })
      toast.success('Student created successfully')
      setOpen(false)
      setForm(INIT)
      refetch()
    } catch (err) {
      toast.error(err?.message || 'Failed to create student')
    } finally { setSaving(false) }
  }

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
    {
      field: 'semester', headerName: 'Semester',
      renderCell: ({ value }) => value
        ? <Typography fontSize={13}>Sem {value}</Typography>
        : <Typography fontSize={12} color="text.secondary">—</Typography>
    },
    {
      field: 'branch', headerName: 'Branch',
      renderCell: ({ value }) => value
        ? <Typography fontSize={13}>{value}</Typography>
        : <Typography fontSize={12} color="text.secondary">—</Typography>
    },
    { field: 'active', headerName: 'Status', renderCell: ({ value }) => <StatusChip active={value} /> },
  ]

  return (
    <DashboardLayout>
      <PageHeader
        title="Student Management"
        subtitle="View and manage students in your department"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
            Add Student
          </Button>
        }
      />
      {error && <ErrorAlert message={error} />}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <TextField
            placeholder="Search students…" size="small" value={search}
            onChange={e => setSearch(e.target.value)} sx={{ mb: 2.5, width: 300 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#aaa', fontSize: 18 }} /></InputAdornment> }}
          />
          <DataTable columns={columns} rows={filtered} loading={loading}
            emptyMessage="No students found" />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
            {filtered.length} students
          </Typography>
        </CardContent>
      </Card>

      {/* Add Student Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>Add Student</Typography>
          <Typography variant="body2" color="text.secondary">
            Student will be added to your department
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
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Semester *" value={form.semester}
                onChange={e => setForm({ ...form, semester: e.target.value })}>
                {SEMESTERS.map(s => <MenuItem key={s} value={s}>Semester {s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Branch *" value={form.branch}
                onChange={e => setForm({ ...form, branch: e.target.value })}
                placeholder="e.g. Computer Science" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={saving}>
            {saving ? 'Creating…' : 'Add Student'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}