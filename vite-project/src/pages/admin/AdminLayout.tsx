import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import Account from "./Account";
import Buttons from "./ButtonsAdmin";
import HeaderApp from "@/components/HeaderApp";
import { useAccount } from "@/components/AccountContext";
import ButtonsGrid from "@/components/ButtonsGrid";
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { WebSocketProvider } from "@/components/WebSocketProvider";

import Options from "./Options";

function AdminLayout() {
  const  account  = useAccount();
  console.log(account+" account");
  console.log(account?.guid +" guid");

  return (
    <WebSocketProvider token={account.accessToken}>
    <div className="p-3 bg-card h-[100vh]">
      <div className=" p-3 bg-background">
      
      <HeaderApp />
      {/* Your admin layout here */}
      <Routes>
        
        <Route path="account" element={<Account />} />
        <Route path="buttons" element={<Buttons/>} />
        <Route path="options" element={<Options/>} />
        {/* Add more admin routes as needed */}
      </Routes>

    </div>
    </div>
    </WebSocketProvider>
  );
}

export default ValidadeToken(AdminLayout);