import React, { useState } from 'react'
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, Card, CardContent, Typography,
  List, ListItem, ListItemText, Divider, Chip, Avatar, Tabs, Tab
} from '@mui/material'
import { Send, Notifications, Inbox } from '@mui/icons-material'
import { PageHeader, ErrorAlert } from '../../components/common'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useApi } from '../../hooks/useApi'
import { notificationService } from '../../services/notificationService'
import { departmentService } from '../../services/departmentService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ROLES = ['ADMIN', 'DEAN', 'HOD', 'FACULTY', 'STUDENT']
const ROLE_COLORS = { ADMIN: '#e94560', DEAN: '#6c5ce7', HOD: '#0984e3', FACULTY: '#00b894', STUDENT: '#fdcb6e' }

function NotificationCard({ n }) {
  return (
    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.07)', mb: 1.5, '&:last-child': { mb: 0 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
        <Typography fontWeight={600} fontSize={14}>{n.title}</Typography>
        <Box sx={{ display: 'flex', gap: 0.8 }}>
          {n.targetRole && (
            <Chip label={n.targetRole} size="small"
              sx={{ bgcolor: `${ROLE_COLORS[n.targetRole]}22`, color: ROLE_COLORS[n.targetRole], fontWeight: 600, fontSize: 11 }} />
          )}
          {n.targetDepartmentName && <Chip label={n.targetDepartmentName} size="small" variant="outlined" sx={{ fontSize: 11 }} />}
        </Box>
      </Box>
      <Typography fontSize={13.5} color="text.secondary" sx={{ mb: 1 }}>{n.message}</Typography>
      <Typography fontSize={11} color="text.disabled">
        From: {n.senderName} • {new Date(n.createdAt).toLocaleString()}
      </Typography>
    </Box>
  )
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const { data: received, loading: rLoading, error: rError, refetch: rRefetch } = useApi(notificationService.getForMyRole)
  const { data: sent, loading: sLoading, refetch: sRefetch } = useApi(notificationService.getSent)
  const { data: departments } = useApi(departmentService.getAll)
  const [tab, setTab] = useState(0)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', message: '', targetRole: '', targetDepartmentId: '' })
  const [saving, setSaving] = useState(false)

  const SENDER_ROLES = ['ADMIN', 'DEAN', 'HOD', 'FACULTY']
  const canSend = SENDER_ROLES.includes(user?.role)

  const handleSend = async () => {
    if (!form.title || !form.message) { toast.error('Title and message required'); return }
    setSaving(true)
    try {
      const payload = { title: form.title, message: form.message }
      if (form.targetRole) payload.targetRole = form.targetRole
      if (form.targetDepartmentId) payload.targetDepartmentId = Number(form.targetDepartmentId)
      await notificationService.send(payload)
      toast.success('Notification sent!')
      setOpen(false); setForm({ title: '', message: '', targetRole: '', targetDepartmentId: '' })
      sRefetch(); rRefetch()
    } catch (err) { toast.error(err?.message || 'Failed to send') }
    finally { setSaving(false) }
  }

  return (
    <DashboardLayout>
      <PageHeader title="Notifications" subtitle="Send and receive notifications"
        action={canSend && <Button variant="contained" startIcon={<Send />} onClick={() => setOpen(true)}>Send Notification</Button>} />

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)', px: 2 }}>
          <Tab label={`Inbox (${received?.length || 0})`} icon={<Inbox />} iconPosition="start" sx={{ fontSize: 13 }} />
          {canSend && <Tab label={`Sent (${sent?.length || 0})`} icon={<Send />} iconPosition="start" sx={{ fontSize: 13 }} />}
        </Tabs>
        <CardContent sx={{ p: 3 }}>
          {tab === 0 && (
            <>
              {rError && <ErrorAlert message={rError} />}
              {rLoading ? <Typography color="text.secondary">Loading…</Typography> :
                received?.length === 0 ? <Typography color="text.secondary" textAlign="center" py={4}>No notifications</Typography> :
                received?.map(n => <NotificationCard key={n.id} n={n} />)}
            </>
          )}
          {tab === 1 && (
            <>
              {sLoading ? <Typography color="text.secondary">Loading…</Typography> :
                sent?.length === 0 ? <Typography color="text.secondary" textAlign="center" py={4}>No sent notifications</Typography> :
                sent?.map(n => <NotificationCard key={n.id} n={n} />)}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>Send Notification</Typography>
          <Typography variant="body2" color="text.secondary">Broadcast to a role or department</Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Message *" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Target Role (optional)" value={form.targetRole} onChange={e => setForm({ ...form, targetRole: e.target.value })}>
                <MenuItem value="">All Roles (Broadcast)</MenuItem>
                {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Target Department (optional)" value={form.targetDepartmentId} onChange={e => setForm({ ...form, targetDepartmentId: e.target.value })}>
                <MenuItem value="">All Departments</MenuItem>
                {departments?.map(d => <MenuItem key={d.id} value={d.id}>{d.departmentName}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleSend} variant="contained" startIcon={<Send />} disabled={saving}>
            {saving ? 'Sending…' : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}
