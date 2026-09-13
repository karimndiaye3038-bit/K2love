import React, { useEffect, useState } from "react";

const symbols = ["❤️", "💕", "💖", "💘", "💝", "🌹"];

function createCards() {
  return [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({
      id: index,
      symbol,
      revealed: false,
      matched: false,
    }));
}

export default function MemoryGame({ onFinish }) {
  const [cards, setCards] = useState(createCards);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (selected.length !== 2) return;

    const [first, second] = selected;

    if (cards[first].symbol === cards[second].symbol) {
      setCards((prev) =>
        prev.map((card, index) =>
          index === first || index === second
            ? { ...card, matched: true }
            : card
        )
      );

      setSelected([]);
    } else {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((card, index) =>
            index === first || index === second
              ? { ...card, revealed: false }
              : card
          )
        );

        setSelected([]);
      }, 700);
    }

    setMoves((value) => value + 1);
  }, [selected]);

  useEffect(() => {
    if (
      cards.length > 0 &&
      cards.every((card) => card.matched)
    ) {
      setFinished(true);

      const score = Math.max(
        10,
        100 - moves * 5
      );

      if (onFinish) {
        onFinish({
          score,
          challenges: 1,
        });
      }
    }
  }, [cards, moves, onFinish]);

  const reveal = (index) => {
    if (selected.length >= 2) return;

    if (
      cards[index].revealed ||
      cards[index].matched
    ) {
      return;
    }

    setCards((prev) =>
      prev.map((card, i) =>
        i === index
          ? { ...card, revealed: true }
          : card
      )
    );

    setSelected((prev) => [...prev, index]);
  };

  const restart = () => {
    setCards(createCards());
    setSelected([]);
    setMoves(0);
    setFinished(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-10">

      <div className="mx-auto max-w-2xl">

        <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">

          <div className="text-center">

            <div className="text-5xl">🧠</div>

            <h1 className="mt-3 text-3xl font-bold">
              Memory amoureux
            </h1>

            <p className="mt-2 text-gray-400">
              Trouvez toutes les paires ❤️
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Coups : {moves}
            </p>

          </div>

          <div className="mt-8 grid grid-cols-4 gap-3">

            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => reveal(index)}
                className={`aspect-square rounded-xl text-3xl transition ${
                  card.revealed || card.matched
                    ? "bg-pink-100"
                    : "bg-gradient-to-br from-pink-500 to-purple-600"
                }`}
              >
                {card.revealed || card.matched
                  ? card.symbol
                  : "?"}
              </button>
            ))}

          </div>

          {finished && (
            <div className="mt-8 rounded-2xl bg-green-50 p-6 text-center">

              <p className="text-2xl font-bold text-green-600">
                🎉 Bravo !
              </p>

              <p className="mt-2 text-gray-500">
                Vous avez trouvé toutes les paires.
              </p>

              <button
                onClick={restart}
                className="mt-5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-semibold text-white"
              >
                Rejouer
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
