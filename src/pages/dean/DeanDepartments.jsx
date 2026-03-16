import React from 'react'
import { Grid, Card, CardContent, Typography, Box, Chip, Avatar } from '@mui/material'
import { Business, Person } from '@mui/icons-material'
import { PageHeader, LoadingScreen, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { departmentService } from '../../services/departmentService'

export default function DeanDepartments() {
  const { data: departments, loading, error } = useApi(departmentService.getAll)

  if (loading) return <DashboardLayout><LoadingScreen /></DashboardLayout>

  return (
    <DashboardLayout>
      <PageHeader title="Departments Overview" subtitle="View all academic departments" />
      {error && <ErrorAlert message={error} />}
      <Grid container spacing={2.5}>
        {departments?.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary" textAlign="center" py={4}>No departments found</Typography>
          </Grid>
        )}
        {departments?.map(dept => (
          <Grid item xs={12} sm={6} md={4} key={dept.id}>
            <Card sx={{ height: '100%', '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.1)', transform: 'translateY(-2px)', transition: 'all 0.2s' } }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Business sx={{ color: '#0984e3' }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} fontSize={15}>{dept.departmentName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Person sx={{ fontSize: 16, color: '#aaa' }} />
                  <Typography fontSize={13} color="text.secondary">
                    {dept.hodName ? `HOD: ${dept.hodName}` : 'No HOD assigned'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label={`${dept.totalMembers} Members`} size="small" sx={{ bgcolor: '#f5f5f5', fontWeight: 500, fontSize: 11 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  )
}
