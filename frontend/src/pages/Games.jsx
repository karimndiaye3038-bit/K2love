import React, { useState } from "react";

const games = [
  {
    id: 1,
    icon: "💕",
    title: "Quiz amoureux",
    description: "Testez vos connaissances sur votre partenaire.",
    color: "bg-pink-100",
  },
  {
    id: 2,
    icon: "🧠",
    title: "Qui me connaît le mieux ?",
    description: "Découvrez lequel de vous deux connaît le mieux l'autre.",
    color: "bg-purple-100",
  },
  {
    id: 3,
    icon: "🎲",
    title: "Action ou vérité",
    description: "Des questions et des défis amusants à deux.",
    color: "bg-orange-100",
  },
  {
    id: 4,
    icon: "💌",
    title: "Question du jour",
    description: "Une nouvelle question pour partager vos pensées.",
    color: "bg-blue-100",
  },
  {
    id: 5,
    icon: "🔥",
    title: "Défis de couple",
    description: "Relevez des petits défis ensemble.",
    color: "bg-red-100",
  },
  {
    id: 6,
    icon: "🏆",
    title: "Notre classement",
    description: "Suivez vos scores et vos meilleures performances.",
    color: "bg-yellow-100",
  },
];

export default function Games() {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-8">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Nos jeux 🎮
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Jouez ensemble, amusez-vous et créez de nouveaux souvenirs ❤️
          </p>
        </div>

        {/* Score */}
        <div className="hidden items-center gap-3 rounded-2xl border border-pink-100 bg-white px-5 py-3 shadow-sm md:flex">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-xl">
            🏆
          </div>

          <div>
            <p className="text-lg font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-400">points</p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white shadow-lg shadow-purple-200">

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl">
            💗
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Prêts à jouer ?
            </h2>

            <p className="mt-1 text-sm text-white/90">
              Choisissez un jeu et profitez d'un moment spécial à deux.
            </p>
          </div>
        </div>

        <div className="absolute -right-2 -top-5 text-7xl opacity-20">
          💕
        </div>
      </div>

      {/* Section title */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          Choisissez votre jeu
        </h2>

        <span className="text-xs text-gray-400">
          {games.length} jeux disponibles
        </span>
      </div>

      {/* Games */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

        {games.map((game) => (
          <div
            key={game.id}
            className="group rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100"
          >

            <div className="flex gap-4">

              {/* Icon */}
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${game.color}`}
              >
                {game.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">
                  {game.title}
                </h3>

                <p className="mt-2 min-h-[40px] text-xs leading-5 text-gray-400">
                  {game.description}
                </p>

                <button
                  onClick={() => setSelectedGame(game)}
                  className="mt-4 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                >
                  <span>Jouer maintenant</span>
                  <span className="text-base">→</span>
                </button>
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* Statistics */}
      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">

        <StatCard
          icon="🎮"
          value="0"
          label="Parties jouées"
          color="bg-pink-100"
        />

        <StatCard
          icon="🏆"
          value="0"
          label="Meilleur score"
          color="bg-purple-100"
        />

        <StatCard
          icon="❤️"
          value="0"
          label="Défis réussis"
          color="bg-orange-100"
        />

      </div>

      {/* Modal */}
      {selectedGame && (
        <div
          onClick={() => setSelectedGame(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm"
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
          >

            {/* Close */}
            <button
              onClick={() => setSelectedGame(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500 hover:bg-gray-200"
            >
              ×
            </button>

            {/* Icon */}
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 text-4xl">
              {selectedGame.icon}
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              {selectedGame.title}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              {selectedGame.description}
            </p>

            <div className="my-6 rounded-xl bg-pink-50 p-4 text-sm text-pink-600">
              🎉 Le jeu va bientôt commencer !
            </div>

            <button
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-md shadow-purple-200 hover:opacity-90"
            >
              Commencer le jeu ❤️
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

/* Stat Card */

function StatCard({ icon, value, label, color }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${color}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-xl font-bold text-gray-900">
          {value}
        </p>

        <p className="text-xs text-gray-400">
          {label}
        </p>
      </div>

    </div>
  );
}
