import React, { useState } from 'react'
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, Card, CardContent, Typography,
  IconButton, Tooltip, Chip
} from '@mui/material'
import { Add, Edit, Business } from '@mui/icons-material'
import { PageHeader, DataTable, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { departmentService } from '../../services/departmentService'
import { userService } from '../../services/userService'
import toast from 'react-hot-toast'

export default function ManageDepartments() {
  const { data: departments, loading, error, refetch } = useApi(departmentService.getAll)
  const { data: hods } = useApi(() => userService.getByRole('HOD'))
  const [open, setOpen] = useState(false)
  const [editDept, setEditDept] = useState(null)
  const [form, setForm] = useState({ departmentName: '', hodId: '' })
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setForm({ departmentName: '', hodId: '' }); setEditDept(null); setOpen(true) }
  const openEdit = (d) => { setEditDept(d); setForm({ departmentName: d.departmentName, hodId: d.hodId || '' }); setOpen(true) }

  const handleSave = async () => {
    if (!form.departmentName) { toast.error('Department name is required'); return }
    setSaving(true)
    try {
      const payload = { departmentName: form.departmentName }
      if (form.hodId) payload.hodId = Number(form.hodId)
      if (editDept) { await departmentService.update(editDept.id, payload); toast.success('Department updated') }
      else { await departmentService.create(payload); toast.success('Department created') }
      setOpen(false); refetch()
    } catch (err) { toast.error(err?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'departmentName', headerName: 'Department Name' },
    { field: 'hodName', headerName: 'HOD', renderCell: ({ value }) => value || <Typography color="text.secondary" fontSize={13}>Not assigned</Typography> },
    { field: 'hodEmail', headerName: 'HOD Email' },
    { field: 'totalMembers', headerName: 'Members', renderCell: ({ value }) => <Chip label={value} size="small" sx={{ bgcolor: '#e3f2fd', color: '#0984e3', fontWeight: 600 }} /> },
    {
      field: 'actions', headerName: 'Actions',
      renderCell: ({ row }) => (
        <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(row)}><Edit fontSize="small" /></IconButton></Tooltip>
      )
    }
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Department Management" subtitle="Manage academic departments and HOD assignments"
        action={<Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Department</Button>} />
      {error && <ErrorAlert message={error} />}
      <Card><CardContent sx={{ p: 2.5 }}>
        <DataTable columns={columns} rows={departments || []} loading={loading} />
      </CardContent></Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>{editDept ? 'Edit Department' : 'Create Department'}</Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Department Name *" value={form.departmentName} onChange={e => setForm({ ...form, departmentName: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth select label="Assign HOD" value={form.hodId} onChange={e => setForm({ ...form, hodId: e.target.value })}>
                <MenuItem value="">None</MenuItem>
                {hods?.map(h => <MenuItem key={h.id} value={h.id}>{h.name} — {h.email}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>{saving ? 'Saving…' : editDept ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}
