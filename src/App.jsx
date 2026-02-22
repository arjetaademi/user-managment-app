import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UserDetailsPage from "./pages/UserDetailsPage";

function EmptyState() {
  return <div className="emptyState">Select a user to view details</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" replace />} />

      <Route path="/users" element={<Dashboard />}>
        <Route index element={<EmptyState />} />
        <Route path=":id" element={<UserDetailsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/users" replace />} />
    </Routes>
  );
}