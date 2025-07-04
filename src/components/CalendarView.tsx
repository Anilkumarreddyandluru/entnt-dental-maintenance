
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, MapPin } from 'lucide-react';

const CalendarView = () => {
  const { patients, incidents } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get appointments for the current month
  const monthlyAppointments = incidents.filter(incident => {
    const appointmentDate = new Date(incident.appointmentDate);
    return appointmentDate.getMonth() === currentMonth && 
           appointmentDate.getFullYear() === currentYear;
  });

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return monthlyAppointments.filter(incident => {
      const appointmentDate = new Date(incident.appointmentDate);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  // Get appointments for selected date
  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null);
  };

  const selectDate = (day: number) => {
    const selected = new Date(currentYear, currentMonth, day);
    setSelectedDate(selected);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'Scheduled':
        return 'bg-blue-500';
      case 'Cancelled':
        return 'bg-red-500';
      default:
        return 'bg-orange-500';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Calendar View</h1>
          <p className="text-gray-600 mt-1">View and manage appointments by date</p>
        </div>
        <div className="mt-4 md:mt-0 bg-gradient-to-r from-violet-100 to-purple-100 px-4 py-2 rounded-lg">
          <span className="text-violet-800 font-medium">
            {monthlyAppointments.length} appointments this month
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-violet-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-violet-600" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-violet-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-violet-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="h-24"></div>;
                }

                const currentDateObj = new Date(currentYear, currentMonth, day);
                const dayAppointments = getAppointmentsForDate(currentDateObj);
                const isToday = currentDateObj.toDateString() === today.toDateString();
                const isSelected = selectedDate?.toDateString() === currentDateObj.toDateString();

                return (
                  <div
                    key={day}
                    onClick={() => selectDate(day)}
                    className={`h-24 p-2 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected ? 'bg-gradient-to-br from-violet-100 to-purple-100 border-violet-300' :
                      isToday ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300' :
                      'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`text-right font-semibold mb-1 ${
                      isToday ? 'text-blue-600' : isSelected ? 'text-violet-600' : 'text-gray-800'
                    }`}>
                      {day}
                    </div>
                    
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((appointment, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-1 py-0.5 rounded text-white truncate ${getStatusColor(appointment.status)}`}
                          title={`${formatTime(appointment.appointmentDate)} - ${appointment.title}`}
                        >
                          {formatTime(appointment.appointmentDate)}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500 px-1">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <Calendar className="h-5 w-5 text-violet-600 mr-2" />
              {selectedDate ? (
                selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })
              ) : (
                'Select a date'
              )}
            </h3>
            {selectedDate && (
              <p className="text-gray-600 mt-1">
                {selectedDateAppointments.length} appointment{selectedDateAppointments.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="p-6">
            {selectedDate ? (
              selectedDateAppointments.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedDateAppointments.map((appointment) => {
                    const patient = patients.find(p => p.id === appointment.patientId);
                    return (
                      <div
                        key={appointment.id}
                        className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-lg border border-violet-100"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">{appointment.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                            appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-violet-600" />
                            <span>{formatTime(appointment.appointmentDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-violet-600" />
                            <span>{patient?.name}</span>
                          </div>
                          {patient?.contact && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-violet-600" />
                              <span>{patient.contact}</span>
                            </div>
                          )}
                        </div>
                        
                        {appointment.description && (
                          <p className="text-sm text-gray-600 mt-2 p-2 bg-white/50 rounded">
                            {appointment.description}
                          </p>
                        )}
                        
                        {appointment.cost && (
                          <div className="mt-2 text-sm font-semibold text-green-600">
                            Cost: ${appointment.cost}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No appointments scheduled</p>
                  <p className="text-sm">for this date</p>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Click on a date to view</p>
                <p className="text-sm">scheduled appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Cancelled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
