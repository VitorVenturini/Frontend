// useUpdatePassword.ts
import { useState } from 'react';

const useUpdatePassword = () => {
  const [password, setPassword] = useState('');

  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return { password, updatePassword };
};

export default useUpdatePassword;