import { Routes, Route, Navigate } from 'react-router-dom';
import ContactList from './pages/ContactList';
import './App.css';

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/"         element={<ContactList />} />
        {/* Catch-all redirect */}
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
