import React, { useState } from "react";

const questions = [
  "Quel est ton rêve le plus fou ? ✨",
  "Quel endroit aimerais-tu visiter avec moi ? ✈️",
  "Quel souvenir de nous te fait toujours sourire ? 😊",
  "Quelle qualité apprécies-tu le plus chez moi ? ❤️",
  "Quelle serait notre journée parfaite ? 🥰",
  "Qu'aimerais-tu accomplir avec moi cette année ? 🌹",
  "Quel film représente le mieux notre couple ? 🎬",
  "Quelle chanson te fait penser à nous ? 🎵",
];

export default function QuizGame({ onFinish }) {
  const [question, setQuestion] = useState(
    questions[Math.floor(Math.random() * questions.length)]
  );

  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);

  const submit = () => {
    if (!answer.trim()) return;

    setAnswered(true);

    if (onFinish) {
      onFinish({
        score: 5,
        challenges: 1,
      });
    }
  };

  const next = () => {
    const nextQuestion =
      questions[Math.floor(Math.random() * questions.length)];

    setQuestion(nextQuestion);
    setAnswer("");
    setAnswered(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <div className="text-center">

            <div className="text-6xl">💌</div>

            <h1 className="mt-5 text-3xl font-bold">
              Question du jour
            </h1>

            <p className="mt-2 text-gray-400">
              Prenez quelques minutes pour vous parler.
            </p>

          </div>

          <div className="mt-8 rounded-2xl bg-blue-50 p-6 text-center">

            <p className="text-xl font-bold text-blue-700">
              {question}
            </p>

          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={answered}
            placeholder="Écrivez votre réponse..."
            className="mt-6 min-h-[150px] w-full rounded-xl border-2 border-gray-100 p-4 outline-none focus:border-pink-400"
          />

          {!answered ? (
            <button
              onClick={submit}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white"
            >
              Partager ma réponse ❤️
            </button>
          ) : (
            <button
              onClick={next}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white"
            >
              Nouvelle question →
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
