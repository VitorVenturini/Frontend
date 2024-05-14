import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import Account from "./Account";
import Buttons from "./Buttons";
import HeaderApp from "@/components/HeaderApp";
import { useAccount } from "@/components/AccountContext";

function AdminLayout() {
  const { user } = useAccount();
  console.log(user+" user");
  console.log(user?.guid +" guid");
  return (
    <div>
      <div>Admin Layout</div>
      <HeaderApp />
      {/* Your admin layout here */}
      <div>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>GUID: {user?.guid}</p>
      </div>
      <Routes>
        
        <Route path="account" element={<Account />} />
        <Route path="buttons" element={<Buttons/>} />
        {/* Add more admin routes as needed */}
      </Routes>

    </div>
  );
}

export default ValidadeToken(AdminLayout);
