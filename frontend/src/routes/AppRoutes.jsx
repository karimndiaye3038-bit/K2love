import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

import Messages from "../pages/Messages";
import Gallery from "../pages/Gallery";
import Memories from "../pages/Memories";
import Calendar from "../pages/Calendar";
import Games from "../pages/Games";
import Playlist from "../pages/Playlist";
import Statistics from "../pages/Statistics";
import Settings from "../pages/Settings";

import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Invitations from "../pages/Invitations";
const AppRoutes = () => {
  return (
    <Routes>

      {/* =========================
          PAGES PUBLIQUES
      ========================= */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />


      {/* =========================
          PAGES PRIVÉES
      ========================= */}

      <Route element={<ProtectedRoute />}>

        {/* DashboardLayout contient Sidebar + Navbar */}
        <Route element={<DashboardLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/messages"
            element={<Messages />}
          />

          <Route
            path="/gallery"
            element={<Gallery />}
          />

          <Route
            path="/memories"
            element={<Memories />}
          />

          <Route
            path="/calendar"
            element={<Calendar />}
          />

          <Route
            path="/games"
            element={<Games />}
          />

          <Route
            path="/playlist"
            element={<Playlist />}
          />
<Route
  path="/invitations"
  element={<Invitations />}
/>
          <Route
            path="/statistics"
            element={<Statistics />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

      </Route>

    </Routes>
  );
};

export default AppRoutes;