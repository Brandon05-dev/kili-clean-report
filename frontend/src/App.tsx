
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HowItWorksPage from "./pages/HowItWorks";
import About from "./pages/About";
import AllReports from "./pages/AllReports";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import WhatsAppReportsDemo from "./components/WhatsAppReportsDemo";
import MultiChannelDemo from "./components/MultiChannelDemo";
import { AdminApp } from "./components/AdminApp";

const queryClient = new QueryClient();

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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
