import React, { useState, useEffect } from 'react';
import { useUser } from '@/provider/UserProvider';
import { BACKEND_URL } from '@/utils/getResponse';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';

const MyAppointments = () => {
  const { user } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-semibold">
                        {appointment.disease || 'General Consultation'}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {appointment.description || 'No description provided'}
                      </CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status || 'Pending'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">
                          {appointment.date ? format(new Date(appointment.date), 'MMMM dd, yyyy') : 'Date not set'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">
                          {appointment.time || 'Time not set'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">
                          {appointment.chats?.length || 0} messages
                        </span>
                      </div>
                    </div>
                  </div>
                  {appointment.chats && appointment.chats.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-3">Recent Messages</h4>
                      <div className="space-y-3">
                        {appointment.chats.slice(-2).map((chat, chatIndex) => (
                          <div
                            key={chatIndex}
                            className={`p-3 rounded-lg ${
                              chat.role === 'doctor'
                                ? 'bg-blue-50 ml-4'
                                : 'bg-gray-50 mr-4'
                            }`}
                          >
                            <p className="text-sm text-gray-700">{chat.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {chat.role === 'doctor' ? 'Doctor' : 'You'} • {format(new Date(), 'MMM dd, h:mm a')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments; 