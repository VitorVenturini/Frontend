import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import Account from "./Account";
import Buttons from "./ButtonsAdmin"
import HeaderApp from "@/components/HeaderApp";
import { useAccount } from "@/components/AccountContext";
import ButtonsGrid from "@/components/ButtonsGrid";
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { WebSocketProvider } from "@/components/WebSocketProvider";
import Actions from "./ActionsPage";

import Options from "./Options";

function AdminLayout() {
  const  account  = useAccount();
  console.log(account+" account");
  console.log(account?.guid +" guid");

  return (
    <WebSocketProvider token={account.accessToken}>
      <HeaderApp />
      {/* Your admin layout here */}
      <Routes>
        
        <Route path="account" element={<Account />} />
        <Route path="buttons" element={<Buttons/>} />
        <Route path="actions" element={<Actions/>} />
        <Route path="options" element={<Options/>} />
        <Route path="actions" element={<Actions/>} />
        {/* Add more admin routes as needed */}
      </Routes>
    </WebSocketProvider>
  );
}

export default ValidadeToken(AdminLayout);