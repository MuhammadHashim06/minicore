// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Subjects from "./pages/Subjects";
// import Chapters from "./pages/Chapters";
// import AdminDashboard from "./pages/AdminDashboard";
// import CreateSubject from "./pages/CreateSubject";  // Add all necessary imports
// import CreateChapter from "./pages/CreateChapter";
// import ChapterLearn from "./pages/ChapterLearn";
// import Quiz from "./pages/Quiz";
// import "./styles.css";
// import Profile from "./pages/Profile";

// function HomeGate(){
//   const { user } = useAuth();
//   if (user===undefined) return null;
//   return <Navigate to={user?"/":"/login"} replace/>;
// }

// export default function App(){
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Navbar/>
//         <Routes>
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/admin/subjects/create" element={<CreateSubject />} />
//         <Route path="/admin/chapters/create" element={<CreateChapter />} />
//           <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
//           <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />

//           <Route path="/subjects" element={<ProtectedRoute><Subjects/></ProtectedRoute>} />
//           <Route path="/subjects/:slug" element={<ProtectedRoute><Chapters/></ProtectedRoute>} />
//           <Route path="/chapters/:slug" element={<ProtectedRoute><ChapterLearn/></ProtectedRoute>} />
//           <Route path="/chapters/:slug/quiz" element={<ProtectedRoute><Quiz/></ProtectedRoute>} />
//           <Route path="/login" element={<Login/>} />
//           <Route path="/register" element={<Register/>} />
//           <Route path="*" element={<HomeGate/>} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }








import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";  // New route for Admin

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Chapters from "./pages/Chapters";
import AdminDashboard from "./pages/AdminDashboard";
import CreateSubject from "./pages/CreateSubject";
import CreateChapter from "./pages/CreateChapter";
import ChapterLearn from "./pages/ChapterLearn";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import "./styles.css";
import CreatePage from "./pages/CreatePage";
import CreateQuestion from "./pages/CreateQuestion";

// HomeGate redirects based on user auth state
function HomeGate() {
  const { user } = useAuth();
  if (user === undefined) return null; // splash/loading state
  return <Navigate to={user ? "/" : "/login"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Admin routes */}
          <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/admin/subjects/create" element={<AdminProtectedRoute><CreateSubject /></AdminProtectedRoute>} />
          <Route path="/admin/chapters/create" element={<AdminProtectedRoute><CreateChapter /></AdminProtectedRoute>} />
          <Route path="/admin/pages/create" element={<AdminProtectedRoute><CreatePage /></AdminProtectedRoute>} />
          <Route path="/admin/questions/create" element={<AdminProtectedRoute><CreateQuestion /></AdminProtectedRoute>} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
          <Route path="/subjects/:slug" element={<ProtectedRoute><Chapters /></ProtectedRoute>} />
          <Route path="/chapters/:slug" element={<ProtectedRoute><ChapterLearn /></ProtectedRoute>} />
          <Route path="/chapters/:slug/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Redirect unknown routes */}
          <Route path="*" element={<HomeGate />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
