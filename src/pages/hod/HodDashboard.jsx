import React from 'react'
import { Grid, Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, Button } from '@mui/material'
import { People, Class, School, Assignment } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { StatCard, PageHeader, LoadingScreen, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { userService } from '../../services/userService'
import { subjectService } from '../../services/subjectService'
import { useAuth } from '../../context/AuthContext'

export default function HodDashboard() {
  const { user } = useAuth()
  const deptId = user?.departmentId
  const { data: students, loading: sLoading } = useApi(() => deptId ? userService.getByDepartment(deptId) : Promise.resolve([]), [deptId])
  const { data: subjects, loading: subLoading } = useApi(() => deptId ? subjectService.getByDepartment(deptId) : Promise.resolve([]), [deptId])

  const faculty = students?.filter(u => u.role === 'FACULTY') || []
  const studentList = students?.filter(u => u.role === 'STUDENT') || []
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <PageHeader title={`Hello, ${user?.name?.split(' ')[0]} 👋`} subtitle={`Managing your department${user?.departmentName ? ` — ${user.departmentName}` : ''}`} />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'Faculty Members', value: faculty.length, icon: <People />, color: '#6c5ce7' },
          { title: 'Students', value: studentList.length, icon: <School />, color: '#e94560' },
          { title: 'Subjects', value: subjects?.length, icon: <Class />, color: '#0984e3' },
          { title: 'Assigned Subjects', value: subjects?.filter(s => s.facultyId)?.length, icon: <Assignment />, color: '#00b894' },
        ].map(s => <Grid item xs={12} sm={6} lg={3} key={s.title}><StatCard {...s} loading={sLoading || subLoading} /></Grid>)}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Faculty ({faculty.length})</Typography>
                <Button size="small" onClick={() => navigate('/hod/faculty')}>View All</Button>
              </Box>
              {faculty.length === 0
                ? <Typography color="text.secondary" fontSize={13}>No faculty in your department</Typography>
                : <List disablePadding>
                  {faculty.slice(0, 5).map((f, i) => (
                    <React.Fragment key={f.id}>
                      {i > 0 && <Divider />}
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemText
                          primary={f.name}
                          secondary={f.email}
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
                <Typography variant="h6" fontWeight={600}>Subjects ({subjects?.length || 0})</Typography>
                <Button size="small" onClick={() => navigate('/hod/subjects')}>Manage</Button>
              </Box>
              {!subjects?.length
                ? <Typography color="text.secondary" fontSize={13}>No subjects created</Typography>
                : <List disablePadding>
                  {subjects.slice(0, 5).map((s, i) => (
                    <React.Fragment key={s.id}>
                      {i > 0 && <Divider />}
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemText
                          primary={s.subjectName}
                          secondary={s.facultyName ? `Faculty: ${s.facultyName}` : 'No faculty assigned'}
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
      </Grid>
    </DashboardLayout>
  )
}
