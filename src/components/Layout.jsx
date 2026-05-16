import { NavLink } from 'react-router-dom';
import AlertMessage from './AlertMessage.jsx';

const navItems = [
  ['Dashboard', '/dashboard'],
  ['Subjects', '/subjects'],
  ['Teachers', '/teachers'],
  ['Teacher Allotment', '/allotment'],
  ['Manual Timetable Generation', '/manual'],
  ['Automatic Timetable Generation', '/automatic'],
  ['Download Timetable', '/download'],
];

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">School Timetable</div>
        <nav className="nav flex-column gap-1">
          {navItems.map(([label, path]) => (
            <NavLink key={path} to={path} className="nav-link">
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <AlertMessage />
        {children}
      </main>
    </div>
  );
}
