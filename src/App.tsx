import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import AccountsManagementPage from "./pages/AccountsManagementPage";
import CardManagementPage from "./pages/CardManagementPage";
import DashboardOverviewPage from "./pages/DashboardOverviewPage";
import TransfersAndPaymentsPage from "./pages/TransfersAndPaymentsPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
        <Routes>


          <Route path="/" element={<DashboardOverviewPage />} />
          <Route path="/accounts-management" element={<AccountsManagementPage />} />
          <Route path="/card-management" element={<CardManagementPage />} />
          <Route path="/transfers-and-payments" element={<TransfersAndPaymentsPage />} />
          <Route path="/user-settings" element={<UserSettingsPage />} />
          {/* catch-all */}
          <Route path="*" element={<NotFound />} />


        </Routes>
    </BrowserRouter>
    </TooltipProvider>
</QueryClientProvider>
);

export default App;
