import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, Check, X } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const Invitations = () => {
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Pour l'instant, cette page sera utilisée
    // avec le token d'invitation.
    setLoading(false);
  }, []);

  const acceptInvitation = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const token = new URLSearchParams(
        window.location.search
      ).get("token");

      const authToken = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/invitations/accept`,
        {
          token,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setMessage(response.data.message);

      setInvitation(null);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Impossible d'accepter l'invitation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg">
          <Heart size={36} fill="currentColor" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-800">
          Une invitation ❤️
        </h1>

        <p className="mt-3 text-gray-500">
          Quelqu'un souhaite partager son espace
          K2Love avec vous.
        </p>

        {message && (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-green-600">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!message && (
          <div className="mt-8 flex gap-3">

            <button
              onClick={acceptInvitation}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white"
            >
              <Check size={18} />

              {loading ? "Chargement..." : "Accepter ❤️"}
            </button>

            <button
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-600"
            >
              <X size={18} />

              Refuser
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default Invitations;