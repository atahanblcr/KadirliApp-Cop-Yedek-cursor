import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  
  // Token yoksa Giriş sayfasına yönlendir
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token varsa sayfayı göster
  return <Outlet />;
};

export default ProtectedRoute;