
import React from 'react';
import Navbar from '@/components/Navbar';
import { Brain, Stethoscope, Heart, Pill } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const About = () => {
  const diseases = [
    { name: "Diabetes", description: "AI analysis of blood sugar patterns and management recommendations." },
    { name: "Hypertension", description: "Blood pressure monitoring and lifestyle modification advice." },
    { name: "Asthma", description: "Breathing pattern analysis and personalized treatment suggestions." },
    { name: "Influenza", description: "Symptom recognition and recovery guidance for flu variants." },
    { name: "Common Cold", description: "Differentiation from similar conditions and management advice." },
    { name: "Migraine", description: "Trigger identification and personalized treatment options." },
    { name: "Depression", description: "Mood pattern analysis and therapeutic recommendations." },
    { name: "Anxiety", description: "Stress response evaluation and coping strategy suggestions." },
    { name: "Allergies", description: "Allergen identification assistance and management protocols." },
    { name: "Gastroesophageal Reflux Disease (GERD)", description: "Dietary and lifestyle recommendations for symptom control." },
  ];

  const faqs = [
    {
      question: "How accurate is the AI Doctor?",
      answer: "Our AI Doctor system has been trained on millions of medical records and cases, achieving an accuracy rate of over 90% for common conditions. However, it's designed to be a supplementary tool and not a replacement for professional medical advice."
    },
    {
      question: "Is my medical data secure?",
      answer: "Yes, we prioritize your privacy and security. All data is encrypted using industry-standard protocols, and we comply with HIPAA regulations. Your medical information is never shared without your explicit consent."
    },
    {
      question: "Can I use AI Doctor for emergencies?",
      answer: "No, AI Doctor is not suitable for emergency situations. If you're experiencing a medical emergency, please call emergency services immediately or visit the nearest emergency room."
    },
    {
      question: "How does the AI Doctor make diagnoses?",
      answer: "The AI Doctor analyzes your reported symptoms, medical history, and relevant factors using advanced machine learning algorithms. It compares this information against a vast database of medical knowledge to suggest possible conditions and treatments."
    },
    {
      question: "Can I speak with a human doctor if needed?",
      answer: "Absolutely. While our AI provides initial guidance, we can arrange consultations with human healthcare professionals for complex cases or when you prefer human interaction."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-medical-light py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">About AI Doctor</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our AI-powered healthcare assistant combines cutting-edge artificial intelligence with medical expertise
            to provide accessible, personalized healthcare guidance whenever you need it.
          </p>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex items-start">
              <div className="bg-medical-blue bg-opacity-10 p-3 rounded-full mr-4">
                <Brain className="text-white h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Advanced AI Analysis</h3>
                <p className="text-gray-600">
                  Our sophisticated AI algorithms analyze your symptoms and medical history to provide
                  accurate preliminary diagnoses and health recommendations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-medical-green bg-opacity-10 p-3 rounded-full mr-4">
                <Stethoscope className="text-white h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Medical Expertise</h3>
                <p className="text-gray-600">
                  Developed in collaboration with experienced healthcare professionals to ensure
                  the highest standards of medical accuracy and care.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-medical-orange bg-opacity-10 p-3 rounded-full mr-4">
                <Heart className="text-white h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Personalized Care</h3>
                <p className="text-gray-600">
                  We provide tailored health recommendations based on your unique medical profile,
                  lifestyle factors, and specific health concerns.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-500 bg-opacity-10 p-3 rounded-full mr-4">
                <Pill className="text-white h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Treatment Guidance</h3>
                <p className="text-gray-600">
                  Receive evidence-based treatment suggestions and medication information
                  to help manage your condition effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Supported Diseases Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Supported Conditions</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Our AI Doctor is trained to recognize and provide guidance on a wide range of common health conditions,
            including but not limited to:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diseases.map((disease, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 text-medical-blue">{disease.name}</h3>
                <p className="text-gray-600">{disease.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-medium py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
                <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="/book-appointment" className="text-gray-300 hover:text-white">Book Appointment</a></li>
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

export default About;
