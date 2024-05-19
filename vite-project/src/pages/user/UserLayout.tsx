import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import { ThemeProvider } from "@/components/theme-provider";
import { useAccount } from "@/components/AccountContext";
import { Button } from "@/components/ui/button";
import Logout from "@/components/Logout";

function UserLayout() {
  
  return (
    <div>
      <h1>Usuário layout</h1>
      <Logout/>
    </div>
  );
}

export default UserLayout;
