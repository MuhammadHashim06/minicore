import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (user === undefined) return null;  // Splash/loading state
  if (user === null || user.role !== "admin") return <Navigate to="/login" replace />;

  return children;
}
