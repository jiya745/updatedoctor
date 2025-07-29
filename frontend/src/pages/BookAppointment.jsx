import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { useBookAppointment } from '@/context/BookAppointmentContext';
import { BACKEND_URL } from '@/utils/getResponse';
import { useUser } from '@/provider/UserProvider';

const BookAppointment = () => {
  const navigate = useNavigate();
  const {setName, setDiseases, setDescription} = useBookAppointment();
  const [formData, setFormData] = useState({
    name: '',
    disease: '',
    symptoms: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    disease: '',
    symptoms: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const {user} = useUser();

  useEffect(() => {
    if(user){
      setFormData(prev => ({...prev,name: user.name}))
    }
  },[user])
  const diseases = [
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Influenza",
    "Common Cold",
    "Migraine",
    "Depression",
    "Anxiety",
    "Allergies",
    "Gastroesophageal Reflux Disease (GERD)",
    "Other"
  ];

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      disease: '',
      symptoms: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.disease) {
      newErrors.disease = 'Please select a condition';
      valid = false;
    }

    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Symptom description is required';
      valid = false;
    } else if (formData.symptoms.trim().length < 10) {
      newErrors.symptoms = 'Please provide more details about your symptoms';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      disease: value,
    });
    
    if (errors.disease) {
      setErrors({
        ...errors,
        disease: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/appointments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: formData.name,
            disease: formData.disease,
            description: formData.symptoms
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to create appointment');
        }

        setName(formData.name);
        setDiseases(formData.disease);
        setDescription(formData.symptoms);
        
        toast.success("Your appointment has been successfully scheduled.");
        
        navigate('/doctor-clinic', { 
          state: { 
            appointmentData: formData 
          } 
        });
      } catch (error) {
        console.error('Error creating appointment:', error);
        toast.error(error.message || 'Failed to create appointment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Book Your Appointment</h1>
            <p className="mt-2 text-lg text-gray-600">
              Fill in your details below to schedule a consultation with our Health Sphere
            </p>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>
                Please provide accurate information to receive the best medical advice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="disease">Condition / Disease</Label>
                  <Select
                    value={formData.disease}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger id="disease" className={errors.disease ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {diseases.map((disease) => (
                        <SelectItem key={disease} value={disease}>
                          {disease}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.disease && <p className="text-sm text-red-500">{errors.disease}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Description of Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    name="symptoms"
                    placeholder="Please describe your symptoms in detail. Include when they started, their severity, and any other relevant information."
                    rows={5}
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    className={errors.symptoms ? 'border-red-500' : ''}
                  />
                  {errors.symptoms && <p className="text-sm text-red-500">{errors.symptoms}</p>}
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmit} 
                className="w-full bg-medical-blue hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Book Appointment'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-8 text-center text-gray-600">
            <p>
              By booking an appointment, you agree to our{' '}
              <a href="#" className="text-medical-blue hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-medical-blue hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
