
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookAppointment from "./pages/BookAppointment";
import DoctorClinic from "./pages/DoctorClinic";
import NotFound from "./pages/NotFound";
import { BookAppointmentProvider } from "./context/BookAppointmentContext";
import UserProvider from "./provider/UserProvider";
import MyAppointments from "./pages/MyAppointments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Sonner />

    <TooltipProvider>
      <UserProvider>
        <BookAppointmentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/doctor-clinic" element={<DoctorClinic />} />
              <Route path="/appointments" element={<MyAppointments />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BookAppointmentProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;