
# 🦷 DentalCare Pro - Dental Center Management Dashboard

A comprehensive dental center management system built with React, TypeScript, and Tailwind CSS. This application provides role-based access for dentists (Admin) and patients with complete appointment management, patient records, and file handling capabilities.

## ✨ Features

### 🔐 Authentication System
- **Role-based access control** (Admin/Patient)
- **Session persistence** via localStorage
- **Secure login** with hardcoded demo users
- **Automatic redirection** based on user role

### 👨‍⚕️ Admin Features (Dentist)
- **Comprehensive Dashboard** with KPIs and analytics
- **Patient Management**: Add, edit, delete patient records
- **Appointment Management**: Schedule, update, and track appointments
- **Interactive Calendar View** with monthly/weekly views
- **File Upload System** for treatment records, invoices, and X-rays
- **Treatment Tracking** with costs and status updates

### 👤 Patient Features
- **Personal Dashboard** with appointment overview
- **Appointment History** with detailed treatment records
- **File Access** to treatment documents and images
- **Health Information** tracking and display
- **Upcoming Appointments** with cost information

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with custom violet theme
- **State Management**: React Context API
- **Icons**: Lucide React
- **Data Persistence**: localStorage (no backend required)
- **File Handling**: Base64 encoding for file storage

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dentalcare-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 👥 Demo Users

The application comes with pre-configured demo users:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin (Dentist) | admin@entnt.in | admin123 | Full system access |
| Patient | john@entnt.in | patient123 | Personal data only |
| Patient | jane@entnt.in | patient123 | Personal data only |

## 🏗️ Architecture

### Project Structure
```
src/
├── components/           # React components
│   ├── Layout.tsx       # Main layout with navigation
│   ├── Login.tsx        # Authentication component
│   ├── Dashboard.tsx    # Admin dashboard
│   ├── PatientManagement.tsx
│   ├── AppointmentManagement.tsx
│   ├── CalendarView.tsx
│   ├── PatientDashboard.tsx
│   └── PatientAppointments.tsx
├── contexts/            # React Context providers
│   ├── AuthContext.tsx  # Authentication state
│   └── DataContext.tsx  # Application data management
└── pages/              # Route components
    ├── Index.tsx       # Landing/Login page
    └── NotFound.tsx    # 404 page
```

### State Management
- **AuthContext**: Manages user authentication and session
- **DataContext**: Handles CRUD operations for patients and appointments
- **localStorage**: Persists all data client-side

### Data Models

#### User
```typescript
interface User {
  id: string;
  role: 'Admin' | 'Patient';
  email: string;
  password: string;
  patientId?: string;
}
```

#### Patient
```typescript
interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  email: string;
  healthInfo: string;
  address: string;
}
```

#### Appointment/Incident
```typescript
interface Incident {
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
```

## 🎨 Design System

### Color Palette
- **Primary**: Violet gradients (#7C3AED to #A855F7)
- **Secondary**: Light violet backgrounds and accents
- **Status Colors**:
  - Completed: Green (#10B981)
  - Scheduled: Blue (#3B82F6)
  - Cancelled: Red (#EF4444)
  - Pending: Orange (#F59E0B)

### Responsive Design
- **Mobile-first approach** with breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Flexible grid layouts** adapt to all screen sizes
- **Touch-friendly interface** for mobile devices

## 📱 Features Deep Dive

### File Management
- **Multi-file upload** support (images, PDFs, documents)
- **Base64 encoding** for localStorage compatibility
- **File type validation** and size limits
- **Download functionality** for patients
- **Preview capabilities** for images

### Calendar System
- **Monthly view** with appointment indicators
- **Date selection** with detailed appointment list
- **Status color coding** for quick visual reference
- **Navigation controls** for month switching

### Dashboard Analytics
- **KPI cards** with gradient designs
- **Patient statistics** and treatment summaries
- **Revenue tracking** and cost analysis
- **Upcoming appointments** preview

## 🔧 Technical Decisions

### Why localStorage?
- **No backend required** as per requirements
- **Immediate data persistence** without server setup
- **Client-side data management** for demo purposes
- **Easy deployment** without database dependencies

### Context API vs Redux
- **Simpler state management** for this scope
- **Less boilerplate code** and setup
- **Perfect for moderate complexity** applications
- **Built into React** without additional dependencies

### File Storage Strategy
- **Base64 encoding** for binary file storage
- **localStorage compatibility** maintained
- **Client-side processing** without server uploads
- **Immediate file availability** after upload

## 🚀 Deployment

The application can be deployed to any static hosting service:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service
   - Netlify
   - Vercel
   - GitHub Pages
   - Any static host

## 🔮 Future Enhancements

- **Backend Integration**: Replace localStorage with real database
- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Analytics**: More detailed reporting and charts
- **Email Notifications**: Appointment reminders and confirmations
- **Print Functionality**: Printable reports and invoices
- **Multi-clinic Support**: Support for multiple dental clinics

## 🐛 Known Issues

- **localStorage Limitations**: 5-10MB storage limit for files
- **No Real-time Sync**: Changes not reflected across browser tabs
- **Basic File Validation**: Limited file type and size checking
- **No Data Backup**: Data lost if localStorage is cleared

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer Notes

### Code Quality
- **TypeScript** for type safety
- **ESLint** configuration for code standards
- **Component-based architecture** for maintainability
- **Custom hooks** for reusable logic

### Performance Considerations
- **Lazy loading** for large file uploads
- **Optimized re-renders** with proper React patterns
- **Efficient data filtering** and sorting
- **Responsive images** and assets

### Security Notes
- **No real authentication** - demo purposes only
- **Client-side data storage** - not production-ready
- **No data encryption** - localStorage is plain text
- **No input sanitization** - basic validation only

---

**Built with ❤️ for ENTNT Technical Assessment**
