import React, { useState } from 'react'
import {
  Grid, Card, CardContent, Typography, Box, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
} from '@mui/material'
import { Assignment, Upload, CheckCircle } from '@mui/icons-material'
import { PageHeader, LoadingScreen, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { assignmentService } from '../../services/assignmentService'
import { subjectService } from '../../services/subjectService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function StudentAssignments() {
  const { user } = useAuth()
  const { data: subjects } = useApi(
    () => user?.departmentId ? subjectService.getByDepartment(user.departmentId) : Promise.resolve([]),
    [user?.departmentId]
  )

  // Gather all assignments from all subjects
  const [allAssignments, setAllAssignments] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [submitOpen, setSubmitOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  React.useEffect(() => {
    if (!subjects?.length) { setLoading(false); return }
    const fetch = async () => {
      try {
        const results = await Promise.all(subjects.map(s => assignmentService.getBySubject(s.id)))
        setAllAssignments(results.flat())
      } catch { setAllAssignments([]) }
      finally { setLoading(false) }
    }
    fetch()
  }, [subjects])

  const handleSubmit = async () => {
    if (!file) { toast.error('Select a file'); return }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      await assignmentService.submit(selectedAssignment.id, fd)
      toast.success('Assignment submitted!'); setSubmitOpen(false); setFile(null)
    } catch (err) { toast.error(err?.message || 'Failed to submit') }
    finally { setSubmitting(false) }
  }

  const isOverdue = (deadline) => new Date(deadline) < new Date()

  if (loading) return <DashboardLayout><LoadingScreen /></DashboardLayout>

  return (
    <DashboardLayout>
      <PageHeader title="Assignments" subtitle="View and submit your assignments" />

      <Grid container spacing={2.5}>
        {allAssignments.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 5, textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 48, color: '#ddd', mb: 1 }} />
                <Typography color="text.secondary">No assignments available</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {allAssignments.map(a => {
          const overdue = isOverdue(a.deadline)
          return (
            <Grid item xs={12} md={6} key={a.id}>
              <Card sx={{ height: '100%', borderLeft: `4px solid ${overdue ? '#e94560' : '#00b894'}` }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography fontWeight={600} fontSize={15}>{a.title}</Typography>
                    <Chip
                      label={overdue ? 'Overdue' : 'Active'}
                      size="small"
                      sx={{ bgcolor: overdue ? '#fce4ec' : '#e8f5e9', color: overdue ? '#e94560' : '#00b894', fontWeight: 600, fontSize: 11 }}
                    />
                  </Box>
                  {a.description && <Typography fontSize={13} color="text.secondary" mb={1.5}>{a.description}</Typography>}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {a.subjectName && <Chip label={a.subjectName} size="small" variant="outlined" sx={{ fontSize: 11 }} />}
                    <Chip label={`By: ${a.facultyName}`} size="small" sx={{ bgcolor: '#f5f5f5', fontSize: 11 }} />
                    <Chip label={`Due: ${new Date(a.deadline).toLocaleDateString()}`} size="small" sx={{ bgcolor: overdue ? '#fce4ec' : '#e3f2fd', color: overdue ? '#e94560' : '#0984e3', fontSize: 11 }} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {a.fileUrl && (
                      <Button size="small" variant="outlined" href={a.fileUrl} target="_blank" sx={{ fontSize: 12 }}>
                        Download
                      </Button>
                    )}
                    <Button size="small" variant="contained" startIcon={<Upload />}
                      onClick={() => { setSelectedAssignment(a); setSubmitOpen(true) }}
                      disabled={overdue}
                      sx={{ fontSize: 12 }}>
                      Submit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Dialog open={submitOpen} onClose={() => setSubmitOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>Submit Assignment</Typography>
          <Typography variant="body2" color="text.secondary">{selectedAssignment?.title}</Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, mb: 2 }}>
            <Typography fontSize={13} color="text.secondary">
              Deadline: <strong>{selectedAssignment && new Date(selectedAssignment.deadline).toLocaleString()}</strong>
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={600} mb={1}>Upload your submission file *</Typography>
          <input type="file" onChange={e => setFile(e.target.files[0])} style={{ fontSize: 13 }} />
          {file && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Selected: {file.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setSubmitOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <CheckCircle />}>
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}
