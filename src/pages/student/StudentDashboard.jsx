import React from 'react'
import { Grid, Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, Button, Chip } from '@mui/material'
import { Grade, HowToReg, Assignment, Notifications } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { StatCard, PageHeader, LoadingScreen } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { marksService } from '../../services/marksService'
import { attendanceService } from '../../services/attendanceService'
import { notificationService } from '../../services/notificationService'
import { assignmentService } from '../../services/assignmentService'
import { useAuth } from '../../context/AuthContext'

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: marks } = useApi(() => user?.id ? marksService.getByStudent(user.id) : Promise.resolve([]), [user?.id])
  const { data: attendance } = useApi(() => user?.id ? attendanceService.getByStudent(user.id) : Promise.resolve([]), [user?.id])
  const { data: notifications } = useApi(notificationService.getForMyRole)

  const presentCount = attendance?.filter(a => a.status === 'PRESENT').length || 0
  const totalCount = attendance?.length || 0
  const attendancePct = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0
  const avgMarks = marks?.length > 0 ? (marks.reduce((sum, m) => sum + m.marks, 0) / marks.length).toFixed(1) : 0
  const recentNotifs = notifications?.slice(0, 4) || []

  return (
    <DashboardLayout>
      <PageHeader title={`Hello, ${user?.name?.split(' ')[0]} 👋`} subtitle="Your academic progress at a glance" />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'Attendance', value: `${attendancePct}%`, icon: <HowToReg />, color: attendancePct >= 75 ? '#00b894' : '#e94560', subtitle: `${presentCount}/${totalCount} classes` },
          { title: 'Average Marks', value: `${avgMarks}`, icon: <Grade />, color: '#6c5ce7', subtitle: `${marks?.length || 0} exams recorded` },
          { title: 'Notifications', value: notifications?.length || 0, icon: <Notifications />, color: '#0984e3', subtitle: 'Unread messages' },
        ].map(s => <Grid item xs={12} sm={4} key={s.title}><StatCard {...s} /></Grid>)}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Recent Marks</Typography>
                <Button size="small" onClick={() => navigate('/student/marks')}>View All</Button>
              </Box>
              {!marks?.length
                ? <Typography color="text.secondary" fontSize={13}>No marks recorded yet</Typography>
                : <List disablePadding>
                  {marks.slice(0, 5).map((m, i) => (
                    <React.Fragment key={m.id}>
                      {i > 0 && <Divider />}
                      <ListItem disablePadding sx={{ py: 1.2 }}>
                        <ListItemText
                          primary={m.subjectName}
                          secondary={m.examType?.replace('_', ' ')}
                          primaryTypographyProps={{ fontSize: 13.5, fontWeight: 500 }}
                          secondaryTypographyProps={{ fontSize: 12 }}
                        />
                        <Typography fontWeight={700} color="#6c5ce7" fontSize={16}>{m.marks}</Typography>
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
                <Typography variant="h6" fontWeight={600}>Notifications</Typography>
                <Button size="small" onClick={() => navigate('/student/notifications')}>View All</Button>
              </Box>
              {recentNotifs.length === 0
                ? <Typography color="text.secondary" fontSize={13}>No notifications</Typography>
                : <List disablePadding>
                  {recentNotifs.map((n, i) => (
                    <React.Fragment key={n.id}>
                      {i > 0 && <Divider />}
                      <ListItem disablePadding sx={{ py: 1.2 }}>
                        <ListItemText
                          primary={n.title}
                          secondary={`${n.senderName} • ${new Date(n.createdAt).toLocaleDateString()}`}
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

        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Quick Actions</Typography>
              <Grid container spacing={1.5}>
                {[
                  { label: 'View Attendance', icon: <HowToReg />, path: '/student/attendance', color: '#00b894' },
                  { label: 'View Marks', icon: <Grade />, path: '/student/marks', color: '#6c5ce7' },
                  { label: 'Assignments', icon: <Assignment />, path: '/student/assignments', color: '#e94560' },
                ].map(action => (
                  <Grid item xs={12} sm={4} key={action.label}>
                    <Button fullWidth variant="outlined" startIcon={<Box sx={{ color: action.color }}>{action.icon}</Box>}
                      onClick={() => navigate(action.path)}
                      sx={{ justifyContent: 'flex-start', py: 1.5, px: 2, borderColor: 'rgba(0,0,0,0.1)', color: '#333', '&:hover': { borderColor: action.color, bgcolor: `${action.color}08` } }}>
                      {action.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}
