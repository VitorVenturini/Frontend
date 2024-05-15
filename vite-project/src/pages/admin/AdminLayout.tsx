import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import Account from "./Account";
import Buttons from "./ButtonsAdmin";
import HeaderApp from "@/components/HeaderApp";
import { useAccount } from "@/components/AccountContext";
import ButtonsGrid from "@/components/ButtonsGrid";

function AdminLayout() {
  const { user } = useAccount();
  console.log(user+" user");
  console.log(user?.guid +" guid");
  return (
    <div >
      <div className="flex gap-6">
      {user && Object.entries(user).map(([key, value]) => (
          <p key={key}>{key}: {value}</p>
        ))}
        </div>
      
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
