import React, { createContext, useState, useContext } from 'react';

const BookAppointmentContext = createContext();

export const BookAppointmentProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [diseases, setDiseases] = useState('');
  const [description, setDescription] = useState('');

  const value = {
    name,
    setName,
    diseases,
    setDiseases,
    description,
    setDescription,
  };

  return (
    <BookAppointmentContext.Provider value={value}>
      {children}
    </BookAppointmentContext.Provider>
  );
};

export const useBookAppointment = () => {
  const context = useContext(BookAppointmentContext);
  if (!context) {
    throw new Error('useBookAppointment must be used within a BookAppointmentProvider');
  }
  return context;
};
