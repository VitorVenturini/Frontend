// IsAdminContext.tsx
import React from 'react';

export const IsAdminContext = React.createContext({
  isAdmin: false,
  setIsAdmin: (isAdmin: boolean) => {},
});