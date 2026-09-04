import { Music } from "lucide-react";

const Playlist = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Notre playlist 🎵
        </h1>

        <p className="mt-2 text-gray-500">
          Les chansons qui racontent votre histoire.
        </p>
      </div>

      <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-pink-100 bg-white shadow-sm">

        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-100 text-purple-600">
            <Music size={38} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-800">
            Notre musique ❤️
          </h2>

          <p className="mt-2 text-gray-500">
            Ajoutez vos chansons préférées.
          </p>

          <button className="mt-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white">
            Ajouter une chanson
          </button>

        </div>

      </div>

    </div>
  );
};

export default Playlist;