import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#faf7fb]">

      {/* Sidebar */}
      <Sidebar />

      {/* Navbar */}
      <Navbar />

      {/* Contenu principal */}
      <main className="ml-64 pt-20">
        <div className="p-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;