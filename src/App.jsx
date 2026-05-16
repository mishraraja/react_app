import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { TimetableProvider } from './data/TimetableContext.jsx';
import AutoGenerate from './pages/AutoGenerate.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DownloadTimetable from './pages/DownloadTimetable.jsx';
import ManualGeneration from './pages/ManualGeneration.jsx';
import SubjectManagement from './pages/SubjectManagement.jsx';
import TeacherAllotment from './pages/TeacherAllotment.jsx';
import TeacherManagement from './pages/TeacherManagement.jsx';

export default function App() {
  return (
    <TimetableProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subjects" element={<SubjectManagement />} />
          <Route path="/teachers" element={<TeacherManagement />} />
          <Route path="/allotment" element={<TeacherAllotment />} />
          <Route path="/manual" element={<ManualGeneration />} />
          <Route path="/automatic" element={<AutoGenerate />} />
          <Route path="/download" element={<DownloadTimetable />} />
        </Routes>
      </Layout>
    </TimetableProvider>
  );
}
