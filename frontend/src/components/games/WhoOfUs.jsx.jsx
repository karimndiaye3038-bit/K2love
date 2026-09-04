import React, { useState } from "react";

const questions = [
  "Qui est le plus romantique ? ❤️",
  "Qui est le plus susceptible d'oublier une date importante ? 😂",
  "Qui fait le plus de cadeaux ? 🎁",
  "Qui est le plus jaloux ? 👀",
  "Qui est le plus gourmand ? 🍫",
  "Qui est le plus susceptible de dire « je t'aime » en premier ? 💕",
  "Qui est le plus têtu ? 😤",
  "Qui est le plus drôle ? 😂",
  "Qui dépense le plus d'argent ? 💸",
  "Qui ferait le premier pas après une dispute ? 🥰",
];

const choices = ["Moi ❤️", "Mon partenaire 💕"];

export default function WhoOfUs() {
  const [screen, setScreen] = useState("start");

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  const [player, setPlayer] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answersPlayer1, setAnswersPlayer1] = useState([]);
  const [answersPlayer2, setAnswersPlayer2] = useState([]);

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const startGame = () => {
    if (!player1Name.trim() || !player2Name.trim()) return;

    setPlayer(1);
    setCurrentQuestion(0);
    setAnswersPlayer1([]);
    setAnswersPlayer2([]);
    setSelectedAnswer(null);
    setScreen("quiz");
  };

  const selectAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const validateAnswer = () => {
    if (!selectedAnswer) return;

    if (player === 1) {
      setAnswersPlayer1([
        ...answersPlayer1,
        selectedAnswer,
      ]);

      setSelectedAnswer(null);
      setPlayer(2);
      setScreen("pass");
      return;
    }

    const newAnswersPlayer2 = [
      ...answersPlayer2,
      selectedAnswer,
    ];

    setAnswersPlayer2(newAnswersPlayer2);
    setSelectedAnswer(null);

    if (currentQuestion === questions.length - 1) {
      setScreen("result");
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setPlayer(1);
      setScreen("pass");
    }
  };

  const continueGame = () => {
    setSelectedAnswer(null);
    setScreen("quiz");
  };

  const calculateScore = () => {
    let scorePlayer1 = 0;
    let scorePlayer2 = 0;
    let matches = 0;

    for (let i = 0; i < questions.length; i++) {
      if (
        answersPlayer1[i] &&
        answersPlayer2[i] &&
        answersPlayer1[i] === answersPlayer2[i]
      ) {
        matches++;

        if (answersPlayer1[i] === "Moi ❤️") {
          scorePlayer1++;
        } else {
          scorePlayer2++;
        }
      }
    }

    return {
      scorePlayer1,
      scorePlayer2,
      matches,
    };
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
     ACCUEIL
  ========================= */

  if (screen === "start") {
    return (
      <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-10">
        <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">

          <div className="w-full rounded-3xl border border-pink-100 bg-white p-8 text-center shadow-xl md:p-10">

            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-5xl">
              💕
            </div>

            <p className="text-sm font-medium text-pink-500">
              Jeu de couple
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Qui de nous deux ?
            </h1>

            <p className="mt-3 text-gray-500">
              Découvrez ce que vous pensez vraiment
              l'un de l'autre 😏
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
                  placeholder="Prénom du partenaire"
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
              Commencer ❤️
            </button>

          </div>
        </div>
      </div>
    );
  }

  /* =========================
     PASSAGE DU TÉLÉPHONE
  ========================= */

  if (screen === "pass") {
    const nextPlayerName =
      player === 1 ? player1Name : player2Name;

    return (
      <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-10">
        <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">

          <div className="w-full rounded-3xl border border-pink-100 bg-white p-8 text-center shadow-xl">

            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-5xl">
              📱
            </div>

            <p className="text-sm font-medium text-pink-500">
              Tour suivant
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Passez le téléphone
            </h1>

            <p className="mt-4 text-gray-500">
              C'est au tour de
            </p>

            <p className="mt-1 text-2xl font-bold text-pink-600">
              {nextPlayerName} ❤️
            </p>

            <div className="mt-6 rounded-2xl bg-pink-50 p-5">
              <p className="text-sm text-gray-500">
                🤫 Ne regardez pas la réponse de votre
                partenaire.
              </p>
            </div>

            <button
              onClick={continueGame}
              className="mt-7 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:opacity-90"
            >
              Je suis prêt →
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
    const {
      scorePlayer1,
      scorePlayer2,
      matches,
    } = calculateScore();

    let resultMessage = "";
    let resultEmoji = "😂";

    if (matches === questions.length) {
      resultEmoji = "💖";
      resultMessage =
        "Vous êtes incroyablement synchronisés !";
    } else if (matches >= 7) {
      resultEmoji = "🥰";
      resultMessage =
        "Vous vous connaissez vraiment très bien !";
    } else if (matches >= 4) {
      resultEmoji = "💕";
      resultMessage =
        "Vous êtes plutôt bien connectés !";
    } else {
      resultEmoji = "😂";
      resultMessage =
        "Vous avez encore quelques surprises à découvrir !";
    }

    return (
      <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-10">

        <div className="mx-auto max-w-3xl">

          <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-xl">

            <div className="text-center">

              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-5xl">
                {resultEmoji}
              </div>

              <p className="text-sm font-medium text-pink-500">
                Résultat du couple
              </p>

              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                Qui de nous deux ?
              </h1>

              <p className="mt-3 text-gray-500">
                {resultMessage}
              </p>

            </div>

            {/* Scores */}

            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-pink-50 p-5 text-center">
                <p className="text-sm text-gray-500">
                  {player1Name}
                </p>

                <p className="mt-2 text-4xl font-bold text-pink-600">
                  {scorePlayer1}
                </p>

                <p className="text-xs text-gray-400">
                  réponses communes
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-5 text-center">
                <p className="text-sm text-gray-500">
                  {player2Name}
                </p>

                <p className="mt-2 text-4xl font-bold text-purple-600">
                  {scorePlayer2}
                </p>

                <p className="text-xs text-gray-400">
                  réponses communes
                </p>
              </div>

            </div>

            <div className="mt-5 rounded-2xl bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">
                Vous avez choisi la même réponse
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {matches}/{questions.length}
              </p>

              <p className="text-xs text-gray-400">
                fois
              </p>
            </div>

            {/* Détails */}

            <div className="mt-8">

              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Découvrez vos réponses 👀
              </h2>

              <div className="space-y-3">

                {questions.map((question, index) => {

                  const answer1 =
                    answersPlayer1[index];

                  const answer2 =
                    answersPlayer2[index];

                  const same =
                    answer1 === answer2;

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
                        {index + 1}. {question}
                      </p>

                      <div className="mt-3 grid gap-2 md:grid-cols-2">

                        <div className="rounded-lg bg-white p-3 text-sm">
                          <p className="text-xs text-gray-400">
                            {player1Name}
                          </p>

                          <p className="mt-1 font-medium">
                            {answer1}
                          </p>
                        </div>

                        <div className="rounded-lg bg-white p-3 text-sm">
                          <p className="text-xs text-gray-400">
                            {player2Name}
                          </p>

                          <p className="mt-1 font-medium">
                            {answer2}
                          </p>
                        </div>

                      </div>

                      <p
                        className={`mt-3 text-xs font-semibold ${
                          same
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {same
                          ? "✓ Vous êtes d'accord !"
                          : "😏 Vous n'êtes pas d'accord"}
                      </p>

                    </div>
                  );
                })}

              </div>

            </div>

            <button
              onClick={restartGame}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:opacity-90"
            >
              Rejouer ❤️
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* =========================
     JEU
  ========================= */

  return (
    <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-10">

      <div className="mx-auto max-w-3xl">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <p className="text-sm font-medium text-pink-500">
              Jeu de couple 💕
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Qui de nous deux ?
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
            {player === 1
              ? player1Name
              : player2Name}{" "}
            ❤️
          </h2>

        </div>

        {/* Question */}

        <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm md:p-8">

          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-3xl">
              👀
            </div>

            <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
              {questions[currentQuestion]}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Qui correspond le mieux à cette
              description ?
            </p>

          </div>

          {/* Choix */}

          <div className="grid gap-4 md:grid-cols-2">

            {choices.map((choice) => {

              const selected =
                selectedAnswer === choice;

              return (
                <button
                  key={choice}
                  onClick={() =>
                    selectAnswer(choice)
                  }
                  className={`rounded-2xl border-2 p-6 text-center font-semibold transition ${
                    selected
                      ? "border-pink-500 bg-pink-50 text-pink-600 shadow-md"
                      : "border-gray-100 bg-white text-gray-700 hover:border-pink-200 hover:bg-pink-50"
                  }`}
                >

                  <div className="text-3xl">
                    {choice === "Moi ❤️"
                      ? "🙋"
                      : "💑"}
                  </div>

                  <p className="mt-2">
                    {choice}
                  </p>

                  {selected && (
                    <p className="mt-2 text-sm text-pink-500">
                      ✓ Sélectionné
                    </p>
                  )}

                </button>
              );
            })}

          </div>

          <button
            disabled={!selectedAnswer}
            onClick={validateAnswer}
            className={`mt-7 w-full rounded-xl py-3 font-semibold text-white transition ${
              selectedAnswer
                ? "bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-purple-200 hover:opacity-90"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            {currentQuestion === questions.length - 1 &&
            player === 2
              ? "Voir les résultats ❤️"
              : "Valider ma réponse →"}
          </button>

        </div>

      </div>
    </div>
  );
}
