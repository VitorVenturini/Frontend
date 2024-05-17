import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import Account from "./Account";
import Buttons from "./ButtonsAdmin";
import HeaderApp from "@/components/HeaderApp";
import { useAccount } from "@/components/AccountContext";
import ButtonsGrid from "@/components/ButtonsGrid";
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';

function AdminLayout() {
  const { user } = useAccount();
  console.log(user+" user");
  console.log(user?.guid +" guid");
  console.log(user?.isAdmin+" user?.isAdmin AdminLayout");
  console.log(user?.isLogged +" user?.isLogged AdminLayout")

  return (
    <div className="p-3 bg-card">
      <div className=" p-3 bg-background">
      
      <HeaderApp />
      {/* Your admin layout here */}
      <Routes>
        
        <Route path="account" element={<Account />} />
        <Route path="buttons" element={<Buttons/>} />
        {/* Add more admin routes as needed */}
      </Routes>

    </div>
    </div>
  );
}

export default ValidadeToken(AdminLayout);
