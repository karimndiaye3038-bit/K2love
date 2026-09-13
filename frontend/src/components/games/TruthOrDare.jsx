import React, { useState } from "react";

const truths = [
  "Quel est ton plus beau souvenir avec ton partenaire ? ❤️",
  "Quelle est la chose que tu préfères chez ton partenaire ? 🥰",
  "Quel a été ton premier sentiment lorsque tu l'as rencontré(e) ? 💕",
  "Quel voyage aimerais-tu faire avec ton partenaire ? ✈️",
  "Quelle habitude de ton partenaire te fait rire ? 😂",
  "Quelle est ta plus grande preuve d'amour ? ❤️",
];

const dares = [
  "Fais un compliment sincère à ton partenaire. 💕",
  "Fais un câlin de 20 secondes. 🤗",
  "Donne un bisou à ton partenaire. 😘",
  "Fais rire ton partenaire en moins de 30 secondes. 😂",
  "Danse pendant 20 secondes. 💃",
  "Dis trois choses que tu aimes chez ton partenaire. 🥰",
];

export default function TruthOrDare({ onFinish }) {
  const [type, setType] = useState(null);
  const [content, setContent] = useState("");
  const [completed, setCompleted] = useState(0);

  const play = (selectedType) => {
    const list =
      selectedType === "truth"
        ? truths
        : dares;

    const random =
      list[Math.floor(Math.random() * list.length)];

    setType(selectedType);
    setContent(random);
  };

  const complete = () => {
    const newCompleted = completed + 1;

    setCompleted(newCompleted);

    if (onFinish) {
      onFinish({
        score: 5,
        challenges: type === "dare" ? 1 : 0,
      });
    }

    setType(null);
    setContent("");
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-3xl bg-white p-8 text-center shadow-xl">

          <div className="text-6xl">🎲</div>

          <h1 className="mt-5 text-3xl font-bold">
            Action ou Vérité
          </h1>

          <p className="mt-3 text-gray-500">
            Osez jouer ensemble 😏
          </p>

          {!content && (
            <div className="mt-8 grid gap-4 md:grid-cols-2">

              <button
                onClick={() => play("truth")}
                className="rounded-2xl bg-purple-100 p-8 text-xl font-bold text-purple-700 transition hover:scale-105"
              >
                💬 Vérité
              </button>

              <button
                onClick={() => play("dare")}
                className="rounded-2xl bg-orange-100 p-8 text-xl font-bold text-orange-700 transition hover:scale-105"
              >
                🔥 Action
              </button>

            </div>
          )}

          {content && (
            <div className="mt-8">

              <div className="rounded-2xl bg-pink-50 p-8">

                <p className="text-sm font-semibold text-pink-500">
                  {type === "truth"
                    ? "💬 VÉRITÉ"
                    : "🔥 ACTION"}
                </p>

                <p className="mt-4 text-xl font-bold text-gray-800">
                  {content}
                </p>

              </div>

              <button
                onClick={complete}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white"
              >
                C'est fait ! ❤️
              </button>

            </div>
          )}

          <p className="mt-8 text-sm text-gray-400">
            Défis réalisés : {completed}
          </p>

        </div>

      </div>
    </div>
  );
}
