import React, { useState, useEffect } from 'react';
import { useUser } from '@/provider/UserProvider';
import { BACKEND_URL } from '@/utils/getResponse';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const MyAppointments = () => {
  const { user } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/profile`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch appointments');
      }

      setAppointments(data.user.appointment_history || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewChats = (appointment) => {
    setSelectedAppointment(appointment);
    setIsSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <Button asChild className="bg-medical-blue hover:bg-blue-700">
            <a href="/book-appointment">Book New Appointment</a>
          </Button>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
              <p className="text-gray-500 text-center mb-6">
                You haven't booked any appointments yet. Book your first appointment to get started.
              </p>
              <Button asChild className="bg-medical-blue hover:bg-blue-700">
                <a href="/book-appointment">Book Appointment</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment, index) => (
              <Card key={index} className="overflow-hidden">

                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold">
                        {appointment.disease || 'General Consultation'}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {appointment.description || 'No description provided'}
                      </CardDescription>
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{appointment.chats?.length || 0} messages</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewChats(appointment)}
                        // disabled={!appointment.chats || appointment.chats.length === 0}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Chats
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Chat History Sidebar */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] p-4">
          <SheetHeader>
            <SheetTitle>Chat History</SheetTitle>
            <SheetDescription>
              Conversation for {selectedAppointment?.disease || 'Appointment'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 flex-1 overflow-y-auto">
            {selectedAppointment?.chats && selectedAppointment.chats.length > 0 ? (
              <div className="space-y-4">
                {selectedAppointment.chats.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      chat.role === 'doctor' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        chat.role === 'doctor'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="text-xs font-medium mb-1 capitalize">
                        {chat.role === 'doctor' ? 'Doctor' : 'Patient'}
                      </div>
                      <div className="text-sm">
                        {chat.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                <MessageSquare className="h-12 w-12 mb-4" />
                <p>No chat history available for this appointment.</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MyAppointments; 