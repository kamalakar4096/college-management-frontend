import React, { useState } from 'react'
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, Card, CardContent, Typography,
  IconButton, Tooltip, Chip
} from '@mui/material'
import { Add, Edit, PersonAdd } from '@mui/icons-material'
import { PageHeader, DataTable, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { subjectService } from '../../services/subjectService'
import { userService } from '../../services/userService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function HodSubjects() {
  const { user } = useAuth()
  const deptId = user?.departmentId
  const { data: subjects, loading, error, refetch } = useApi(() => deptId ? subjectService.getByDepartment(deptId) : Promise.resolve([]), [deptId])
  const { data: allUsers } = useApi(() => deptId ? userService.getByDepartment(deptId) : Promise.resolve([]), [deptId])
  const faculty = allUsers?.filter(u => u.role === 'FACULTY') || []

  const [openCreate, setOpenCreate] = useState(false)
  const [openAssign, setOpenAssign] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [form, setForm] = useState({ subjectName: '', semester: '', facultyId: '' })
  const [assignFacultyId, setAssignFacultyId] = useState('')
  const [saving, setSaving] = useState(false)

  const handleCreate = async () => {
    if (!form.subjectName || !form.semester) { toast.error('Fill required fields'); return }
    setSaving(true)
    try {
      const payload = { subjectName: form.subjectName, semester: Number(form.semester), departmentId: deptId }
      if (form.facultyId) payload.facultyId = Number(form.facultyId)
      await subjectService.create(payload)
      toast.success('Subject created')
      setOpenCreate(false); setForm({ subjectName: '', semester: '', facultyId: '' }); refetch()
    } catch (err) { toast.error(err?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleAssignFaculty = async () => {
    if (!assignFacultyId) { toast.error('Select a faculty'); return }
    setSaving(true)
    try {
      await subjectService.assignFaculty(selectedSubject.id, Number(assignFacultyId))
      toast.success('Faculty assigned'); setOpenAssign(false); refetch()
    } catch (err) { toast.error(err?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const columns = [
    { field: 'subjectName', headerName: 'Subject' },
    { field: 'semester', headerName: 'Semester', renderCell: ({ value }) => <Chip label={`Sem ${value}`} size="small" sx={{ bgcolor: '#e3f2fd', color: '#0984e3', fontWeight: 600 }} /> },
    {
      field: 'facultyName', headerName: 'Assigned Faculty',
      renderCell: ({ value }) => value
        ? <Typography fontSize={13.5} color="#00b894" fontWeight={500}>{value}</Typography>
        : <Typography fontSize={13} color="text.secondary">Unassigned</Typography>
    },
    {
      field: 'actions', headerName: 'Actions',
      renderCell: ({ row }) => (
        <Tooltip title="Assign Faculty">
          <IconButton size="small" sx={{ color: '#6c5ce7' }} onClick={() => { setSelectedSubject(row); setAssignFacultyId(row.facultyId || ''); setOpenAssign(true) }}>
            <PersonAdd fontSize="small" />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Subject Allocation" subtitle="Create subjects and assign faculty"
        action={<Button variant="contained" startIcon={<Add />} onClick={() => setOpenCreate(true)}>Add Subject</Button>} />
      {error && <ErrorAlert message={error} />}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <DataTable columns={columns} rows={subjects || []} loading={loading} emptyMessage="No subjects yet" />
        </CardContent>
      </Card>

      {/* Create Subject Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle><Typography variant="h6" fontWeight={700}>Create Subject</Typography></DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField fullWidth label="Subject Name *" value={form.subjectName} onChange={e => setForm({ ...form, subjectName: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth select label="Semester *" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}>
                {[1,2,3,4,5,6,7,8].map(s => <MenuItem key={s} value={s}>Semester {s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth select label="Assign Faculty (optional)" value={form.facultyId} onChange={e => setForm({ ...form, facultyId: e.target.value })}>
                <MenuItem value="">None</MenuItem>
                {faculty.map(f => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpenCreate(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={saving}>{saving ? 'Creating…' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Faculty Dialog */}
      <Dialog open={openAssign} onClose={() => setOpenAssign(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>Assign Faculty</Typography>
          <Typography variant="body2" color="text.secondary">{selectedSubject?.subjectName}</Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField fullWidth select label="Select Faculty" value={assignFacultyId} onChange={e => setAssignFacultyId(e.target.value)}>
            <MenuItem value="">None</MenuItem>
            {faculty.map(f => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpenAssign(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleAssignFaculty} variant="contained" disabled={saving}>{saving ? 'Assigning…' : 'Assign'}</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}
