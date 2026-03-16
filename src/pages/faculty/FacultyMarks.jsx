import React, { useState } from 'react'
import {
  Box, Card, CardContent, Typography, Button, MenuItem, TextField,
  Grid, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
} from '@mui/material'
import { Add, Grade } from '@mui/icons-material'
import { PageHeader, DataTable, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { subjectService } from '../../services/subjectService'
import { userService } from '../../services/userService'
import { marksService } from '../../services/marksService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const EXAM_TYPES = ['INTERNAL_1', 'INTERNAL_2', 'MIDTERM', 'FINAL', 'ASSIGNMENT', 'PRACTICAL']
const INIT = { studentId: '', subjectId: '', marks: '', examType: '' }

export default function FacultyMarks() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(INIT)
  const [saving, setSaving] = useState(false)
  const [viewStudentId, setViewStudentId] = useState('')
  const { data: subjects } = useApi(() => user?.userId ? subjectService.getByFaculty(user.id) : Promise.resolve([]), [user?.userId])
  const { data: deptUsers } = useApi(() => user?.departmentId ? userService.getByDepartment(user.departmentId) : Promise.resolve([]), [user?.departmentId])
  const { data: studentMarks, loading: mLoading, refetch: mRefetch } = useApi(
    () => viewStudentId ? marksService.getByStudent(viewStudentId) : Promise.resolve([]),
    [viewStudentId]
  )

  const students = deptUsers?.filter(u => u.role === 'STUDENT') || []

  const handleAdd = async () => {
    if (!form.studentId || !form.subjectId || !form.marks || !form.examType) { toast.error('Fill all fields'); return }
    setSaving(true)
    try {
      await marksService.add({ studentId: Number(form.studentId), subjectId: Number(form.subjectId), marks: Number(form.marks), examType: form.examType })
      toast.success('Marks added'); setOpen(false); setForm(INIT); mRefetch()
    } catch (err) { toast.error(err?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const columns = [
    { field: 'subjectName', headerName: 'Subject' },
    { field: 'examType', headerName: 'Exam Type' },
    { field: 'marks', headerName: 'Marks', renderCell: ({ value }) => <Typography fontWeight={700} color="#0984e3">{value}/100</Typography> },
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Marks Management" subtitle="Add and manage student marks"
        action={<Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Marks</Button>} />

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" fontWeight={600} mb={1.5} color="text.secondary">View student marks</Typography>
          <TextField select label="Select Student" value={viewStudentId} onChange={e => setViewStudentId(e.target.value)} sx={{ minWidth: 280 }} size="small">
            <MenuItem value="">Select a student</MenuItem>
            {students.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </TextField>
        </CardContent>
      </Card>

      {viewStudentId && (
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Marks — {students.find(s => String(s.id) === String(viewStudentId))?.name}
            </Typography>
            <DataTable columns={columns} rows={studentMarks || []} loading={mLoading} emptyMessage="No marks recorded" />
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle><Typography variant="h6" fontWeight={700}>Add Marks</Typography></DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Student *" value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })}>
                <MenuItem value="">Select</MenuItem>
                {students.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Subject *" value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
                <MenuItem value="">Select</MenuItem>
                {subjects?.map(s => <MenuItem key={s.id} value={s.id}>{s.subjectName}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Exam Type *" value={form.examType} onChange={e => setForm({ ...form, examType: e.target.value })}>
                <MenuItem value="">Select</MenuItem>
                {EXAM_TYPES.map(e => <MenuItem key={e} value={e}>{e.replace('_', ' ')}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Marks (0-100) *" value={form.marks}
                onChange={e => setForm({ ...form, marks: e.target.value })}
                inputProps={{ min: 0, max: 100 }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={saving}>{saving ? 'Saving…' : 'Add Marks'}</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}
