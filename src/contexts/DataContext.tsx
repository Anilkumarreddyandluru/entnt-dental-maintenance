
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  email: string;
  healthInfo: string;
  address: string;
}

export interface FileAttachment {
  name: string;
  url: string;
  type: string;
}

export interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;
  cost?: number;
  treatment?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending';
  nextAppointmentDate?: string;
  files: FileAttachment[];
}

interface DataContextType {
  patients: Patient[];
  incidents: Incident[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addIncident: (incident: Omit<Incident, 'id'>) => void;
  updateIncident: (id: string, incident: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
  getPatientIncidents: (patientId: string) => Incident[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data
const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "John Doe",
    dob: "1990-05-10",
    contact: "1234567890",
    email: "john@entnt.in",
    healthInfo: "No allergies",
    address: "123 Main St, City"
  },
  {
    id: "p2",
    name: "Jane Smith",
    dob: "1985-08-15",
    contact: "0987654321",
    email: "jane@entnt.in",
    healthInfo: "Allergic to penicillin",
    address: "456 Oak Ave, Town"
  },
];

const mockIncidents: Incident[] = [
  {
    id: "i1",
    patientId: "p1",
    title: "Routine Cleaning",
    description: "Regular dental cleaning and checkup",
    comments: "Good oral hygiene",
    appointmentDate: "2025-07-08T10:00:00",
    cost: 120,
    treatment: "Professional cleaning, fluoride treatment",
    status: "Scheduled",
    files: []
  },
  {
    id: "i2",
    patientId: "p1",
    title: "Toothache Treatment",
    description: "Upper molar pain treatment",
    comments: "Sensitive to cold",
    appointmentDate: "2025-07-01T10:00:00",
    cost: 280,
    treatment: "Root canal therapy",
    status: "Completed",
    nextAppointmentDate: "2025-07-15T14:00:00",
    files: []
  },
  {
    id: "i3",
    patientId: "p2",
    title: "Dental Implant Consultation",
    description: "Consultation for dental implant",
    comments: "Missing tooth replacement",
    appointmentDate: "2025-07-10T15:00:00",
    status: "Scheduled",
    files: []
  }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // Initialize data from localStorage or use mock data
    const savedPatients = localStorage.getItem('patients');
    const savedIncidents = localStorage.getItem('incidents');
    
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    } else {
      setPatients(mockPatients);
      localStorage.setItem('patients', JSON.stringify(mockPatients));
    }
    
    if (savedIncidents) {
      setIncidents(JSON.parse(savedIncidents));
    } else {
      setIncidents(mockIncidents);
      localStorage.setItem('incidents', JSON.stringify(mockIncidents));
    }
  }, []);

  const savePatients = (newPatients: Patient[]) => {
    setPatients(newPatients);
    localStorage.setItem('patients', JSON.stringify(newPatients));
  };

  const saveIncidents = (newIncidents: Incident[]) => {
    setIncidents(newIncidents);
    localStorage.setItem('incidents', JSON.stringify(newIncidents));
  };

  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient = { ...patient, id: `p${Date.now()}` };
    const newPatients = [...patients, newPatient];
    savePatients(newPatients);
  };

  const updatePatient = (id: string, updatedPatient: Partial<Patient>) => {
    const newPatients = patients.map(p => p.id === id ? { ...p, ...updatedPatient } : p);
    savePatients(newPatients);
  };

  const deletePatient = (id: string) => {
    const newPatients = patients.filter(p => p.id !== id);
    const newIncidents = incidents.filter(i => i.patientId !== id);
    savePatients(newPatients);
    saveIncidents(newIncidents);
  };

  const addIncident = (incident: Omit<Incident, 'id'>) => {
    const newIncident = { ...incident, id: `i${Date.now()}` };
    const newIncidents = [...incidents, newIncident];
    saveIncidents(newIncidents);
  };

  const updateIncident = (id: string, updatedIncident: Partial<Incident>) => {
    const newIncidents = incidents.map(i => i.id === id ? { ...i, ...updatedIncident } : i);
    saveIncidents(newIncidents);
  };

  const deleteIncident = (id: string) => {
    const newIncidents = incidents.filter(i => i.id !== id);
    saveIncidents(newIncidents);
  };

  const getPatientIncidents = (patientId: string) => {
    return incidents.filter(i => i.patientId === patientId);
  };

  const value = {
    patients,
    incidents,
    addPatient,
    updatePatient,
    deletePatient,
    addIncident,
    updateIncident,
    deleteIncident,
    getPatientIncidents,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
