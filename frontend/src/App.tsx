
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import HowItWorksPage from "./pages/HowItWorks";
import About from "./pages/About";
import AllReports from "./pages/AllReports";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import WhatsAppReportsDemo from "./components/WhatsAppReportsDemo";
import MultiChannelDemo from "./components/MultiChannelDemo";
import { AdminApp } from "./components/AdminApp";
import { Chatbot } from "./components/Chatbot";

const queryClient = new QueryClient();

// Component to conditionally render chatbot based on route
const ChatbotWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return <Chatbot isAdmin={isAdminRoute} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reports" element={<AllReports />} />
          <Route path="/whatsapp-demo" element={<WhatsAppReportsDemo />} />
          <Route path="/multi-channel-demo" element={<MultiChannelDemo />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminApp />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatbotWrapper />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
