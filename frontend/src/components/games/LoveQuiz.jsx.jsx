import React, { useState } from "react";

const questions = [
  {
    question: "Quel est mon plat préféré ?",
    options: [
      "Pizza 🍕",
      "Burger 🍔",
      "Poulet 🍗",
      "Pâtes 🍝",
    ],
  },
  {
    question: "Quelle destination aimerais-je visiter ?",
    options: [
      "Paris 🇫🇷",
      "Dubaï 🇦🇪",
      "Maldives 🏝️",
      "New York 🗽",
    ],
  },
  {
    question: "Quel est mon film préféré ?",
    options: [
      "Film romantique ❤️",
      "Film d'action 🔥",
      "Comédie 😂",
      "Horreur 👻",
    ],
  },
  {
    question: "Quelle activité préfère-t-on faire ensemble ?",
    options: [
      "Regarder un film 🎬",
      "Voyager ✈️",
      "Sortir 🍽️",
      "Rester à la maison 🏠",
    ],
  },
  {
    question: "Qui est le plus romantique ?",
    options: [
      "Moi ❤️",
      "Mon partenaire 💕",
      "Les deux 🥰",
      "Aucun 😂",
    ],
  },
];

export default function LoveQuiz() {
  const [screen, setScreen] = useState("start");

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  const [player, setPlayer] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answersPlayer1, setAnswersPlayer1] = useState([]);
  const [answersPlayer2, setAnswersPlayer2] = useState([]);

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const question = questions[currentQuestion];

  const currentPlayerName =
    player === 1 ? player1Name : player2Name;

  const startGame = () => {
    if (!player1Name.trim() || !player2Name.trim()) {
      return;
    }

    setScreen("quiz");
    setPlayer(1);
    setCurrentQuestion(0);
    setAnswersPlayer1([]);
    setAnswersPlayer2([]);
    setSelectedAnswer(null);
  };

  const selectAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    if (!selectedAnswer) return;

    if (player === 1) {
      const newAnswers = [
        ...answersPlayer1,
        selectedAnswer,
      ];

      setAnswersPlayer1(newAnswers);
      setSelectedAnswer(null);

      // On cache les réponses du joueur 1
      setScreen("pass");
      setPlayer(2);
    } else {
      const newAnswers = [
        ...answersPlayer2,
        selectedAnswer,
      ];

      setAnswersPlayer2(newAnswers);
      setSelectedAnswer(null);

      if (currentQuestion === questions.length - 1) {
        setScreen("result");
      } else {
        setCurrentQuestion(currentQuestion + 1);

        // Joueur 1 répond à la question suivante
        setPlayer(1);

        // Écran de passage du téléphone
        setScreen("pass");
      }
    }
  };

  const continueAfterPass = () => {
    setScreen("quiz");
    setSelectedAnswer(null);
  };

  const calculateScore = () => {
    let score = 0;

    for (let i = 0; i < questions.length; i++) {
      if (
        answersPlayer1[i] &&
        answersPlayer2[i] &&
        answersPlayer1[i] === answersPlayer2[i]
      ) {
        score++;
      }
    }

    return score;
  };

  const restartGame = () => {
    setScreen("start");
    setPlayer1Name("");
    setPlayer2Name("");
    setPlayer(1);
    setCurrentQuestion(0);
    setAnswersPlayer1([]);
    setAnswersPlayer2([]);
    setSelectedAnswer(null);
  };

  /* =========================
     ÉCRAN D'ACCUEIL
  ========================= */

  if (screen === "start") {
    return (
      <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-10">
        <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-pink-100 bg-white p-8 text-center shadow-xl md:p-10">

            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-5xl">
              💕
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Qui connaît le mieux l'autre ?
            </h1>

            <p className="mt-3 text-gray-500">
              Répondez chacun votre tour et découvrez
              à quel point vous êtes synchronisés ❤️
            </p>

            <div className="mt-8 space-y-4 text-left">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Joueur 1
                </label>

                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) =>
                    setPlayer1Name(e.target.value)
                  }
                  placeholder="Votre prénom"
                  className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none transition focus:border-pink-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Joueur 2
                </label>

                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) =>
                    setPlayer2Name(e.target.value)
                  }
                  placeholder="Prénom de votre partenaire"
                  className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none transition focus:border-pink-400"
                />
              </div>

            </div>

            <button
              onClick={startGame}
              disabled={
                !player1Name.trim() ||
                !player2Name.trim()
              }
              className={`mt-7 w-full rounded-xl py-3 font-semibold text-white transition ${
                player1Name.trim() &&
                player2Name.trim()
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-purple-200 hover:opacity-90"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              Commencer le quiz ❤️
            </button>

          </div>
        </div>
      </div>
    );
  }

  /* =========================
     ÉCRAN PASSAGE
  ========================= */

  if (screen === "pass") {
    return (
      <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-10">
        <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">

          <div className="w-full rounded-3xl border border-pink-100 bg-white p-8 text-center shadow-xl">

            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-5xl">
              📱
            </div>

            <p className="text-sm font-medium text-pink-500">
              À vous de jouer !
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Passez le téléphone
            </h1>

            <p className="mt-4 text-gray-500">
              C'est maintenant au tour de{" "}
              <span className="font-bold text-pink-600">
                {currentPlayerName}
              </span>
              .
            </p>

            <div className="mt-6 rounded-2xl bg-pink-50 p-5">
              <p className="text-sm text-gray-500">
                Ne regardez pas les réponses de l'autre
                joueur 🤫
              </p>
            </div>

            <button
              onClick={continueAfterPass}
              className="mt-7 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:opacity-90"
            >
              Je suis prêt ❤️
            </button>

          </div>

        </div>
      </div>
    );
  }

  /* =========================
     RESULTAT
  ========================= */

  if (screen === "result") {
    const score = calculateScore();

    const percentage = Math.round(
      (score / questions.length) * 100
    );

    let emoji = "😂";
    let message = "Il va falloir apprendre à mieux vous connaître !";

    if (percentage === 100) {
      emoji = "💖";
      message = "Vous êtes parfaitement synchronisés !";
    } else if (percentage >= 80) {
      emoji = "🥰";
      message = "Vous vous connaissez vraiment très bien !";
    } else if (percentage >= 50) {
      emoji = "💕";
      message = "Pas mal ! Vous êtes sur la bonne voie.";
    }

    return (
      <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-10">
        <div className="mx-auto max-w-2xl">

          <div className="rounded-3xl border border-pink-100 bg-white p-8 text-center shadow-xl">

            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-5xl">
              {emoji}
            </div>

            <p className="text-sm font-medium text-pink-500">
              Résultat de {player1Name} & {player2Name}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Quiz terminé !
            </h1>

            <div className="my-8">
              <p className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-7xl font-bold text-transparent">
                {score}/{questions.length}
              </p>

              <p className="mt-2 text-gray-400">
                {percentage}% de réponses identiques
              </p>
            </div>

            <div className="rounded-2xl bg-pink-50 p-5">
              <p className="text-3xl">{emoji}</p>

              <p className="mt-2 font-bold text-pink-600">
                {message}
              </p>
            </div>

            {/* Détail des réponses */}

            <div className="mt-8 text-left">

              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Vos réponses 💕
              </h2>

              <div className="space-y-3">
                {questions.map((item, index) => {
                  const same =
                    answersPlayer1[index] ===
                    answersPlayer2[index];

                  return (
                    <div
                      key={index}
                      className={`rounded-xl border p-4 ${
                        same
                          ? "border-green-100 bg-green-50"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >

                      <p className="text-sm font-semibold text-gray-800">
                        {index + 1}. {item.question}
                      </p>

                      <div className="mt-2 grid gap-2 md:grid-cols-2">

                        <div className="rounded-lg bg-white p-2 text-sm">
                          <span className="font-semibold">
                            {player1Name} :
                          </span>{" "}
                          {answersPlayer1[index]}
                        </div>

                        <div className="rounded-lg bg-white p-2 text-sm">
                          <span className="font-semibold">
                            {player2Name} :
                          </span>{" "}
                          {answersPlayer2[index]}
                        </div>

                      </div>

                      <p
                        className={`mt-2 text-xs font-semibold ${
                          same
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {same
                          ? "✓ Même réponse"
                          : "✗ Réponses différentes"}
                      </p>

                    </div>
                  );
                })}
              </div>

            </div>

            <button
              onClick={restartGame}
              className="mt-7 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:opacity-90"
            >
              Rejouer ❤️
            </button>

          </div>
        </div>
      </div>
    );
  }

  /* =========================
     QUIZ
  ========================= */

  return (
    <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-10">

      <div className="mx-auto max-w-3xl">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div>
            <p className="text-sm font-medium text-pink-500">
              Quiz amoureux 💕
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Qui connaît le mieux l'autre ?
            </h1>
          </div>

          <div className="rounded-xl bg-white px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-400">
              Question
            </span>

            <p className="text-center font-bold text-purple-600">
              {currentQuestion + 1}/{questions.length}
            </p>
          </div>

        </div>

        {/* Progression */}

        <div className="mb-8 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500"
            style={{
              width: `${
                ((currentQuestion + 1) /
                  questions.length) *
                100
              }%`,
            }}
          />
        </div>

        {/* Joueur */}

        <div className="mb-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 p-5 text-white">

          <p className="text-sm text-white/80">
            C'est au tour de
          </p>

          <h2 className="text-xl font-bold">
            {currentPlayerName} ❤️
          </h2>

        </div>

        {/* Question */}

        <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm md:p-8">

          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-3xl">
              💭
            </div>

            <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
              {question.question}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Choisissez votre réponse
            </p>

          </div>

          {/* Réponses */}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            {question.options.map((option) => {
              const selected =
                selectedAnswer === option;

              return (
                <button
                  key={option}
                  onClick={() => selectAnswer(option)}
                  className={`rounded-xl border-2 p-4 text-left text-sm font-medium transition ${
                    selected
                      ? "border-pink-500 bg-pink-50 text-pink-600"
                      : "border-gray-100 bg-white text-gray-700 hover:border-pink-200 hover:bg-pink-50"
                  }`}
                >
                  <div className="flex items-center justify-between">

                    <span>{option}</span>

                    {selected && (
                      <span className="text-pink-500">
                        ✓
                      </span>
                    )}

                  </div>
                </button>
              );
            })}

          </div>

          {/* Validation */}

          <button
            disabled={!selectedAnswer}
            onClick={nextQuestion}
            className={`mt-7 w-full rounded-xl py-3 font-semibold text-white transition ${
              selectedAnswer
                ? "bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-purple-200 hover:opacity-90"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            {player === 1
              ? "Valider ma réponse →"
              : currentQuestion === questions.length - 1
              ? "Voir le résultat ❤️"
              : "Valider ma réponse →"}
          </button>

        </div>

      </div>
    </div>
  );
}