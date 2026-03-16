import React, { useState } from 'react'
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Alert, CircularProgress
} from '@mui/material'
import { Email, Lock, Visibility, VisibilityOff, School } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ROLE_REDIRECTS = {
  ADMIN: '/admin', DEAN: '/dean', HOD: '/hod', FACULTY: '/faculty', STUDENT: '/student'
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(ROLE_REDIRECTS[user.role] || '/login')
    } catch (err) {
      setError(err?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <Box sx={{
        position: 'absolute', top: -100, right: -100,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(233,69,96,0.15) 0%, transparent 70%)',
      }} />
      <Box sx={{
        position: 'absolute', bottom: -50, left: -50,
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,92,231,0.15) 0%, transparent 70%)',
      }} />

      {/* Left panel */}
      <Box sx={{
        flex: 1, display: { xs: 'none', md: 'flex' },
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        p: 6, position: 'relative',
      }}>
        <Box sx={{
          width: 80, height: 80, borderRadius: 3,
          background: 'linear-gradient(135deg, #e94560, #c73652)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4,
          boxShadow: '0 20px 60px rgba(233,69,96,0.4)',
        }}>
          <School sx={{ color: '#fff', fontSize: 42 }} />
        </Box>
        <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', mb: 2, textAlign: 'center' }}>
          College Management<br />System
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 360, lineHeight: 1.8 }}>
          A unified platform for administrators, faculty, and students to manage academic operations efficiently.
        </Typography>

        {/* Role pills */}
        <Box sx={{ display: 'flex', gap: 1, mt: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Admin', 'Dean', 'HOD', 'Faculty', 'Student'].map((r) => (
            <Box key={r} sx={{
              px: 2, py: 0.8, borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 500,
            }}>{r}</Box>
          ))}
        </Box>
      </Box>

      {/* Right panel - login form */}
      <Box sx={{
        width: { xs: '100%', md: 460 },
        display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3,
        bgcolor: { xs: 'transparent', md: 'rgba(255,255,255,0.03)' },
        backdropFilter: 'blur(20px)',
        borderLeft: { md: '1px solid rgba(255,255,255,0.06)' },
      }}>
        <Card sx={{ width: '100%', maxWidth: 400, bgcolor: '#fff', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: 2,
                background: 'linear-gradient(135deg, #1a1a2e, #e94560)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <School sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>Sign In</Typography>
                <Typography variant="caption" color="text.secondary">Access your dashboard</Typography>
              </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                sx={{ mb: 2.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#aaa', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#aaa', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} size="small">
                        {showPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                size="large"
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In'}
              </Button>
            </form>

            <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" fontWeight={600} mb={0.5}>
                Default Admin Credentials
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: '"DM Mono", monospace', color: '#555' }}>
                admin@college.edu / Admin@123
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
