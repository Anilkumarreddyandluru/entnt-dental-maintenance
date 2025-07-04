
import React, { useState } from 'react';
import { useData, Incident, FileAttachment } from '../contexts/DataContext';
import { Plus, Search, Edit, Trash2, Clock, CheckCircle, XCircle, DollarSign, Upload, FileText, Image, X } from 'lucide-react';

const AppointmentManagement = () => {
  const { patients, incidents, addIncident, updateIncident, deleteIncident } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    comments: '',
    appointmentDate: '',
    cost: '',
    treatment: '',
    status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending',
    nextAppointmentDate: ''
  });

  const filteredIncidents = incidents.filter(incident => {
    const patient = patients.find(p => p.id === incident.patientId);
    const matchesSearch = patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || incident.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      patientId: '',
      title: '',
      description: '',
      comments: '',
      appointmentDate: '',
      cost: '',
      treatment: '',
      status: 'Scheduled',
      nextAppointmentDate: ''
    });
    setSelectedFiles([]);
    setEditingIncident(null);
  };

  const handleOpenModal = (incident?: Incident) => {
    if (incident) {
      setEditingIncident(incident);
      setFormData({
        patientId: incident.patientId,
        title: incident.title,
        description: incident.description,
        comments: incident.comments,
        appointmentDate: incident.appointmentDate.slice(0, 16),
        cost: incident.cost?.toString() || '',
        treatment: incident.treatment || '',
        status: incident.status,
        nextAppointmentDate: incident.nextAppointmentDate?.slice(0, 16) || ''
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const convertFilesToBase64 = async (files: File[]): Promise<FileAttachment[]> => {
    const filePromises = files.map(file => {
      return new Promise<FileAttachment>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            name: file.name,
            url: e.target?.result as string,
            type: file.type
          });
        };
        reader.readAsDataURL(file);
      });
    });
    return Promise.all(filePromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fileAttachments = await convertFilesToBase64(selectedFiles);
    
    const incidentData = {
      ...formData,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      files: editingIncident ? [...editingIncident.files, ...fileAttachments] : fileAttachments
    };

    if (editingIncident) {
      updateIncident(editingIncident.id, incidentData);
    } else {
      addIncident(incidentData);
    }
    handleCloseModal();
  };

  const handleDelete = (incident: Incident) => {
    const patient = patients.find(p => p.id === incident.patientId);
    if (window.confirm(`Are you sure you want to delete the appointment "${incident.title}" for ${patient?.name}?`)) {
      deleteIncident(incident.id);
    }
  };

  const removeFile = (incident: Incident, fileIndex: number) => {
    const updatedFiles = incident.files.filter((_, index) => index !== fileIndex);
    updateIncident(incident.id, { files: updatedFiles });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Scheduled':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-orange-500" />;
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Appointment Management</h1>
          <p className="text-gray-600 mt-1">Manage patient appointments and treatments</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="mt-4 md:mt-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Schedule Appointment</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient name, appointment title, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => {
          const patient = patients.find(p => p.id === incident.patientId);
          return (
            <div
              key={incident.id}
              className={`bg-gradient-to-r ${getStatusColor(incident.status)} rounded-xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{incident.title}</h3>
                        {getStatusIcon(incident.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          incident.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          incident.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          incident.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {incident.status}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-violet-700">{patient?.name}</p>
                      <p className="text-gray-600">{incident.description}</p>
                      {incident.comments && (
                        <p className="text-sm text-gray-500 italic">Comments: {incident.comments}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(incident)}
                        className="p-2 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                      >
                        <Edit className="h-4 w-4 text-violet-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(incident)}
                        className="p-2 bg-white/50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Appointment:</span>
                      <p className="text-gray-600">{formatDate(incident.appointmentDate)}</p>
                    </div>
                    {incident.cost && (
                      <div>
                        <span className="font-medium text-gray-700">Cost:</span>
                        <p className="text-green-600 font-semibold flex items-center">
                          <DollarSign className="h-4 w-4" />
                          {incident.cost}
                        </p>
                      </div>
                    )}
                    {incident.nextAppointmentDate && (
                      <div>
                        <span className="font-medium text-gray-700">Next Appointment:</span>
                        <p className="text-blue-600">{formatDate(incident.nextAppointmentDate)}</p>
                      </div>
                    )}
                  </div>

                  {incident.treatment && (
                    <div className="bg-white/50 p-3 rounded-lg">
                      <span className="font-medium text-gray-700">Treatment:</span>
                      <p className="text-gray-600 mt-1">{incident.treatment}</p>
                    </div>
                  )}

                  {incident.files.length > 0 && (
                    <div className="bg-white/50 p-3 rounded-lg">
                      <span className="font-medium text-gray-700 mb-2 block">Attachments:</span>
                      <div className="flex flex-wrap gap-2">
                        {incident.files.map((file, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-white p-2 rounded-lg border">
                            {file.type.startsWith('image/') ? (
                              <Image className="h-4 w-4 text-violet-600" />
                            ) : (
                              <FileText className="h-4 w-4 text-violet-600" />
                            )}
                            <span className="text-sm text-gray-600">{file.name}</span>
                            <button
                              onClick={() => removeFile(incident, index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredIncidents.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No appointments found</p>
          <p className="text-gray-400">Try adjusting your search or schedule a new appointment</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
              <h2 className="text-2xl font-bold">
                {editingIncident ? 'Edit Appointment' : 'Schedule New Appointment'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient *
                  </label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>{patient.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Appointment
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.nextAppointmentDate}
                    onChange={(e) => setFormData({ ...formData, nextAppointmentDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment Details
                </label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Describe the treatment provided..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Files (Invoices, X-rays, etc.)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-violet-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload files or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF, DOC up to 10MB each</p>
                  </label>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    ))}
                  </div>
                )}
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
                  {editingIncident ? 'Update Appointment' : 'Schedule Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
