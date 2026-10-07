import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuthStore } from "../store/auth.store.js";
import LoadingState from "../components/LoadingState.jsx";
import AppLayout from "../layouts/AppLayout.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import LeadsPage from "../pages/LeadsPage.jsx";
import LeadDetailPage from "../pages/LeadDetailPage.jsx";
import { TasksPage, AdvisorsPage, EmailTemplatesPage, TaskTriggersPage, ClientCasePage, ClientDocumentsPage } from "../pages/PlaceholderPages.jsx";

function ProtectedRoute() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  if (!isInitialized) return <LoadingState />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function RoleRoute({ roles }) {
  const role = useAuthStore((state) => state.user?.role);
  if (roles.includes(role)) return <Outlet />;
  return <Navigate to={role === "client" ? "/client/case" : "/dashboard"} replace />;
}

export default function AppRoutes() {
  return <BrowserRouter><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<RoleRoute roles={["platformAdmin", "brokerageAdmin", "advisor"]} />}><Route index element={<DashboardPage />} /></Route>
        <Route element={<RoleRoute roles={["platformAdmin", "brokerageAdmin", "advisor"]} />}>
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/leads/:id" element={<LeadDetailPage />} />
        </Route>
        <Route element={<RoleRoute roles={["brokerageAdmin", "advisor"]} />}>
          <Route path="/tasks" element={<TasksPage />} />
        </Route>
        <Route element={<RoleRoute roles={["brokerageAdmin"]} />}>
          <Route path="/advisors" element={<AdvisorsPage />} />
          <Route path="/email-templates" element={<EmailTemplatesPage />} />
          <Route path="/task-triggers" element={<TaskTriggersPage />} />
        </Route>
        <Route element={<RoleRoute roles={["client"]} />}>
          <Route path="/client/case" element={<ClientCasePage />} />
          <Route path="/client/documents" element={<ClientDocumentsPage />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes></BrowserRouter>;
}
