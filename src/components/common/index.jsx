import React from 'react'
import {
  Box, Typography, Card, CardContent, Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, CircularProgress, Alert,
  LinearProgress, Avatar
} from '@mui/material'
import { TrendingUp } from '@mui/icons-material'

// ─── Stat Card ───────────────────────────────────────────────────────────────
export const StatCard = ({ title, value, icon, color = '#1a1a2e', subtitle, loading }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 3 }}>
      {loading ? (
        <>
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={40} sx={{ my: 1 }} />
          <Skeleton width="50%" height={16} />
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color }}>
                {value ?? '—'}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box sx={{
              width: 48, height: 48, borderRadius: 2,
              bgcolor: `${color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color,
            }}>
              {icon}
            </Box>
          </Box>
        </>
      )}
    </CardContent>
  </Card>
)

// ─── Page Header ─────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
    <Box>
      <Typography variant="h5" fontWeight={700} color="#1a1a2e">{title}</Typography>
      {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
    </Box>
    {action && <Box>{action}</Box>}
  </Box>
)

// ─── Data Table ──────────────────────────────────────────────────────────────
export const DataTable = ({ columns, rows, loading, emptyMessage = 'No data found' }) => {
  if (loading) return (
    <Box sx={{ p: 3 }}>
      {[...Array(5)].map((_, i) => <Skeleton key={i} height={52} sx={{ mb: 1 }} />)}
    </Box>
  )
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f8f9fa' }}>
            {columns.map((col) => (
              <TableCell key={col.field} sx={{ fontWeight: 600, color: '#555', fontSize: 13, py: 1.5 }}>
                {col.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 4, color: '#999' }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows?.map((row, i) => (
              <TableRow key={row.id || i} hover sx={{ '&:last-child td': { border: 0 } }}>
                {columns.map((col) => (
                  <TableCell key={col.field} sx={{ fontSize: 13.5, py: 1.5 }}>
                    {col.renderCell ? col.renderCell({ row, value: row[col.field] }) : row[col.field] ?? '—'}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
export const LoadingScreen = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 2 }}>
    <CircularProgress sx={{ color: '#1a1a2e' }} />
    <Typography variant="body2" color="text.secondary">Loading...</Typography>
  </Box>
)

// ─── Error Alert ─────────────────────────────────────────────────────────────
export const ErrorAlert = ({ message }) => (
  <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>{message}</Alert>
)

// ─── Role Chip ────────────────────────────────────────────────────────────────
const ROLE_COLORS = {
  ADMIN: { bg: '#ffe0e6', color: '#e94560' },
  DEAN: { bg: '#ede7f6', color: '#6c5ce7' },
  HOD: { bg: '#e3f2fd', color: '#0984e3' },
  FACULTY: { bg: '#e8f5e9', color: '#00b894' },
  STUDENT: { bg: '#fff8e1', color: '#f39c12' },
}

export const RoleChip = ({ role }) => {
  const colors = ROLE_COLORS[role] || { bg: '#f5f5f5', color: '#666' }
  return (
    <Chip
      label={role}
      size="small"
      sx={{ bgcolor: colors.bg, color: colors.color, fontWeight: 600, fontSize: 11 }}
    />
  )
}

// ─── Status Chip ─────────────────────────────────────────────────────────────
export const StatusChip = ({ active }) => (
  <Chip
    label={active ? 'Active' : 'Inactive'}
    size="small"
    sx={{
      bgcolor: active ? '#e8f5e9' : '#fce4ec',
      color: active ? '#00b894' : '#e94560',
      fontWeight: 600, fontSize: 11,
    }}
  />
)

// ─── Attendance Chip ─────────────────────────────────────────────────────────
const ATTENDANCE_COLORS = {
  PRESENT: { bg: '#e8f5e9', color: '#00b894' },
  ABSENT: { bg: '#fce4ec', color: '#e94560' },
  LATE: { bg: '#fff8e1', color: '#f39c12' },
}
export const AttendanceChip = ({ status }) => {
  const c = ATTENDANCE_COLORS[status] || { bg: '#f5f5f5', color: '#666' }
  return <Chip label={status} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600, fontSize: 11 }} />
}

// ─── Attendance Percentage Bar ────────────────────────────────────────────────
export const AttendanceBar = ({ percentage }) => {
  const color = percentage >= 75 ? '#00b894' : percentage >= 50 ? '#fdcb6e' : '#e94560'
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <LinearProgress
        variant="determinate"
        value={Math.min(percentage, 100)}
        sx={{
          flex: 1, height: 8, borderRadius: 4,
          bgcolor: `${color}22`,
          '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 },
        }}
      />
      <Typography variant="body2" fontWeight={600} sx={{ color, minWidth: 42 }}>
        {percentage?.toFixed(1)}%
      </Typography>
    </Box>
  )
}

// ─── User Avatar ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#e94560', '#6c5ce7', '#0984e3', '#00b894', '#f39c12', '#fd79a8']
export const UserAvatar = ({ name, size = 36 }) => {
  const idx = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length
  return (
    <Avatar sx={{ bgcolor: AVATAR_COLORS[idx], width: size, height: size, fontSize: size * 0.4, fontWeight: 700 }}>
      {name?.charAt(0).toUpperCase()}
    </Avatar>
  )
}
