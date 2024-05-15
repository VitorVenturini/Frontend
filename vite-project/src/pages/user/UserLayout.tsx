import { Routes, Route } from "react-router-dom";
import ValidadeToken from "@/components/ValidateToken";
import { ThemeProvider } from "@/components/theme-provider";
import { useAccount } from "@/components/AccountContext";
import { Button } from "@/components/ui/button";

function UserLayout() {
  const { user } = useAccount();
  const isAdmin = user?.type === "admin";
  console.log(user + " user");
  console.log(user?.guid + " guid");
  // const handleAdminRedirect = () => {
  //   history.push('/admin');
  // };
  return (
    <div>
      <div className="flex gap-6">
        {user &&
          Object.entries(user).map(([key, value]) => (
            <p key={key}>
              {key}: {value}
            </p>
          ))}
      </div>
      {isAdmin && (
          <a href="/admin/buttons">
          <Button>Admin</Button>
        </a>
      )}
    </div>
  );
}

export default ValidadeToken(UserLayout);
