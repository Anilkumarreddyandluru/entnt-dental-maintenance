
import React from 'react';
import { useData } from '../contexts/DataContext';
import { Calendar, Users, Activity, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { patients, incidents } = useData();

  // Calculate KPIs
  const totalPatients = patients.length;
  const totalRevenue = incidents.reduce((sum, incident) => sum + (incident.cost || 0), 0);
  const completedTreatments = incidents.filter(i => i.status === 'Completed').length;
  const pendingTreatments = incidents.filter(i => i.status === 'Scheduled' || i.status === 'Pending').length;
  
  // Next 10 appointments
  const upcomingAppointments = incidents
    .filter(i => new Date(i.appointmentDate) > new Date() && i.status === 'Scheduled')
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    .slice(0, 10);

  // Top patients by number of visits
  const patientVisits = patients.map(patient => ({
    ...patient,
    visits: incidents.filter(i => i.patientId === patient.id).length,
    totalSpent: incidents.filter(i => i.patientId === patient.id).reduce((sum, i) => sum + (i.cost || 0), 0)
  })).sort((a, b) => b.visits - a.visits).slice(0, 5);

  const kpiCards = [
    {
      title: 'Total Patients',
      value: totalPatients.toString(),
      icon: Users,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'from-violet-50 to-purple-50'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Completed Treatments',
      value: completedTreatments.toString(),
      icon: CheckCircle,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Pending Treatments',
      value: pendingTreatments.toString(),
      icon: Clock,
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'from-orange-50 to-yellow-50'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening at your clinic.</p>
        </div>
        <div className="mt-4 md:mt-0 text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.bgColor} rounded-xl p-6 border border-white shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className={`bg-gradient-to-r ${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Calendar className="h-5 w-5 text-violet-600 mr-2" />
              Upcoming Appointments
            </h2>
            <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-medium">
              {upcomingAppointments.length} scheduled
            </span>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{patient?.name}</h3>
                        {getStatusIcon(appointment.status)}
                      </div>
                      <p className="text-sm text-gray-600">{appointment.title}</p>
                      <p className="text-xs text-violet-600 font-medium">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                    </div>
                    {appointment.cost && (
                      <div className="text-right">
                        <span className="text-lg font-bold text-green-600">
                          ${appointment.cost}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Patients */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Users className="h-5 w-5 text-violet-600 mr-2" />
              Top Patients
            </h2>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              By visits
            </span>
          </div>
          
          <div className="space-y-4">
            {patientVisits.map((patient, index) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.contact}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">
                    {patient.visits} visits
                  </div>
                  <div className="text-sm text-green-600 font-semibold">
                    ${patient.totalSpent.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Activity className="h-5 w-5 text-violet-600 mr-2" />
          Treatment Statistics
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedTreatments}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{pendingTreatments}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {incidents.filter(i => i.status === 'Cancelled').length}
            </div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-violet-600">{incidents.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
