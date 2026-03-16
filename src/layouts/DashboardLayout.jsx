import React, { useState } from 'react'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, AppBar, Typography, IconButton,
  Avatar, Menu, MenuItem, Divider, Chip, useTheme, Tooltip
} from '@mui/material'
import {
  Menu as MenuIcon, Dashboard, People, Business, Book,
  Assignment, Notifications, BarChart, School, Class,
  HowToReg, Grade, ExitToApp, Person, ChevronLeft,
  AccessTime, Announcement
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DRAWER_WIDTH = 260

const NAV_ITEMS = {
  ADMIN: [
    { label: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { label: 'Users', icon: <People />, path: '/admin/users' },
    { label: 'Departments', icon: <Business />, path: '/admin/departments' },
    { label: 'Courses', icon: <Book />, path: '/admin/courses' },
    { label: 'Notifications', icon: <Notifications />, path: '/admin/notifications' },
    { label: 'Reports', icon: <BarChart />, path: '/admin/reports' },
  ],
  DEAN: [
    { label: 'Dashboard', icon: <Dashboard />, path: '/dean' },
    { label: 'Departments', icon: <Business />, path: '/dean/departments' },
    { label: 'Reports', icon: <BarChart />, path: '/dean/reports' },
    { label: 'Notifications', icon: <Notifications />, path: '/dean/notifications' },
  ],
  HOD: [
    { label: 'Dashboard', icon: <Dashboard />, path: '/hod' },
    { label: 'Faculty', icon: <People />, path: '/hod/faculty' },
    { label: 'Students', icon: <School />, path: '/hod/students' },
    { label: 'Subjects', icon: <Class />, path: '/hod/subjects' },
    { label: 'Notifications', icon: <Notifications />, path: '/hod/notifications' },
  ],
  FACULTY: [
    { label: 'Dashboard', icon: <Dashboard />, path: '/faculty' },
    { label: 'Attendance', icon: <HowToReg />, path: '/faculty/attendance' },
    { label: 'Marks', icon: <Grade />, path: '/faculty/marks' },
    { label: 'Assignments', icon: <Assignment />, path: '/faculty/assignments' },
    { label: 'Notifications', icon: <Notifications />, path: '/faculty/notifications' },
  ],
  STUDENT: [
    { label: 'Dashboard', icon: <Dashboard />, path: '/student' },
    { label: 'Attendance', icon: <AccessTime />, path: '/student/attendance' },
    { label: 'Marks', icon: <Grade />, path: '/student/marks' },
    { label: 'Assignments', icon: <Assignment />, path: '/student/assignments' },
    { label: 'Notifications', icon: <Announcement />, path: '/student/notifications' },
    { label: 'Profile', icon: <Person />, path: '/student/profile' },
  ],
}

const ROLE_COLORS = {
  ADMIN: '#e94560',
  DEAN: '#6c5ce7',
  HOD: '#0984e3',
  FACULTY: '#00b894',
  STUDENT: '#fdcb6e',
}

const ROLE_LABELS = {
  ADMIN: 'Administrator',
  DEAN: 'Dean',
  HOD: 'Head of Department',
  FACULTY: 'Faculty',
  STUDENT: 'Student',
}

export default function DashboardLayout({ children }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const navItems = NAV_ITEMS[user?.role] || []
  const roleColor = ROLE_COLORS[user?.role] || '#1a1a2e'

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1a1a2e' }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 38, height: 38, borderRadius: 2,
          background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <School sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>
            CMS
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
            College Management
          </Typography>
        </Box>
      </Box>

      {/* User card */}
      <Box sx={{ mx: 2, mb: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: roleColor, width: 36, height: 36, fontSize: 14, fontWeight: 700 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </Typography>
            <Chip
              label={ROLE_LABELS[user?.role]}
              size="small"
              sx={{ height: 18, fontSize: 10, mt: 0.3, bgcolor: `${roleColor}22`, color: roleColor, fontWeight: 600, border: `1px solid ${roleColor}44` }}
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      {/* Nav */}
      <List sx={{ flex: 1, px: 1.5, py: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); setMobileOpen(false) }}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? `${roleColor}22` : 'transparent',
                  borderLeft: active ? `3px solid ${roleColor}` : '3px solid transparent',
                  '&:hover': { bgcolor: `${roleColor}15` },
                  py: 1.2,
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? roleColor : 'rgba(255,255,255,0.4)' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 13.5,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={() => { logout(); navigate('/login') }}
          sx={{ borderRadius: 2, color: 'rgba(255,255,255,0.4)', '&:hover': { bgcolor: 'rgba(233,69,96,0.15)', color: '#e94560' } }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><ExitToApp /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 13.5 }} />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f7' }}>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <AppBar position="static" elevation={0} sx={{
          bgcolor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}>
          <Toolbar sx={{ gap: 2 }}>
            <IconButton
              sx={{ display: { md: 'none' }, color: '#1a1a2e' }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: '#999', fontSize: 12 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>
            <Tooltip title="Account">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
                <Avatar sx={{ bgcolor: roleColor, width: 32, height: 32, fontSize: 13, fontWeight: 700 }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { borderRadius: 2, mt: 1, minWidth: 180 } }}>
              <MenuItem disabled>
                <Box>
                  <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { logout(); navigate('/login') }} sx={{ color: '#e94560' }}>
                <ExitToApp sx={{ mr: 1, fontSize: 18 }} /> Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
