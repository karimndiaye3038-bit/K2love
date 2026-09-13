import React from "react";

export default function Roulette({ onFinish }) {
  return (
    <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-10">

      <div className="mx-auto max-w-xl">

        <div className="rounded-3xl border border-pink-100 bg-white p-8 text-center shadow-xl">

          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-5xl">
            🎲
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Roulette des défis
          </h1>

          <p className="mt-3 text-gray-500">
            Tournez la roue et découvrez un défi romantique.
          </p>

          <button
            className="mt-8 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-3 font-semibold text-white"
          >
            Tourner la roue 🎲
          </button>

        </div>

      </div>

    </div>
  );
}
