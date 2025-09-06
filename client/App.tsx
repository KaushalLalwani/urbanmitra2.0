import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import CommunityFeed from "./pages/CommunityFeed";
import Profile from "./pages/Profile";
import { IssuesProvider } from "@/context/IssuesContext";
import ReportIssue from "./pages/ReportIssue";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <IssuesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/community" element={<CommunityFeed />} />
              <Route path="/feed" element={<CommunityFeed />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/report-issue" element={
                <ProtectedRoute requiredRole="user">
                  <ReportIssue />
                </ProtectedRoute>
              } />

              <Route path="/authority-dashboard" element={
                <ProtectedRoute requiredRole="authority">
                  <AuthorityDashboard />
                </ProtectedRoute>
              } />
              <Route path="/authority" element={<ProtectedRoute requiredRole="authority"><AuthorityDashboard /></ProtectedRoute>} />

              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </IssuesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

import type { Root } from "react-dom/client";

const container = document.getElementById("root")!;
const anyWindow = window as unknown as { __APP_ROOT__?: Root };
if (anyWindow.__APP_ROOT__) {
  anyWindow.__APP_ROOT__!.render(<App />);
} else {
  anyWindow.__APP_ROOT__ = createRoot(container);
  anyWindow.__APP_ROOT__!.render(<App />);
}
