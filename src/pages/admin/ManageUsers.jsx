import React, { useState } from 'react'
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, IconButton, Tooltip, Typography,
  Card, CardContent, InputAdornment
} from '@mui/material'
import { Add, Edit, Block, CheckCircle, Search, People } from '@mui/icons-material'
import { PageHeader, DataTable, RoleChip, StatusChip, UserAvatar, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { userService } from '../../services/userService'
import { departmentService } from '../../services/departmentService'
import toast from 'react-hot-toast'

const ROLES = ['DEAN', 'HOD', 'FACULTY', 'STUDENT']

const INITIAL_FORM = { name: '', email: '', password: '', phone: '', role: '', departmentId: '' }

export default function ManageUsers() {
  const { data: users, loading, error, refetch } = useApi(userService.getAll)
  const { data: departments } = useApi(departmentService.getAll)
  const [open, setOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const openCreate = () => { setForm(INITIAL_FORM); setEditUser(null); setOpen(true) }
  const openEdit = (u) => {
    setEditUser(u)
    setForm({ name: u.name, email: u.email, password: '', phone: u.phone || '', role: u.role, departmentId: u.departmentId || '' })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.email || !form.role || (!editUser && !form.password)) {
      toast.error('Please fill all required fields'); return
    }
    setSaving(true)
    try {
      if (editUser) {
        await userService.update(editUser.id, { name: form.name, phone: form.phone, departmentId: form.departmentId || undefined })
        toast.success('User updated')
      } else {
        const payload = { name: form.name, email: form.email, password: form.password, phone: form.phone, role: form.role }
        if (form.departmentId) payload.departmentId = Number(form.departmentId)
        await userService.create(payload)
        toast.success('User created')
      }
      setOpen(false); refetch()
    } catch (err) {
      toast.error(err?.message || 'Failed to save user')
    } finally { setSaving(false) }
  }

  const handleToggle = async (u) => {
    try {
      if (u.active) { await userService.deactivate(u.id); toast.success('User deactivated') }
      else { await userService.activate(u.id); toast.success('User activated') }
      refetch()
    } catch { toast.error('Failed to update status') }
  }

  const filtered = users?.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    {
      field: 'name', headerName: 'User',
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
    { field: 'role', headerName: 'Role', renderCell: ({ value }) => <RoleChip role={value} /> },
    { field: 'departmentName', headerName: 'Department' },
    { field: 'active', headerName: 'Status', renderCell: ({ value }) => <StatusChip active={value} /> },
    {
      field: 'actions', headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(row)}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title={row.active ? 'Deactivate' : 'Activate'}>
            <IconButton size="small" onClick={() => handleToggle(row)} sx={{ color: row.active ? '#e94560' : '#00b894' }}>
              {row.active ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <DashboardLayout>
      <PageHeader
        title="User Management"
        subtitle="Create and manage all college users"
        action={<Button variant="contained" startIcon={<Add />} onClick={openCreate}>Create User</Button>}
      />
      {error && <ErrorAlert message={error} />}

      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ mb: 2.5 }}>
            <TextField
              placeholder="Search by name, email or role…"
              size="small"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ width: 320 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#aaa', fontSize: 18 }} /></InputAdornment> }}
            />
          </Box>
          <DataTable columns={columns} rows={filtered || []} loading={loading} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
            {filtered?.length || 0} users found
          </Typography>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>{editUser ? 'Edit User' : 'Create New User'}</Typography>
          <Typography variant="body2" color="text.secondary">
            {editUser ? 'Update user information' : 'Only admins can create users'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </Grid>
            {!editUser && <>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Password *" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Role *" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </TextField>
              </Grid>
            </>}
            <Grid item xs={12} sm={editUser ? 12 : 6}>
              <TextField fullWidth select label="Department" value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })}>
                <MenuItem value="">None</MenuItem>
                {departments?.map(d => <MenuItem key={d.id} value={d.id}>{d.departmentName}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? 'Saving…' : editUser ? 'Save Changes' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}
