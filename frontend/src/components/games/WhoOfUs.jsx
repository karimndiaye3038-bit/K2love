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

export default function WhoOfUs({ onFinish }) {
  const [screen, setScreen] = useState("start");

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  const [player, setPlayer] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answersPlayer1, setAnswersPlayer1] = useState([]);
  const [answersPlayer2, setAnswersPlayer2] = useState([]);

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  /* =====================================================
     DÉMARRER
  ===================================================== */

  const startGame = () => {
    if (!player1Name.trim() || !player2Name.trim()) {
      return;
    }

    setPlayer(1);
    setCurrentQuestion(0);
    setAnswersPlayer1([]);
    setAnswersPlayer2([]);
    setSelectedAnswer(null);
    setScreen("quiz");
  };

  /* =====================================================
     SÉLECTIONNER UNE RÉPONSE
  ===================================================== */

  const selectAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  /* =====================================================
     VALIDER UNE RÉPONSE
  ===================================================== */

  const validateAnswer = () => {
    if (!selectedAnswer) {
      return;
    }

    /* -------------------------
       JOUEUR 1
    ------------------------- */

    if (player === 1) {
      const newAnswers = [
        ...answersPlayer1,
        selectedAnswer,
      ];

      setAnswersPlayer1(newAnswers);
      setSelectedAnswer(null);

      setPlayer(2);
      setScreen("pass");

      return;
    }

    /* -------------------------
       JOUEUR 2
    ------------------------- */

    const newAnswers = [
      ...answersPlayer2,
      selectedAnswer,
    ];

    setAnswersPlayer2(newAnswers);
    setSelectedAnswer(null);

    /* Dernière question */
    if (currentQuestion === questions.length - 1) {
      setScreen("result");
      return;
    }

    /* Question suivante */
    setCurrentQuestion(currentQuestion + 1);
    setPlayer(1);
    setScreen("pass");
  };

  /* =====================================================
     CONTINUER APRÈS LE PASSAGE DU TÉLÉPHONE
  ===================================================== */

  const continueGame = () => {
    setSelectedAnswer(null);
    setScreen("quiz");
  };

  /* =====================================================
     CALCUL DU SCORE
  ===================================================== */

  const calculateScore = () => {
    let matches = 0;

    for (let i = 0; i < questions.length; i++) {
      if (
        answersPlayer1[i] &&
        answersPlayer2[i] &&
        answersPlayer1[i] === answersPlayer2[i]
      ) {
        matches++;
      }
    }

    const percentage = Math.round(
      (matches / questions.length) * 100
    );

    return {
      matches,
      percentage,
    };
  };

  /* =====================================================
     TERMINER LA PARTIE
  ===================================================== */

  const finishGame = () => {
    const { matches, percentage } = calculateScore();

    /*
      Score global :
      1 bonne correspondance = 10 points
    */
    const score = matches * 10;

    if (onFinish) {
      onFinish({
        score,
        matches,
        percentage,
        game: "who-of-us",
      });
    }
  };

  /* =====================================================
     RECOMMENCER
  ===================================================== */

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

  /* =====================================================
     ACCUEIL
  ===================================================== */

  if (screen === "start") {
    return (
      <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-10">

        <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">

          <div className="w-full rounded-3xl border border-pink-100 bg-white p-8 text-center shadow-xl md:p-10">

            {/* ICON */}

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

            {/* NOMS */}

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

            {/* BOUTON */}

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

  /* =====================================================
     PASSAGE DU TÉLÉPHONE
  ===================================================== */

  if (screen === "pass") {
    const nextPlayerName =
      player === 1
        ? player1Name
        : player2Name;

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
                🤫 Ne regardez pas la réponse
                de votre partenaire.
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

  /* =====================================================
     RÉSULTATS
  ===================================================== */

  if (screen === "result") {
    const {
      matches,
      percentage,
    } = calculateScore();

    let resultEmoji = "😂";
    let resultMessage =
      "Vous avez encore quelques surprises à découvrir !";

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
    }

    return (
      <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-10">

        <div className="mx-auto max-w-3xl">

          <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-xl">

            {/* HEADER */}

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

            {/* SCORE GLOBAL */}

            <div className="mt-8 rounded-3xl bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-center text-white">

              <p className="text-sm text-white/80">
                Votre compatibilité
              </p>

              <p className="mt-2 text-5xl font-bold">
                {percentage}%
              </p>

              <p className="mt-2 text-sm text-white/80">
                {matches}/{questions.length} réponses identiques
              </p>

            </div>

            {/* JOUEURS */}

            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-pink-50 p-5 text-center">

                <div className="text-3xl">
                  🙋
                </div>

                <p className="mt-2 text-sm font-semibold text-gray-700">
                  {player1Name}
                </p>

              </div>

              <div className="rounded-2xl bg-purple-50 p-5 text-center">

                <div className="text-3xl">
                  💑
                </div>

                <p className="mt-2 text-sm font-semibold text-gray-700">
                  {player2Name}
                </p>

              </div>

            </div>

            {/* DÉTAILS */}

            <div className="mt-8">

              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Vos réponses 👀
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

                          <p className="mt-1 font-medium text-gray-700">
                            {answer1}
                          </p>

                        </div>

                        <div className="rounded-lg bg-white p-3 text-sm">

                          <p className="text-xs text-gray-400">
                            {player2Name}
                          </p>

                          <p className="mt-1 font-medium text-gray-700">
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

            {/* BOUTONS */}

            <div className="mt-8 grid gap-3 md:grid-cols-2">

              <button
                onClick={restartGame}
                className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:opacity-90"
              >
                Rejouer ❤️
              </button>

              <button
                onClick={finishGame}
                className="rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Enregistrer le score 🏆
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /* =====================================================
     JEU
  ===================================================== */

  const currentPlayerName =
    player === 1
      ? player1Name
      : player2Name;

  return (
    <div className="min-h-screen bg-[#fcf9fc] p-6 md:p-10">

      <div className="mx-auto max-w-3xl">

        {/* HEADER */}

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

        {/* PROGRESSION */}

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

        {/* JOUEUR */}

        <div className="mb-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 p-5 text-white">

          <p className="text-sm text-white/80">
            C'est au tour de
          </p>

          <h2 className="text-xl font-bold">
            {currentPlayerName} ❤️
          </h2>

        </div>

        {/* QUESTION */}

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

          {/* CHOIX */}

          <div className="grid gap-4 md:grid-cols-2">

            {/* JOUEUR 1 */}

            <button
              onClick={() =>
                selectAnswer("player1")
              }
              className={`rounded-2xl border-2 p-6 text-center transition ${
                selectedAnswer === "player1"
                  ? "border-pink-500 bg-pink-50 text-pink-600 shadow-md"
                  : "border-gray-100 bg-white text-gray-700 hover:border-pink-200 hover:bg-pink-50"
              }`}
            >

              <div className="text-3xl">
                🙋
              </div>

              <p className="mt-2 font-semibold">
                {player1Name}
              </p>

              {selectedAnswer === "player1" && (
                <p className="mt-2 text-sm text-pink-500">
                  ✓ Sélectionné
                </p>
              )}

            </button>

            {/* JOUEUR 2 */}

            <button
              onClick={() =>
                selectAnswer("player2")
              }
              className={`rounded-2xl border-2 p-6 text-center transition ${
                selectedAnswer === "player2"
                  ? "border-purple-500 bg-purple-50 text-purple-600 shadow-md"
                  : "border-gray-100 bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50"
              }`}
            >

              <div className="text-3xl">
                💑
              </div>

              <p className="mt-2 font-semibold">
                {player2Name}
              </p>

              {selectedAnswer === "player2" && (
                <p className="mt-2 text-sm text-purple-500">
                  ✓ Sélectionné
                </p>
              )}

            </button>

          </div>

          {/* VALIDATION */}

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

