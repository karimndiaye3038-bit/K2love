import {
  Bell,
  Moon,
  Sun,
  Search,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-pink-100 bg-white/90 px-8 backdrop-blur">

      <div className="flex h-full items-center justify-between">

        {/* Recherche */}
        <div className="relative w-80">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          />

        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">

          <button className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-pink-50 hover:text-pink-500">
            <Sun size={20} />
          </button>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-pink-50 hover:text-pink-500">

            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-500" />

          </button>

          <div className="h-8 w-px bg-gray-200" />

          {/* Profil */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() || "K"}
            </div>

            <div className="hidden lg:block">

              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "Karim"}
              </p>

              <p className="text-xs text-gray-400">
                Mon profil
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;