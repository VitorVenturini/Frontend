// useHandleLogin.ts
import { useState } from 'react';

const UseLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Implemente a lógica de login aqui...
    setIsLoggedIn(true);
  };

  return { isLoggedIn, handleLogin };
};

export default UseLogin;