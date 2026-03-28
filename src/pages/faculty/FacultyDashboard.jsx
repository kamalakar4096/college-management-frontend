import React, { useState } from 'react'
import {
  Grid, Card, CardContent, Typography, Box, List, ListItem,
  ListItemText, Divider, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material'
import { Class, Assignment, Grade, HowToReg, PersonAdd } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { StatCard, PageHeader, LoadingScreen } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { subjectService } from '../../services/subjectService'
import { assignmentService } from '../../services/assignmentService'
import { userService } from '../../services/userService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]
const INIT = { name: '', email: '', password: '', phone: '', semester: '', branch: '' }

export default function FacultyDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(INIT)
  const [saving, setSaving] = useState(false)

  const { data: mySubjectsData } = useApi(
    () => subjectService.getMySubjects(), []
  )
  const mySubjects = mySubjectsData?.data || mySubjectsData || []

  const { data: assignmentsData } = useApi(
    () => user?.id ? assignmentService.getByFaculty(user.id) : Promise.resolve([]),
    [user?.id]
  )
  const assignments = assignmentsData?.data || assignmentsData || []
  const upcoming = assignments.filter(a => new Date(a.deadline) > new Date())

  const handleAddStudent = async () => {
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
      toast.success('Student added successfully!')
      setOpen(false)
      setForm(INIT)
    } catch (err) {
      toast.error(err?.message || 'Failed to add student')
    } finally { setSaving(false) }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={`Hello, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Your teaching overview for today"
        action={
          <Button variant="contained" startIcon={<PersonAdd />}
            onClick={() => setOpen(true)}>
            Add Student
          </Button>
        }
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'My Subjects', value: mySubjects?.length ?? 0, icon: <Class />, color: '#6c5ce7' },
          { title: 'Assignments Created', value: assignments?.length ?? 0, icon: <Assignment />, color: '#e94560' },
          { title: 'Upcoming Deadlines', value: upcoming.length, icon: <HowToReg />, color: '#f39c12' },
        ].map(s => <Grid item xs={12} sm={4} key={s.title}><StatCard {...s} /></Grid>)}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>My Subjects</Typography>
                <Button size="small" onClick={() => navigate('/faculty/attendance')}>Mark Attendance</Button>
              </Box>
              {!mySubjects?.length
                ? <Typography color="text.secondary" fontSize={13}>No subjects assigned yet</Typography>
                : <List disablePadding>
                  {mySubjects.map((s, i) => (
                    <React.Fragment key={s.id}>
                      {i > 0 && <Divider />}
                      <ListItem disablePadding sx={{ py: 1.2 }}>
                        <ListItemText
                          primary={s.subjectName}
                          secondary={`Semester ${s.semester} • ${s.departmentName || ''}`}
                          primaryTypographyProps={{ fontSize: 13.5, fontWeight: 500 }}
                          secondaryTypographyProps={{ fontSize: 12 }}
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Upcoming Deadlines</Typography>
                <Button size="small" onClick={() => navigate('/faculty/assignments')}>View All</Button>
              </Box>
              {upcoming.length === 0
                ? <Typography color="text.secondary" fontSize={13}>No upcoming deadlines</Typography>
                : <List disablePadding>
                  {upcoming.slice(0, 5).map((a, i) => (
                    <React.Fragment key={a.id}>
                      {i > 0 && <Divider />}
                      <ListItem disablePadding sx={{ py: 1.2 }}>
                        <ListItemText
                          primary={a.title}
                          secondary={`Due: ${new Date(a.deadline).toLocaleDateString()}`}
                          primaryTypographyProps={{ fontSize: 13.5, fontWeight: 500 }}
                          secondaryTypographyProps={{ fontSize: 12 }}
                        />
                        <Chip label={`${a.totalSubmissions} submitted`} size="small"
                          sx={{ bgcolor: '#e8f5e9', color: '#00b894', fontSize: 11, fontWeight: 600 }} />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Quick Actions</Typography>
              <Grid container spacing={1.5}>
                {[
                  { label: 'Mark Attendance', icon: <HowToReg />, path: '/faculty/attendance', color: '#00b894' },
                  { label: 'Add Marks', icon: <Grade />, path: '/faculty/marks', color: '#6c5ce7' },
                  { label: 'Create Assignment', icon: <Assignment />, path: '/faculty/assignments', color: '#e94560' },
                  { label: 'Add Student', icon: <PersonAdd />, action: () => setOpen(true), color: '#0984e3' },
                ].map(action => (
                  <Grid item xs={12} sm={3} key={action.label}>
                    <Button fullWidth variant="outlined"
                      startIcon={<Box sx={{ color: action.color }}>{action.icon}</Box>}
                      onClick={action.action || (() => navigate(action.path))}
                      sx={{ justifyContent: 'flex-start', py: 1.5, px: 2,
                        borderColor: 'rgba(0,0,0,0.1)', color: '#333',
                        '&:hover': { borderColor: action.color, bgcolor: `${action.color}08` } }}>
                      {action.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          <Button onClick={handleAddStudent} variant="contained" disabled={saving}>
            {saving ? 'Adding…' : 'Add Student'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}