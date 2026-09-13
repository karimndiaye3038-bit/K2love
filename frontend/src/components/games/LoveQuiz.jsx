import React, { useState } from "react";

const questions = [
  {
    question: "Quelle est la date de votre rencontre ? 💕",
    options: ["Janvier", "Février", "Mars", "Avril"],
    answer: 0,
  },
  {
    question: "Qui est généralement le plus romantique ? 🌹",
    options: ["Moi", "Mon partenaire", "Les deux", "Aucun 😂"],
    answer: 2,
  },
  {
    question: "Quelle activité préférez-vous faire ensemble ? 🥰",
    options: ["Sortir", "Regarder un film", "Voyager", "Rester à la maison"],
    answer: 1,
  },
  {
    question: "Qui dit le plus souvent « je t'aime » ? ❤️",
    options: ["Moi", "Mon partenaire", "Les deux", "Ça dépend"],
    answer: 2,
  },
  {
    question: "Quel est votre meilleur souvenir ensemble ? ✨",
    options: ["Premier rendez-vous", "Voyage", "Fête", "Autre"],
    answer: 0,
  },
];

export default function LoveQuiz({ onFinish }) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const start = () => {
    setStarted(true);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const answer = () => {
    if (selected === null) return;

    const correct = selected === questions[current].answer;
    const newScore = score + (correct ? 10 : 0);

    setScore(newScore);

    if (current === questions.length - 1) {
      setFinished(true);

      if (onFinish) {
        onFinish({
          score: newScore,
          challenges: correct ? 1 : 0,
        });
      }

      return;
    }

    setCurrent(current + 1);
    setSelected(null);
  };

  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">

          <div className="text-6xl">💕</div>

          <h1 className="mt-5 text-3xl font-bold">
            Quiz amoureux
          </h1>

          <p className="mt-3 text-gray-500">
            Voyons à quel point vous connaissez votre couple.
          </p>

          <button
            onClick={start}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white"
          >
            Commencer ❤️
          </button>

        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">

          <div className="text-6xl">
            {score >= 40 ? "😍" : score >= 20 ? "🥰" : "💕"}
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            Quiz terminé !
          </h1>

          <p className="mt-4 text-gray-500">
            Votre score
          </p>

          <p className="mt-2 text-5xl font-bold text-pink-600">
            {score}
          </p>

          <button
            onClick={start}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white"
          >
            Rejouer ❤️
          </button>

        </div>
      </div>
    );
  }

  const question = questions[current];

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-2xl">

        <div className="mb-5 flex justify-between">
          <span className="font-semibold text-pink-500">
            Quiz amoureux
          </span>

          <span className="text-gray-400">
            {current + 1}/{questions.length}
          </span>
        </div>

        <div className="mb-6 h-2 rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
            style={{
              width: `${((current + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <h2 className="text-2xl font-bold">
            {question.question}
          </h2>

          <div className="mt-8 grid gap-3">
            {question.options.map((option, index) => (
              <button
                key={option}
                onClick={() => setSelected(index)}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  selected === index
                    ? "border-pink-500 bg-pink-50 text-pink-600"
                    : "border-gray-100 hover:border-pink-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            disabled={selected === null}
            onClick={answer}
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white disabled:bg-gray-300"
          >
            {current === questions.length - 1
              ? "Terminer ❤️"
              : "Question suivante →"}
          </button>

        </div>

      </div>
    </div>
  );
}
