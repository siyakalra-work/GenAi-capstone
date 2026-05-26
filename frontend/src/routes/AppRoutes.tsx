import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { RequireAuth } from "./RequireAuth";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { ProductsListPage } from "../pages/products/ProductsListPage";
import { ProductCreatePage } from "../pages/products/ProductCreatePage";
import { ProductEditPage } from "../pages/products/ProductEditPage";
import { TransactionsPage } from "../pages/inventory/TransactionsPage";
import { StockInPage } from "../pages/inventory/StockInPage";
import { StockOutPage } from "../pages/inventory/StockOutPage";
import { AdjustmentPage } from "../pages/inventory/AdjustmentPage";
import { AiAssistantPage } from "../pages/ai/AiAssistantPage";
import { KnowledgeBasePage } from "../pages/ai/KnowledgeBasePage";
import { AiReportsPage } from "../pages/ai/AiReportsPage";
import { SettingsPage } from "../pages/settings/SettingsPage";
import { UsersPage } from "../pages/users/UsersPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsListPage />} />
        <Route path="/products/new" element={<ProductCreatePage />} />
        <Route path="/products/:id/edit" element={<ProductEditPage />} />

        <Route path="/inventory/transactions" element={<TransactionsPage />} />
        <Route path="/inventory/stock-in" element={<StockInPage />} />
        <Route path="/inventory/stock-out" element={<StockOutPage />} />
        <Route path="/inventory/adjustment" element={<AdjustmentPage />} />

        <Route path="/ai/assistant" element={<AiAssistantPage />} />
        <Route path="/ai/knowledge-base" element={<KnowledgeBasePage />} />
        <Route path="/ai/reports" element={<AiReportsPage />} />

        <Route path="/users" element={<UsersPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

