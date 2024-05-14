import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import Account from "./Account";
import Buttons from "./Buttons";
import HeaderApp from "@/components/HeaderApp";

function AdminLayout() {
  return (
    <div>
      <div>Admin Layout</div>
      <HeaderApp />
      {/* Your admin layout here */}
      <Routes>
        
        <Route path="account" element={<Account />} />
        <Route path="buttons" element={<Buttons/>} />
        {/* Add more admin routes as needed */}
      </Routes>

    </div>
  );
}

export default ValidadeToken(AdminLayout);
