import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user === undefined) return null; // splash/loading
  if (user === null) return <Navigate to="/login" replace />;
  return children;
}
