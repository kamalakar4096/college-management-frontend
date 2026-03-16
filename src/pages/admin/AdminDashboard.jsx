import React from 'react'
import { Grid, Card, CardContent, Box, Typography, List, ListItem, ListItemText, Divider, Button } from '@mui/material'
import { People, Business, Book, School, BarChart, Notifications, ArrowForward } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { StatCard, PageHeader, LoadingScreen, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { reportService } from '../../services/reportService'
import { notificationService } from '../../services/notificationService'
import { useAuth } from '../../context/AuthContext'

const COLORS = ['#e94560', '#6c5ce7', '#0984e3', '#00b894', '#fdcb6e']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: report, loading: reportLoading, error: reportError } = useApi(reportService.getSummary)
  const { data: notifications, loading: notifLoading } = useApi(notificationService.getSent)

  if (reportLoading) return <DashboardLayout><LoadingScreen /></DashboardLayout>

  const deptChartData = report?.departmentStats?.map(d => ({
    name: d.departmentName?.substring(0, 12),
    students: d.studentCount,
    faculty: d.facultyCount,
  })) || []

  const pieData = [
    { name: 'Students', value: report?.totalStudents || 0 },
    { name: 'Faculty', value: report?.totalFaculty || 0 },
    { name: 'HODs', value: report?.totalHods || 0 },
    { name: 'Deans', value: report?.totalDeans || 0 },
  ]

  return (
    <DashboardLayout>
      <PageHeader
        title={`Good morning, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Here's what's happening at your college today."
        action={
          <Button variant="contained" startIcon={<Notifications />} onClick={() => navigate('/admin/notifications')}>
            Send Notification
          </Button>
        }
      />

      {reportError && <ErrorAlert message={reportError} />}

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'Total Students', value: report?.totalStudents, icon: <School />, color: '#e94560', subtitle: 'Enrolled students' },
          { title: 'Total Faculty', value: report?.totalFaculty, icon: <People />, color: '#6c5ce7', subtitle: 'Teaching staff' },
          { title: 'Departments', value: report?.totalDepartments, icon: <Business />, color: '#0984e3', subtitle: 'Academic departments' },
          { title: 'Courses', value: report?.totalCourses, icon: <Book />, color: '#00b894', subtitle: 'Active courses' },
        ].map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <StatCard {...stat} loading={reportLoading} />
          </Grid>
        ))}
      </Grid>

      {/* Charts row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2.5}>Department Overview</Typography>
              {deptChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <RechartsBar data={deptChartData} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="students" fill="#e94560" name="Students" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="faculty" fill="#6c5ce7" name="Faculty" radius={[4, 4, 0, 0]} />
                  </RechartsBar>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                  No department data yet
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2.5}>User Distribution</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                    dataKey="value" paddingAngle={3}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {pieData.map((item, i) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS[i] }} />
                    <Typography variant="caption" color="text.secondary">{item.name} ({item.value})</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick actions + recent notifications */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Quick Actions</Typography>
              <Grid container spacing={1.5}>
                {[
                  { label: 'Add User', icon: <People />, path: '/admin/users', color: '#e94560' },
                  { label: 'Add Department', icon: <Business />, path: '/admin/departments', color: '#6c5ce7' },
                  { label: 'Add Course', icon: <Book />, path: '/admin/courses', color: '#0984e3' },
                  { label: 'View Reports', icon: <BarChart />, path: '/admin/reports', color: '#00b894' },
                ].map((action) => (
                  <Grid item xs={6} key={action.label}>
                    <Button
                      fullWidth variant="outlined"
                      startIcon={<Box sx={{ color: action.color }}>{action.icon}</Box>}
                      onClick={() => navigate(action.path)}
                      sx={{
                        justifyContent: 'flex-start', py: 1.5, px: 2,
                        borderColor: 'rgba(0,0,0,0.1)', color: '#333',
                        '&:hover': { borderColor: action.color, bgcolor: `${action.color}08` },
                      }}
                    >
                      {action.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Recent Notifications</Typography>
                <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/admin/notifications')}>
                  View All
                </Button>
              </Box>
              {notifLoading ? (
                <Typography color="text.secondary" fontSize={14}>Loading...</Typography>
              ) : notifications?.length === 0 ? (
                <Typography color="text.secondary" fontSize={14}>No notifications sent yet.</Typography>
              ) : (
                <List disablePadding>
                  {notifications?.slice(0, 4).map((n, i) => (
                    <React.Fragment key={n.id}>
                      {i > 0 && <Divider />}
                      <ListItem disablePadding sx={{ py: 1.2 }}>
                        <ListItemText
                          primary={n.title}
                          secondary={`To: ${n.targetRole || 'All'} • ${new Date(n.createdAt).toLocaleDateString()}`}
                          primaryTypographyProps={{ fontSize: 13.5, fontWeight: 500 }}
                          secondaryTypographyProps={{ fontSize: 12 }}
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}
