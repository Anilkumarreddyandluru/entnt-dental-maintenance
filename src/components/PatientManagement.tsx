
import React, { useState } from 'react';
import { useData, Patient } from '../contexts/DataContext';
import { Plus, Search, Edit, Trash2, User, Phone, Mail, MapPin, Calendar, Heart } from 'lucide-react';

const PatientManagement = () => {
  const { patients, addPatient, updatePatient, deletePatient, getPatientIncidents } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    contact: '',
    email: '',
    healthInfo: '',
    address: ''
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      name: '',
      dob: '',
      contact: '',
      email: '',
      healthInfo: '',
      address: ''
    });
    setEditingPatient(null);
  };

  const handleOpenModal = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        dob: patient.dob,
        contact: patient.contact,
        email: patient.email,
        healthInfo: patient.healthInfo,
        address: patient.address
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      updatePatient(editingPatient.id, formData);
    } else {
      addPatient(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (patient: Patient) => {
    if (window.confirm(`Are you sure you want to delete ${patient.name}? This will also delete all their appointments.`)) {
      deletePatient(patient.id);
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Patient Management</h1>
          <p className="text-gray-600 mt-1">Manage your patient records and information</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mt-4 md:mt-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => {
          const appointments = getPatientIncidents(patient.id);
          const upcomingAppointments = appointments.filter(
            a => new Date(a.appointmentDate) > new Date() && a.status === 'Scheduled'
          ).length;
          
          return (
            <div
              key={patient.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(patient)}
                      className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Edit className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(patient)}
                      className="bg-white/20 p-2 rounded-lg hover:bg-red-500/50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{patient.name}</h3>
                  <p className="text-gray-600">Age: {calculateAge(patient.dob)} years</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="h-4 w-4 text-violet-600" />
                    <span className="text-sm">{patient.contact}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="h-4 w-4 text-violet-600" />
                    <span className="text-sm">{patient.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="h-4 w-4 text-violet-600" />
                    <span className="text-sm">{patient.address}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="h-4 w-4 text-violet-600" />
                    <span className="text-sm">Born: {new Date(patient.dob).toLocaleDateString()}</span>
                  </div>
                </div>

                {patient.healthInfo && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-lg border border-red-100">
                    <div className="flex items-start space-x-2">
                      <Heart className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Health Information</p>
                        <p className="text-sm text-red-600">{patient.healthInfo}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-violet-600">{appointments.length}</div>
                    <div className="text-xs text-gray-500">Total Visits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{upcomingAppointments}</div>
                    <div className="text-xs text-gray-500">Upcoming</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">
                      {appointments.filter(a => a.status === 'Completed').length}
                    </div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No patients found</p>
          <p className="text-gray-400">Try adjusting your search or add a new patient</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
              <h2 className="text-2xl font-bold">
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Information & Allergies
                </label>
                <textarea
                  value={formData.healthInfo}
                  onChange={(e) => setFormData({ ...formData, healthInfo: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Any allergies, medical conditions, or important health information..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200"
                >
                  {editingPatient ? 'Update Patient' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
