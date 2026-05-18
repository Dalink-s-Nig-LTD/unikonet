import { Outlet } from "react-router-dom";
import AppShell from "../components/AppShell";

const MainLayout = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export default MainLayout;
