import { Routes, Route } from 'react-router-dom';
import ValidadeToken from '@/components/ValidateToken';
import { ThemeProvider } from "@/components/theme-provider";


function UserLayout() {
  return (
    <div>
      layout do usuário
      <a></a>

      
      {/* Your admin layout here */}
    </div>
  );
}

export default ValidadeToken(UserLayout);