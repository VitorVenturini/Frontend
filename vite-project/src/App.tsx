import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import AdminLayout from './pages/admin/AdminLayout';
import UserLayout from './pages/user/UserLayout';
import NoPage from './pages/NoPage';
import Login from './pages/Login';
import { useEffect, useState } from 'react';


function App() {
  const [userType, setUserType] = useState(localStorage.getItem("userType"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserType(localStorage.getItem("userType"));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  let Layout;
  if (userType === "admin") {
    Layout = AdminLayout;
  } else if (userType === "user") {
    Layout = UserLayout;
  } else {
    Layout = Login;
  }
  console.log(userType)

  return (

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={userType === "admin" ? <AdminLayout /> : null} />
        <Route path="/user/*" element={userType === "user" ? <UserLayout /> : null} />
        <Route path="*" element={<NoPage/>} />
      </Routes>
  );
}

export default App;