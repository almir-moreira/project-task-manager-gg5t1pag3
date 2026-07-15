import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/main'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { RouteGuard } from '@/components/RouteGuard'
import { canViewMonitoringDashboard, canViewKaiciidCalendar, isAdmin } from '@/lib/permissions'
import { usePermissions } from '@/hooks/use-permissions'

import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import TasksPage from './pages/tasks/TasksPage'
import TaskDetailPage from './pages/tasks/TaskDetailPage'
import AdminPage from './pages/admin/AdminPage'
import UserAccessPage from './pages/admin/UserAccessPage'
import MonitoringPage from './pages/monitoring/MonitoringPage'
import KaiciidCalendarReport from './pages/reports/KaiciidCalendarReport'
import LoginPage from './pages/auth/LoginPage'
import AccessDenied from './pages/AccessDenied'
import TravelPage from './pages/travel/TravelPage'
import TravelFormPage from './pages/travel/TravelFormPage'
import DelegationListPage from './pages/travel/DelegationListPage'
import DelegationFormPage from './pages/travel/DelegationFormPage'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { permUser, loading } = usePermissions()
  if (loading) return null
  if (!isAdmin(permUser)) return <AccessDenied />
  return <>{children}</>
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />
              <Route path="/travel" element={<TravelPage />} />
              <Route path="/travel/new" element={<TravelFormPage />} />
              <Route path="/travel/delegations" element={<DelegationListPage />} />
              <Route path="/travel/delegations/new" element={<DelegationFormPage />} />
              <Route path="/travel/delegations/:id" element={<DelegationFormPage />} />
              <Route path="/travel/:id" element={<TravelFormPage />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/access-control"
                element={
                  <AdminRoute>
                    <UserAccessPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/monitoring"
                element={
                  <RouteGuard check={canViewMonitoringDashboard}>
                    <MonitoringPage />
                  </RouteGuard>
                }
              />
              <Route
                path="/reports/kaiciid-calendar"
                element={
                  <RouteGuard check={canViewKaiciidCalendar}>
                    <KaiciidCalendarReport />
                  </RouteGuard>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
