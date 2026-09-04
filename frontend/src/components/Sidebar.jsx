import {
  Home,
  MessageCircle,
  Image,
  Heart,
  CalendarDays,
  Gamepad2,
  Music,
  BarChart3,
  Settings,
  LogOut,
  HeartHandshake,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Accueil",
      icon: Home,
      path: "/dashboard",
    },
    {
      name: "Messages",
      icon: MessageCircle,
      path: "/messages",
    },
    {
      name: "Galerie",
      icon: Image,
      path: "/gallery",
    },
    {
      name: "Souvenirs",
      icon: Heart,
      path: "/memories",
    },
    {
      name: "Calendrier",
      icon: CalendarDays,
      path: "/calendar",
    },
    {
      name: "Jeux",
      icon: Gamepad2,
      path: "/games",
    },
    {
      name: "Playlist",
      icon: Music,
      path: "/playlist",
    },
    {
      name: "Statistiques",
      icon: BarChart3,
      path: "/statistics",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-pink-100 bg-white">

      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-pink-100 px-6">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-xl text-white shadow-lg">
          <HeartHandshake size={23} />
        </div>

        <div>
          <h1 className="text-lg font-bold text-gray-800">
            K2Love
          </h1>

          <p className="text-xs text-pink-500">
            Together forever ❤️
          </p>
        </div>

      </div>

      {/* Navigation */}
      <nav className="px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Menu
        </p>

        <div className="space-y-1">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                  }`
                }
              >
                <Icon size={19} />

                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </div>

      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 w-full border-t border-pink-100 p-4">

        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-pink-50"
        >
          <Settings size={19} />
          Paramètres
        </NavLink>

        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 transition hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={19} />
          Déconnexion
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;