import React from 'react'
import { Grid, Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, Button, Chip } from '@mui/material'
import { Class, Assignment, Grade, HowToReg } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { StatCard, PageHeader, LoadingScreen } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { subjectService } from '../../services/subjectService'
import { assignmentService } from '../../services/assignmentService'
import { useAuth } from '../../context/AuthContext'

export default function FacultyDashboard() {
  const { user } = useAuth()
  console.log('USER OBJECT:',user)
  const navigate = useNavigate()
  const { data: mySubjects } = useApi(() => user?.userId ? subjectService.getByFaculty(user.id) : Promise.resolve([]), [user?.userId])
  const { data: assignments } = useApi(() => user?.userId ? assignmentService.getByFaculty(user.id) : Promise.resolve([]), [user?.userId])

  const upcoming = assignments?.filter(a => new Date(a.deadline) > new Date()) || []

  return (
    <DashboardLayout>
      <PageHeader title={`Hello, ${user?.name?.split(' ')[0]} 👋`} subtitle="Your teaching overview for today" />

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
                        <Chip label={`${a.totalSubmissions} submitted`} size="small" sx={{ bgcolor: '#e8f5e9', color: '#00b894', fontSize: 11, fontWeight: 600 }} />
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
                ].map(action => (
                  <Grid item xs={12} sm={4} key={action.label}>
                    <Button fullWidth variant="outlined"
                      startIcon={<Box sx={{ color: action.color }}>{action.icon}</Box>}
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
