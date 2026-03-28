import React, { useState } from 'react'
import {
  Box, Card, CardContent, Typography, Button, TextField, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, List, ListItem, ListItemText, Divider, MenuItem
} from '@mui/material'
import { Add, Assignment, People } from '@mui/icons-material'
import { PageHeader, ErrorAlert, LoadingScreen } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { assignmentService } from '../../services/assignmentService'
import { subjectService } from '../../services/subjectService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function FacultyAssignments() {
  const { user } = useAuth()
  const { data: assignmentsData, loading, error, refetch } = useApi(() => assignmentService.getByFaculty(user?.id) , [user?.id])
const assignments = assignmentsData?.data || assignmentsData || []

const { data: subjectsData } = useApi(() => subjectService.getMySubjects(), [])
const subjects = subjectsData?.data || subjectsData || []
  const [open, setOpen] = useState(false)
  const [viewSubmissions, setViewSubmissions] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [form, setForm] = useState({ title: '', description: '', subjectId: '', deadline: '' })
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleCreate = async () => {
    if (!form.title || !form.deadline) { toast.error('Fill required fields'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('data', new Blob([JSON.stringify({
        title: form.title, description: form.description,
        subjectId: form.subjectId ? Number(form.subjectId) : undefined,
        deadline: form.deadline + ':00',
      })], { type: 'application/json' }))
      if (file) fd.append('file', file)
      await assignmentService.create(fd)
      toast.success('Assignment created'); setOpen(false)
      setForm({ title: '', description: '', subjectId: '', deadline: '' }); setFile(null); refetch()
    } catch (err) { toast.error(err?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const loadSubmissions = async (a) => {
    setViewSubmissions(a)
    try {
      const data = await assignmentService.getSubmissions(a.id)
      setSubmissions(data)
    } catch { setSubmissions([]) }
  }

  if (loading) return <DashboardLayout><LoadingScreen /></DashboardLayout>

  return (
    <DashboardLayout>
      <PageHeader title="Assignments" subtitle="Create and manage assignments"
        action={<Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Create Assignment</Button>} />
      {error && <ErrorAlert message={error} />}

      <Grid container spacing={2.5}>
        {assignments?.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 5, textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 48, color: '#ddd', mb: 1 }} />
                <Typography color="text.secondary">No assignments yet. Create your first one!</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        {assignments?.map(a => (
          <Grid item xs={12} md={6} key={a.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography fontWeight={600} fontSize={15}>{a.title}</Typography>
                  <Chip label={`${a.totalSubmissions} submitted`} size="small" sx={{ bgcolor: '#e8f5e9', color: '#00b894', fontWeight: 600, fontSize: 11 }} />
                </Box>
                {a.description && <Typography fontSize={13} color="text.secondary" sx={{ mb: 1.5 }}>{a.description}</Typography>}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {a.subjectName && <Chip label={a.subjectName} size="small" variant="outlined" sx={{ fontSize: 11 }} />}
                  <Chip
                    label={`Due: ${new Date(a.deadline).toLocaleDateString()}`}
                    size="small"
                    sx={{ bgcolor: new Date(a.deadline) < new Date() ? '#fce4ec' : '#e3f2fd', color: new Date(a.deadline) < new Date() ? '#e94560' : '#0984e3', fontSize: 11, fontWeight: 600 }}
                  />
                </Box>
                <Button size="small" startIcon={<People />} onClick={() => loadSubmissions(a)} variant="outlined" sx={{ fontSize: 12 }}>
                  View Submissions
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle><Typography variant="h6" fontWeight={700}>Create Assignment</Typography></DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Subject" value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
                <MenuItem value="">None</MenuItem>
                {subjects?.map(s => <MenuItem key={s.id} value={s.id}>{s.subjectName}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="datetime-local" label="Deadline *" value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={600} color="text.secondary" mb={0.5}>Attachment (optional)</Typography>
              <input type="file" onChange={e => setFile(e.target.files[0])} style={{ fontSize: 13 }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={saving}>{saving ? 'Creating…' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Submissions Dialog */}
      <Dialog open={!!viewSubmissions} onClose={() => setViewSubmissions(null)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>Submissions — {viewSubmissions?.title}</Typography>
          <Typography variant="body2" color="text.secondary">{submissions.length} submission(s)</Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {submissions.length === 0
            ? <Typography color="text.secondary" py={3} textAlign="center">No submissions yet</Typography>
            : <List disablePadding>
              {submissions.map((s, i) => (
                <React.Fragment key={s.id}>
                  {i > 0 && <Divider />}
                  <ListItem disablePadding sx={{ py: 1.5 }}>
                    <ListItemText
                      primary={s.studentName}
                      secondary={`Submitted: ${new Date(s.submittedAt).toLocaleString()}`}
                      primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
                      secondaryTypographyProps={{ fontSize: 12 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip label={s.status} size="small" sx={{
                        bgcolor: s.status === 'LATE' ? '#fff8e1' : '#e8f5e9',
                        color: s.status === 'LATE' ? '#f39c12' : '#00b894',
                        fontWeight: 600, fontSize: 11
                      }} />
                      {s.fileUrl && <Button size="small" variant="outlined" href={s.fileUrl} target="_blank" sx={{ fontSize: 11 }}>Download</Button>}
                    </Box>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setViewSubmissions(null)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}
