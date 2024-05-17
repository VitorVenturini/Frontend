import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import Account from "./Account";
import Buttons from "./ButtonsAdmin";
import Actions from "./Actions";
import HeaderApp from "@/components/HeaderApp";
import { useAccount } from "@/components/AccountContext";
import ButtonsGrid from "@/components/ButtonsGrid";
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';

import Options from "./Options";

function AdminLayout() {
  const { user } = useAccount();
  console.log(user+" user");
  console.log(user?.guid +" guid");

  return (
    <div className="p-3 bg-card h-[100vh]">
      <div className=" p-3 bg-background">
      
      <HeaderApp />
      {/* Your admin layout here */}
      <Routes>
        
        <Route path="account" element={<Account />} />
        <Route path="buttons" element={<Buttons/>} />
        <Route path="actions" element={<Actions/>} />
        <Route path="options" element={<Options/>} />
        {/* Add more admin routes as needed */}
      </Routes>

    </div>
    </div>
  );
}

export default ValidadeToken(AdminLayout);
