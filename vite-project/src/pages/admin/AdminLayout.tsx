import { Routes, Route } from "react-router-dom";
import AdminHome from "./Home";
import ValidadeToken from "@/components/ValidateToken";
import Conta from "./Conta";
import TableUser from "@/components/TableUser";
import HeaderApp from "@/components/HeaderApp";
import { Toast } from "@radix-ui/react-toast";

function AdminLayout() {
  return (
    <div>
      <div>Admin Layout</div>
      <HeaderApp />
      {/* Your admin layout here */}
      <Routes>
        
        <Route path="conta" element={<Conta />} />
        <Route path="tableuser" element={<TableUser />} />
        {/* Add more admin routes as needed */}
      </Routes>
      <Toast/>
    </div>
  );
}

export default ValidadeToken(AdminLayout);
