
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import HowItWorksPage from "./pages/HowItWorks";
import About from "./pages/About";
import AllReports from "./pages/AllReports";
import NotFound from "./pages/NotFound";
import WhatsAppReportsDemo from "./components/WhatsAppReportsDemo";
import MultiChannelDemo from "./components/MultiChannelDemo";
import { AdminDemo } from "./components/AdminDemo";
import { EmailVerification } from "./components/EmailVerification";
import { PhoneVerification } from "./components/PhoneVerification";
import { SuperAdminLogin } from "./components/SuperAdminLogin";
import { SuperAdminPanel } from "./components/SuperAdminPanel";
import { CompleteInvitation } from "./components/CompleteInvitation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reports" element={<AllReports />} />
            <Route path="/whatsapp-demo" element={<WhatsAppReportsDemo />} />
            <Route path="/multi-channel-demo" element={<MultiChannelDemo />} />
            <Route path="/admin-demo" element={<AdminDemo />} />
            <Route path="/admin/verify-email" element={<EmailVerification />} />
            <Route path="/admin/verify-phone" element={<PhoneVerification />} />
            <Route path="/super-admin-login" element={<SuperAdminLogin />} />
            <Route path="/super-admin" element={<SuperAdminPanel />} />
            <Route path="/admin/complete-invite" element={<CompleteInvitation />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
