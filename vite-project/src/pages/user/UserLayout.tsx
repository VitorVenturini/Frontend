import { Routes, Route } from 'react-router-dom';
import ValidadeToken from '@/components/ValidateToken';
import { ThemeProvider } from "@/components/theme-provider";


function UserLayout() {
  return (
    <div>
      layout do usuário
      <ThemeProvider>
      <a></a>
      </ThemeProvider>
      
      {/* Your admin layout here */}
    </div>
  );
}

export default ValidadeToken(UserLayout);