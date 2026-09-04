import { useState } from "react";
import { X, Heart, Send } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const InvitationModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Veuillez entrer une adresse email.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/invitations/send`,
        {
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      setEmail("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Impossible d'envoyer l'invitation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        {/* Fermer */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Icône */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-pink-500">
          <Heart size={30} fill="currentColor" />
        </div>

        {/* Titre */}
        <div className="mt-5 text-center">

          <h2 className="text-2xl font-bold text-gray-800">
            Inviter votre partenaire ❤️
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Entrez l'adresse email de la personne avec
            qui vous souhaitez partager votre espace K2Love.
          </p>

        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Adresse email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="khady@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
            />

          </div>

          {/* Message succès */}
          {message && (
            <div className="rounded-xl bg-green-50 p-3 text-sm text-green-600">
              {message}
            </div>
          )}

          {/* Message erreur */}
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />

            {loading
              ? "Envoi en cours..."
              : "Envoyer l'invitation ❤️"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default InvitationModal;