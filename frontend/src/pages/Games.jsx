import React, { useState } from "react";

import LoveQuiz from "../components/games/LoveQuiz";
import MemoryGame from "../components/games/MemoryGame";
import QuizGame from "../components/games/QuizGame";
import Roulette from "../components/games/Roulette";
import TruthOrDare from "../components/games/TruthOrDare";
import WhoOfUs from "../components/games/WhoOfUs";

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

const defaultStats = {
  played: 0,
  bestScore: 0,
  challenges: 0,
  totalScore: 0,
};

export default function Games() {
  const [activeGame, setActiveGame] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem("k2love_stats");

      if (!saved) return defaultStats;

      return {
        ...defaultStats,
        ...JSON.parse(saved),
      };
    } catch {
      return defaultStats;
    }
  });

  const openGame = (game) => {
    setSelectedGame(game);
  };

  const startGame = () => {
    if (!selectedGame) return;

    setActiveGame(selectedGame.id);
    setSelectedGame(null);
  };

  const backToGames = () => {
    setActiveGame(null);
  };

  const handleGameFinish = (result = {}) => {
    const earnedScore = Number(result.score) || 0;
    const challenges = Number(result.challenges) || 0;

    const newStats = {
      ...stats,
      played: stats.played + 1,
      totalScore: stats.totalScore + earnedScore,
      bestScore: Math.max(stats.bestScore, earnedScore),
      challenges: stats.challenges + challenges,
    };

    setStats(newStats);

    localStorage.setItem(
      "k2love_stats",
      JSON.stringify(newStats)
    );

    localStorage.setItem(
      "k2love_score",
      String(newStats.totalScore)
    );
  };

  /* =====================================================
     JEUX ACTIFS
  ===================================================== */

  if (activeGame === 1) {
    return (
      <GameContainer onBack={backToGames}>
        <LoveQuiz onFinish={handleGameFinish} />
      </GameContainer>
    );
  }

  if (activeGame === 2) {
    return (
      <GameContainer onBack={backToGames}>
        <WhoOfUs onFinish={handleGameFinish} />
      </GameContainer>
    );
  }

  if (activeGame === 3) {
    return (
      <GameContainer onBack={backToGames}>
        <TruthOrDare onFinish={handleGameFinish} />
      </GameContainer>
    );
  }

  if (activeGame === 4) {
    return (
      <GameContainer onBack={backToGames}>
        <QuizGame onFinish={handleGameFinish} />
      </GameContainer>
    );
  }

  if (activeGame === 5) {
    return (
      <GameContainer onBack={backToGames}>
        <Roulette onFinish={handleGameFinish} />
      </GameContainer>
    );
  }

  if (activeGame === 6) {
    return (
      <GameContainer onBack={backToGames}>
        <Ranking stats={stats} onBack={backToGames} />
      </GameContainer>
    );
  }

  /* =====================================================
     PAGE PRINCIPALE
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-8">

      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Nos jeux 🎮
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Jouez ensemble et créez de nouveaux souvenirs ❤️
          </p>
        </div>

        <div className="hidden items-center gap-3 rounded-2xl border border-pink-100 bg-white px-5 py-3 shadow-sm md:flex">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-xl">
            🏆
          </div>

          <div>
            <p className="text-lg font-bold text-gray-900">
              {stats.totalScore}
            </p>

            <p className="text-xs text-gray-400">
              points
            </p>
          </div>

        </div>

      </div>

      {/* BANNER */}

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

      {/* JEUX */}

      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-lg font-bold text-gray-900">
          Choisissez votre jeu
        </h2>

        <span className="text-xs text-gray-400">
          {games.length} jeux disponibles
        </span>

      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

        {games.map((game) => (
          <div
            key={game.id}
            className="group rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="flex gap-4">

              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${game.color}`}
              >
                {game.icon}
              </div>

              <div className="flex-1">

                <h3 className="font-bold text-gray-900">
                  {game.title}
                </h3>

                <p className="mt-2 min-h-[40px] text-xs leading-5 text-gray-400">
                  {game.description}
                </p>

                <button
                  onClick={() => openGame(game)}
                  className="mt-4 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                >
                  <span>Jouer maintenant</span>
                  <span>→</span>
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* STATISTIQUES */}

      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">

        <StatCard
          icon="🎮"
          value={stats.played}
          label="Parties jouées"
          color="bg-pink-100"
        />

        <StatCard
          icon="🏆"
          value={stats.bestScore}
          label="Meilleur score"
          color="bg-purple-100"
        />

        <StatCard
          icon="🔥"
          value={stats.challenges}
          label="Défis réussis"
          color="bg-orange-100"
        />

      </div>

      {/* MODAL */}

      {selectedGame && (
        <div
          onClick={() => setSelectedGame(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm"
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
          >

            <button
              onClick={() => setSelectedGame(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500"
            >
              ×
            </button>

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
              💕 Prêts pour un nouveau moment à deux ?
            </div>

            <button
              onClick={startGame}
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white shadow-lg"
            >
              Commencer ❤️
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

/* =====================================================
   CONTENEUR
===================================================== */

function GameContainer({ children, onBack }) {
  return (
    <div className="relative min-h-screen bg-[#fcf9fc]">

      <button
        onClick={onBack}
        className="fixed left-5 top-5 z-[100] rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-lg hover:bg-gray-100"
      >
        ← Retour aux jeux
      </button>

      {children}

    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon,
  value,
  label,
  color,
}) {
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

/* =====================================================
   CLASSEMENT
===================================================== */

function Ranking({ stats, onBack }) {
  return (
    <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-10">

      <div className="mx-auto max-w-2xl pt-10">

        <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-xl">

          <div className="text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 text-5xl">
              🏆
            </div>

            <h1 className="mt-5 text-3xl font-bold text-gray-900">
              Notre classement
            </h1>

            <p className="mt-2 text-gray-400">
              Vos statistiques de couple
            </p>

          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl bg-pink-50 p-6 text-center">
              <p className="text-sm text-gray-500">
                Score total
              </p>

              <p className="mt-2 text-4xl font-bold text-pink-600">
                {stats.totalScore}
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-6 text-center">
              <p className="text-sm text-gray-500">
                Meilleur score
              </p>

              <p className="mt-2 text-4xl font-bold text-purple-600">
                {stats.bestScore}
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-6 text-center">
              <p className="text-sm text-gray-500">
                Parties jouées
              </p>

              <p className="mt-2 text-4xl font-bold text-blue-600">
                {stats.played}
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 p-6 text-center">
              <p className="text-sm text-gray-500">
                Défis réussis
              </p>

              <p className="mt-2 text-4xl font-bold text-orange-600">
                {stats.challenges}
              </p>
            </div>

          </div>

          <button
            onClick={onBack}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white"
          >
            Retour aux jeux
          </button>

        </div>

      </div>

    </div>
  );
}
