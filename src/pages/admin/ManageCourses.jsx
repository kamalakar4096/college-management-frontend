import React, { useState } from 'react'
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, Card, CardContent, Typography, IconButton, Tooltip
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { PageHeader, DataTable, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { courseService } from '../../services/courseService'
import { departmentService } from '../../services/departmentService'
import toast from 'react-hot-toast'

export default function ManageCourses() {
  const { data: courses, loading, error, refetch } = useApi(courseService.getAll)
  const { data: departments } = useApi(departmentService.getAll)
  const [open, setOpen] = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const [form, setForm] = useState({ courseName: '', courseCode: '', credits: '', departmentId: '' })
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setForm({ courseName: '', courseCode: '', credits: '', departmentId: '' }); setEditCourse(null); setOpen(true) }
  const openEdit = (c) => { setEditCourse(c); setForm({ courseName: c.courseName, courseCode: c.courseCode, credits: c.credits, departmentId: c.departmentId }); setOpen(true) }

  const handleSave = async () => {
    if (!form.courseName || !form.courseCode || !form.departmentId) { toast.error('Please fill required fields'); return }
    setSaving(true)
    try {
      const payload = { courseName: form.courseName, courseCode: form.courseCode, credits: Number(form.credits) || 0, departmentId: Number(form.departmentId) }
      if (editCourse) { await courseService.update(editCourse.id, payload); toast.success('Course updated') }
      else { await courseService.create(payload); toast.success('Course created') }
      setOpen(false); refetch()
    } catch (err) { toast.error(err?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return
    try { await courseService.delete(id); toast.success('Course deleted'); refetch() }
    catch { toast.error('Failed to delete') }
  }

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'courseName', headerName: 'Course Name' },
    { field: 'courseCode', headerName: 'Code' },
    { field: 'credits', headerName: 'Credits' },
    { field: 'departmentName', headerName: 'Department' },
    {
      field: 'actions', headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(row)}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" sx={{ color: '#e94560' }} onClick={() => handleDelete(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
        </Box>
      )
    }
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Course Management" subtitle="Manage academic courses"
        action={<Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Course</Button>} />
      {error && <ErrorAlert message={error} />}
      <Card><CardContent sx={{ p: 2.5 }}>
        <DataTable columns={columns} rows={courses || []} loading={loading} />
      </CardContent></Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle><Typography variant="h6" fontWeight={700}>{editCourse ? 'Edit Course' : 'Create Course'}</Typography></DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}><TextField fullWidth label="Course Name *" value={form.courseName} onChange={e => setForm({ ...form, courseName: e.target.value })} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Credits" type="number" value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Course Code *" value={form.courseCode} onChange={e => setForm({ ...form, courseCode: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Department *" value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })}>
                <MenuItem value="">Select</MenuItem>
                {departments?.map(d => <MenuItem key={d.id} value={d.id}>{d.departmentName}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>{saving ? 'Saving…' : editCourse ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}
