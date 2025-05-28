
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, Stethoscope, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-medical-light to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Virtual Healthcare<br />
                <span className="text-medical-blue">For You</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-lg">
                Get instant medical assistance and personalized healthcare advice from our AI Doctor. Book an appointment in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="hero-button bg-medical-blue hover:bg-blue-700">
                  <Link to="/book-appointment">Book Appointment</Link>
                </Button>
                <Button asChild variant="outline" className="hero-button border-medical-blue text-medical-blue hover:bg-blue-50">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="bg-white rounded-full shadow-xl p-6 animate-pulse-slow">
                  <div className="bg-medical-light rounded-full p-10">
                    <div className="bg-medical-blue rounded-full h-40 w-40 flex items-center justify-center">
                      <Stethoscope size={80} className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-medical-green rounded-full p-4 shadow-lg">
                  <Heart size={24} className="text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-medical-orange rounded-full p-4 shadow-lg">
                  <Clock size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-6 text-center card-hover">
              <div className="bg-medical-blue bg-opacity-10 rounded-full p-4 inline-block mb-4">
                <Calendar size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Book Appointment</h3>
              <p className="text-gray-600">
                Choose a time that works for you and book your virtual consultation in minutes.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-6 text-center card-hover">
              <div className="bg-medical-green bg-opacity-10 rounded-full p-4 inline-block mb-4">
                <Stethoscope size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Diagnosis</h3>
              <p className="text-gray-600">
                Our AI system analyzes your symptoms and provides preliminary medical advice.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-6 text-center card-hover">
              <div className="bg-medical-orange bg-opacity-10 rounded-full p-4 inline-block mb-4">
                <Heart size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Treatment</h3>
              <p className="text-gray-600">
                Receive personalized treatment plans and medical advice for your condition.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild className="bg-medical-blue hover:bg-blue-700">
              <Link to="/book-appointment">Book Your Appointment Now</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Patients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm card-hover">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-medical-blue text-white flex items-center justify-center font-semibold text-lg">JD</div>
                <div className="ml-4">
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-gray-500 text-sm">Patient</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The AI Doctor provided me with accurate advice for my condition. It was quick, convenient, and saved me a trip to the hospital."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm card-hover">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-medical-green text-white flex items-center justify-center font-semibold text-lg">JS</div>
                <div className="ml-4">
                  <h4 className="font-semibold">Jane Smith</h4>
                  <p className="text-gray-500 text-sm">Patient</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I was skeptical at first, but the AI Doctor's diagnosis was confirmed by my physician. Impressed with the accuracy!"
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm card-hover">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-medical-orange text-white flex items-center justify-center font-semibold text-lg">RJ</div>
                <div className="ml-4">
                  <h4 className="font-semibold">Robert Johnson</h4>
                  <p className="text-gray-500 text-sm">Patient</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Using the AI Doctor app has been a game-changer for managing my chronic condition. The follow-ups and reminders are extremely helpful."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">AI Doctor</h3>
              <p className="text-gray-300">
                Providing accessible healthcare through advanced AI technology.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                <li><Link to="/book-appointment" className="text-gray-300 hover:text-white">Book Appointment</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">
                123 Medical Center Drive<br />
                Health City, HC 12345<br />
                contact@aidoctor.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} AI Doctor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
