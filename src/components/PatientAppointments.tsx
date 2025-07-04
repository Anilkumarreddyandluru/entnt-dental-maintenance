
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Calendar, Clock, DollarSign, FileText, Image, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';

const PatientAppointments = () => {
  const { user } = useAuth();
  const { patients, incidents } = useData();
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  // Find the current patient
  const currentPatient = patients.find(p => p.id === user?.patientId);
  const patientIncidents = incidents.filter(i => i.patientId === user?.patientId);

  // Filter appointments based on status
  const filteredAppointments = patientIncidents.filter(incident => {
    return filterStatus === 'All' || incident.status === filterStatus;
  }).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Scheduled':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'Scheduled':
        return 'from-blue-50 to-cyan-50 border-blue-200';
      case 'Cancelled':
        return 'from-red-50 to-pink-50 border-red-200';
      default:
        return 'from-orange-50 to-yellow-50 border-orange-200';
    }
  };

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

  const downloadFile = (file: any) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const upcomingAppointments = patientIncidents.filter(
    i => new Date(i.appointmentDate) > new Date() && i.status === 'Scheduled'
  );

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
          <p className="text-gray-600 mt-1">View your appointment history and upcoming visits</p>
        </div>
        <div className="mt-4 md:mt-0 bg-gradient-to-r from-violet-100 to-purple-100 px-4 py-2 rounded-lg">
          <span className="text-violet-800 font-medium">
            {upcomingAppointments.length} upcoming appointments
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{patientIncidents.length}</div>
            <div className="text-sm text-blue-800">Total Appointments</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {patientIncidents.filter(i => i.status === 'Completed').length}
            </div>
            <div className="text-sm text-green-800">Completed</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{upcomingAppointments.length}</div>
            <div className="text-sm text-orange-800">Upcoming</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-4 border border-violet-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-violet-600">
              ${patientIncidents.reduce((sum, i) => sum + (i.cost || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-violet-800">Total Spent</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="All">All Appointments</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className={`bg-gradient-to-r ${getStatusColor(appointment.status)} rounded-xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{appointment.title}</h3>
                      {getStatusIcon(appointment.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{appointment.description}</p>
                    {appointment.comments && (
                      <p className="text-sm text-gray-500 italic">Notes: {appointment.comments}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedAppointment(
                      selectedAppointment === appointment.id ? null : appointment.id
                    )}
                    className="ml-4 px-4 py-2 bg-white/50 rounded-lg hover:bg-white/80 transition-colors text-sm font-medium"
                  >
                    {selectedAppointment === appointment.id ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-violet-600" />
                    <div>
                      <span className="font-medium text-gray-700">Date:</span>
                      <p className="text-gray-600">{formatDate(appointment.appointmentDate)}</p>
                    </div>
                  </div>
                  {appointment.cost && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <span className="font-medium text-gray-700">Cost:</span>
                        <p className="text-green-600 font-semibold">${appointment.cost}</p>
                      </div>
                    </div>
                  )}
                  {appointment.nextAppointmentDate && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <div>
                        <span className="font-medium text-gray-700">Next Appointment:</span>
                        <p className="text-blue-600">{formatDate(appointment.nextAppointmentDate)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {selectedAppointment === appointment.id && (
                  <div className="mt-4 space-y-4 bg-white/30 p-4 rounded-lg">
                    {appointment.treatment && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Treatment Details:</h4>
                        <p className="text-gray-600 bg-white/50 p-3 rounded-lg">{appointment.treatment}</p>
                      </div>
                    )}

                    {appointment.files.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Attachments ({appointment.files.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {appointment.files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white/50 p-3 rounded-lg border"
                            >
                              <div className="flex items-center space-x-3">
                                {file.type.startsWith('image/') ? (
                                  <Image className="h-5 w-5 text-violet-600" />
                                ) : (
                                  <FileText className="h-5 w-5 text-violet-600" />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {file.type.startsWith('image/') ? 'Image' : 'Document'}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => downloadFile(file)}
                                className="p-2 bg-violet-100 hover:bg-violet-200 rounded-lg transition-colors"
                                title="Download file"
                              >
                                <Download className="h-4 w-4 text-violet-600" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {appointment.status === 'Scheduled' && appointment.cost && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">Payment Information</h4>
                        <p className="text-blue-700">
                          Estimated cost: <span className="font-semibold">${appointment.cost}</span>
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          Please bring payment or insurance information to your appointment.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No appointments found</p>
          <p className="text-gray-400">
            {filterStatus === 'All' 
              ? 'You have no appointments scheduled'
              : `No ${filterStatus.toLowerCase()} appointments found`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
