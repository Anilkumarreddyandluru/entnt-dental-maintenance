
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Calendar, Clock, DollarSign, FileText, User, Heart, Phone, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { patients, incidents } = useData();

  // Find the current patient
  const currentPatient = patients.find(p => p.id === user?.patientId);
  const patientIncidents = incidents.filter(i => i.patientId === user?.patientId);

  // Calculate patient statistics
  const upcomingAppointments = patientIncidents.filter(
    i => new Date(i.appointmentDate) > new Date() && i.status === 'Scheduled'
  );
  const completedTreatments = patientIncidents.filter(i => i.status === 'Completed');
  const totalSpent = patientIncidents.reduce((sum, i) => sum + (i.cost || 0), 0);
  const nextAppointment = upcomingAppointments
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())[0];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (!currentPatient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Patient profile not found</p>
        </div>
      </div>
    );
  }

  const handleScheduleAppointment = () => {
    toast({
      title: "Schedule Appointment",
      description: "Please contact your dentist at (555) 123-4567 to schedule your next appointment.",
    });
  };

  const handleViewHistory = () => {
    toast({
      title: "Treatment History",
      description: `You have ${patientIncidents.length} total visits with ${completedTreatments.length} completed treatments.`,
    });
  };

  const handleHealthRecords = () => {
    toast({
      title: "Health Records",
      description: "Contact your dentist's office to update your health information and medical history.",
    });
  };

  if (!currentPatient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Patient profile not found</p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {currentPatient.name}!</h1>
            <p className="text-violet-100 mt-2">Here's your dental care overview</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/20 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <div className="text-sm text-violet-100">Upcoming Appointments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Information Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <User className="h-5 w-5 text-violet-600 mr-2" />
          My Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-violet-600" />
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-semibold text-gray-800">{calculateAge(currentPatient.dob)} years old</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-800">{currentPatient.contact}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{currentPatient.email}</p>
              </div>
            </div>
          </div>
        </div>

        {currentPatient.healthInfo && (
          <div className="mt-6 bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-100">
            <div className="flex items-start space-x-3">
              <Heart className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Health Information</p>
                <p className="text-red-600 mt-1">{currentPatient.healthInfo}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Visits</p>
              <p className="text-3xl font-bold text-blue-800 mt-2">{patientIncidents.length}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Completed Treatments</p>
              <p className="text-3xl font-bold text-green-800 mt-2">{completedTreatments.length}</p>
            </div>
            <div className="bg-green-200 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-600 text-sm font-medium">Total Spent</p>
              <p className="text-3xl font-bold text-violet-800 mt-2">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-violet-200 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-violet-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Appointment */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Calendar className="h-5 w-5 text-violet-600 mr-2" />
            Next Appointment
          </h2>

          {nextAppointment ? (
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-lg border border-violet-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{nextAppointment.title}</h3>
              <p className="text-violet-600 font-medium mb-3">
                {formatDate(nextAppointment.appointmentDate)}
              </p>
              <p className="text-gray-600 mb-3">{nextAppointment.description}</p>
              {nextAppointment.comments && (
                <p className="text-sm text-gray-500 italic">Notes: {nextAppointment.comments}</p>
              )}
              {nextAppointment.cost && (
                <div className="mt-4 flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-semibold">Estimated Cost: ${nextAppointment.cost}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No upcoming appointments</p>
              <p className="text-sm">Contact your dentist to schedule your next visit</p>
            </div>
          )}
        </div>

        {/* Recent Treatments */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="h-5 w-5 text-violet-600 mr-2" />
            Recent Treatments
          </h2>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {completedTreatments.slice(0, 5).map((treatment) => (
              <div
                key={treatment.id}
                className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{treatment.title}</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(treatment.appointmentDate).toLocaleDateString()}
                </p>
                {treatment.treatment && (
                  <p className="text-sm text-gray-600 mb-2">Treatment: {treatment.treatment}</p>
                )}
                {treatment.cost && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-semibold">${treatment.cost}</span>
                  </div>
                )}
                {treatment.files.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">{treatment.files.length} file(s) attached</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {completedTreatments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No completed treatments yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleScheduleAppointment}
            className="bg-gradient-to-r from-violet-100 to-purple-100 p-4 rounded-lg text-center hover:from-violet-200 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer"
          >
            <Calendar className="h-8 w-8 text-violet-600 mx-auto mb-2" />
            <p className="font-medium text-violet-800">Schedule Appointment</p>
            <p className="text-xs text-violet-600 mt-1">Contact your dentist to book</p>
          </button>
          
          <button
            onClick={handleViewHistory}
            className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg text-center hover:from-blue-200 hover:to-cyan-200 transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer"
          >
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-blue-800">View History</p>
            <p className="text-xs text-blue-600 mt-1">See all appointments</p>
          </button>
          
          <button
            onClick={handleHealthRecords}
            className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg text-center hover:from-green-200 hover:to-emerald-200 transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer"
          >
            <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-800">Health Records</p>
            <p className="text-xs text-green-600 mt-1">Update health info</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
