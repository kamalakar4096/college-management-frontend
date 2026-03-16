import React, { useState } from 'react'
import {
  Box, Card, CardContent, Typography, Button, MenuItem, TextField,
  Grid, Table, TableHead, TableRow, TableCell, TableBody, ToggleButton,
  ToggleButtonGroup, Paper, CircularProgress
} from '@mui/material'
import { HowToReg, Save } from '@mui/icons-material'
import { PageHeader, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { subjectService } from '../../services/subjectService'
import { userService } from '../../services/userService'
import { attendanceService } from '../../services/attendanceService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const STATUS_OPTIONS = ['PRESENT', 'ABSENT', 'LATE']
const STATUS_COLORS = { PRESENT: { bg: '#e8f5e9', color: '#00b894' }, ABSENT: { bg: '#fce4ec', color: '#e94560' }, LATE: { bg: '#fff8e1', color: '#f39c12' } }

export default function FacultyAttendance() {
  const { user } = useAuth()
  const [selectedSubject, setSelectedSubject] = useState('')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [attendance, setAttendance] = useState({})
  const [saving, setSaving] = useState(false)

  const { data: subjects } = useApi(() => user?.userId ? subjectService.getByFaculty(user.id) : Promise.resolve([]), [user?.userId])
  const { data: deptUsers } = useApi(() => user?.departmentId ? userService.getByDepartment(user.departmentId) : Promise.resolve([]), [user?.departmentId])

  const students = deptUsers?.filter(u => u.role === 'STUDENT') || []

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const markAll = (status) => {
    const all = {}
    students.forEach(s => { all[s.id] = status })
    setAttendance(all)
  }

  const handleSubmit = async () => {
    if (!selectedSubject) { toast.error('Select a subject'); return }
    if (students.length === 0) { toast.error('No students found'); return }
    const entries = students.map(s => ({ studentId: s.id, status: attendance[s.id] || 'ABSENT' }))
    setSaving(true)
    try {
      await attendanceService.mark({ subjectId: Number(selectedSubject), date, entries })
      toast.success(`Attendance marked for ${students.length} students`)
    } catch (err) { toast.error(err?.message || 'Failed to mark attendance') }
    finally { setSaving(false) }
  }

  return (
    <DashboardLayout>
      <PageHeader title="Mark Attendance" subtitle="Record student attendance for your subjects" />

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField fullWidth select label="Select Subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                <MenuItem value="">Choose subject</MenuItem>
                {subjects?.map(s => <MenuItem key={s.id} value={s.id}>{s.subjectName} (Sem {s.semester})</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="date" label="Date" value={date} onChange={e => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }} inputProps={{ max: dayjs().format('YYYY-MM-DD') }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" onClick={() => markAll('PRESENT')} sx={{ color: '#00b894', borderColor: '#00b894' }}>All Present</Button>
                <Button size="small" variant="outlined" onClick={() => markAll('ABSENT')} sx={{ color: '#e94560', borderColor: '#e94560' }}>All Absent</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {students.length > 0 ? (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>Student Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, idx) => {
                  const status = attendance[student.id] || 'ABSENT'
                  const sc = STATUS_COLORS[status]
                  return (
                    <TableRow key={student.id} hover>
                      <TableCell sx={{ color: '#999', fontSize: 13 }}>{idx + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500, fontSize: 13.5 }}>{student.name}</TableCell>
                      <TableCell sx={{ color: '#888', fontSize: 13 }}>{student.email}</TableCell>
                      <TableCell>
                        <ToggleButtonGroup
                          value={status}
                          exclusive
                          onChange={(_, v) => { if (v) handleStatusChange(student.id, v) }}
                          size="small"
                        >
                          {STATUS_OPTIONS.map(s => (
                            <ToggleButton key={s} value={s} sx={{
                              px: 1.5, py: 0.4, fontSize: 11, fontWeight: 600,
                              '&.Mui-selected': { bgcolor: STATUS_COLORS[s].bg, color: STATUS_COLORS[s].color, '&:hover': { bgcolor: STATUS_COLORS[s].bg } }
                            }}>
                              {s}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
          <Box sx={{ p: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Save />}
              onClick={handleSubmit} disabled={saving || !selectedSubject}>
              {saving ? 'Saving…' : 'Save Attendance'}
            </Button>
          </Box>
        </Card>
      ) : (
        <Card>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <HowToReg sx={{ fontSize: 48, color: '#ddd', mb: 1 }} />
            <Typography color="text.secondary">Select a subject to load students</Typography>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
