import React from 'react'
import { Grid, Card, CardContent, Typography, Box, Chip, Divider, Avatar } from '@mui/material'
import { Email, Phone, Business, School, Badge } from '@mui/icons-material'
import { PageHeader } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'

const AVATAR_COLORS = ['#e94560', '#6c5ce7', '#0984e3', '#00b894', '#f39c12']

export default function StudentProfile() {
  const { user } = useAuth()
  const colorIdx = (user?.name?.charCodeAt(0) || 0) % AVATAR_COLORS.length

  return (
    <DashboardLayout>
      <PageHeader title="My Profile" subtitle="Your personal and academic information" />

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Avatar sx={{
                width: 96, height: 96, fontSize: 36, fontWeight: 700, mx: 'auto', mb: 2,
                bgcolor: AVATAR_COLORS[colorIdx],
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary" mb={1.5}>{user?.email}</Typography>
              <Chip label="STUDENT" sx={{ bgcolor: '#fff8e1', color: '#f39c12', fontWeight: 700, fontSize: 12 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2.5}>Personal Information</Typography>
              <Grid container spacing={2}>
                {[
                  { icon: <Badge sx={{ color: '#0984e3' }} />, label: 'Full Name', value: user?.name },
                  { icon: <Email sx={{ color: '#6c5ce7' }} />, label: 'Email Address', value: user?.email },
                  { icon: <Phone sx={{ color: '#00b894' }} />, label: 'Phone Number', value: user?.phone || 'Not provided' },
                  { icon: <Business sx={{ color: '#e94560' }} />, label: 'Department', value: user?.departmentName || user?.departmentId || 'Not assigned' },
                  { icon: <School sx={{ color: '#f39c12' }} />, label: 'Role', value: user?.role },
                ].map((item, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, borderRadius: 2, bgcolor: '#f8f9fa' }}>
                      <Box sx={{ mt: 0.2 }}>{item.icon}</Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">{item.label}</Typography>
                        <Typography fontSize={14} fontWeight={500}>{item.value || '—'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" fontWeight={600} mb={2}>Account Details</Typography>
              <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography fontSize={13.5} color="text.secondary">User ID</Typography>
                  <Typography fontSize={13.5} fontWeight={600} sx={{ fontFamily: 'monospace' }}>#{user?.userId || user?.id}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography fontSize={13.5} color="text.secondary">Account Status</Typography>
                  <Chip label="Active" size="small" sx={{ bgcolor: '#e8f5e9', color: '#00b894', fontWeight: 700, fontSize: 11 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}
