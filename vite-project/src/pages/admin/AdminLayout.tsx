import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import Account from "./Account";
import Buttons from "./ButtonsAdmin";
import HeaderApp from "@/components/HeaderApp";
import { useAccount } from "@/components/AccountContext";
import ButtonsGrid from "@/components/ButtonsGrid";
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { AdminContext } from "@/components/AdminContex";

function AdminLayout() {
  const { user } = useAccount();
  const { isAdmin } = useContext(AdminContext);
  console.log(user+" user");
  console.log(user?.guid +" guid");
  useEffect(() => {
    console.log('Switch changed, é admin agora? ', isAdmin ? 'Sim' : 'Não');
  }, [isAdmin]);
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
