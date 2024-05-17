import React from 'react';

export const AdminContext = React.createContext({
  isAdmin: false,
  setIsAdmin: (isAdmin: boolean) => {},
});