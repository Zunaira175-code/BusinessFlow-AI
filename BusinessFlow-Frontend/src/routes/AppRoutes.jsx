import { Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/Adminlayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import PublicLayout from "../layouts/PublicLayout";

// =====================================================
// MAIN ADMIN PAGES
// =====================================================

import Dashboard from "../pages/admin/Dashboard";
import Customers from "../pages/admin/Customers";
import Deals from "../pages/admin/Deals";
import Leads from "../pages/admin/Leads";
import Notifications from "../pages/admin/Notifications";
import Reports from "../pages/admin/Reports";
import Employees from "../pages/admin/Employees";

// =====================================================
// ADMIN SETTINGS PAGES
// =====================================================

import Settings from "../pages/admin/Settings";
import BillingPlan from "../pages/admin/BillingPlanSetting";
import Integrations from "../pages/admin/IntegrationSettings";
import NotificationSettings from "../pages/admin/NotificationSettings";
import SecuritySettingsPage from "../pages/admin/SecuritySetting";
import TeamSettings from "../pages/admin/TeamSettings";
import AIPreferences from "../pages/admin/AIPreferences";
import AccountSettings from "../pages/admin/AccountSettings";

// =====================================================
// EMPLOYEE PAGES
// =====================================================

import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeCustomers from "../pages/employee/EmployeeCustomers";
import EmployeeLeads from "../pages/employee/EmployeeLeads";
import EmployeeDeals from "../pages/employee/EmployeeDeals";
import EmployeeTasks from "../pages/employee/EmployeeTasks";
import EmployeeCalendar from "../pages/employee/EmployeeCalendar";
import EmployeeReports from "../pages/employee/EmployeeReports";
import EmployeeNotifications from "../pages/employee/EmployeeNotifications";
import EmployeeSettings from "../pages/employee/EmployeeSettings";

// =====================================================
// AUTH PAGES
// =====================================================

import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import CheckEmail from "../pages/Auth/CheckEmail";

// =====================================================
// PUBLIC PAGES
// =====================================================

import PublicHome from "../pages/public/PublicHome";
import ContactUs from "../pages/public/ContactUs";


const AppRoutes = () => {
  return (
    <Routes>

      {/* =====================================================
    PUBLIC ROUTES
===================================================== */}

<Route element={<PublicLayout />}>
  <Route path="/" element={<PublicHome />} />
  <Route path="/contact" element={<ContactUs />} />
</Route>


      {/* =====================================================
          AUTH ROUTES
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/check-email"
        element={<CheckEmail />}
      />


      {/* =====================================================
          ADMIN LAYOUT
      ===================================================== */}

      <Route element={<AdminLayout />}>

        {/* Main Admin Pages */}

        <Route
          path="/admin/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/admin/customers"
          element={<Customers />}
        />

        <Route
          path="/admin/deals"
          element={<Deals />}
        />

        <Route
          path="/admin/employees"
          element={<Employees />}
        />

        <Route
          path="/admin/leads"
          element={<Leads />}
        />

        <Route
          path="/admin/notifications"
          element={<Notifications />}
        />

        <Route
          path="/admin/reports"
          element={<Reports />}
        />


        {/* =================================================
            ADMIN SETTINGS
        ================================================= */}

        <Route
          path="/admin/settings"
          element={<Settings />}
        />

        <Route
          path="/admin/settings/account"
          element={<AccountSettings />}
        />

        <Route
          path="/admin/settings/team"
          element={<TeamSettings />}
        />

        <Route
          path="/admin/settings/notifications"
          element={<NotificationSettings />}
        />

        <Route
          path="/admin/settings/security"
          element={<SecuritySettingsPage />}
        />

        <Route
          path="/admin/settings/integrations"
          element={<Integrations />}
        />

        <Route
          path="/admin/settings/ai-preferences"
          element={<AIPreferences />}
        />

        <Route
          path="/admin/settings/billing"
          element={<BillingPlan />}
        />

      </Route>


      {/* =====================================================
          EMPLOYEE LAYOUT
      ===================================================== */}

      <Route element={<EmployeeLayout />}>

        <Route
          path="/employee/dashboard"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/employee/customers"
          element={<EmployeeCustomers />}
        />

        <Route
          path="/employee/leads"
          element={<EmployeeLeads />}
        />

        <Route
          path="/employee/deals"
          element={<EmployeeDeals />}
        />

        <Route
          path="/employee/tasks"
          element={<EmployeeTasks />}
        />

        <Route
          path="/employee/calendar"
          element={<EmployeeCalendar />}
        />

        <Route
          path="/employee/reports"
          element={<EmployeeReports />}
        />

        <Route
          path="/employee/notifications"
          element={<EmployeeNotifications />}
        />

        <Route
          path="/employee/settings"
          element={<EmployeeSettings />}
        />

      </Route>

    </Routes>
  );
};

export default AppRoutes;