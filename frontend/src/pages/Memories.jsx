import { useEffect, useState } from "react";
import {
  Heart,
  Plus,
  Trash2,
  X,
  Calendar,
  User,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const Memories = () => {
  const [memories, setMemories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  /*
    Charger les souvenirs
  */
  const loadMemories = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const response = await fetch(`${API_URL}/memories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de récupérer les souvenirs."
        );
      }

      setMemories(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  /*
    Ajouter un souvenir
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Ajoutez un titre au souvenir.");
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      const response = await fetch(`${API_URL}/memories`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title,
          description,
          date: date || new Date().toISOString(),
          image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de créer le souvenir."
        );
      }

      /*
        On ajoute directement le nouveau souvenir
        à l'écran.
      */
      setMemories((prev) => [data, ...prev]);

      setTitle("");
      setDescription("");
      setDate("");
      setImage("");

      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  /*
    Supprimer un souvenir
  */
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce souvenir ?"
    );

    if (!confirmed) return;

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/memories/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de supprimer le souvenir."
        );
      }

      setMemories((prev) =>
        prev.filter((memory) => memory._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  /*
    Format date
  */
  const formatDate = (dateValue) => {
    if (!dateValue) return "";

    return new Date(dateValue).toLocaleDateString(
      "fr-FR",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Nos souvenirs ❤️
          </h1>

          <p className="mt-2 text-gray-500">
            Conservez les moments les plus précieux de votre histoire.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-pink-100 transition hover:scale-[1.02]"
        >
          <Plus size={20} />

          Ajouter un souvenir
        </button>

      </div>

      {/* LOADING */}

      {loading && (
        <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-pink-100 bg-white">

          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-100 border-t-pink-500" />

            <p className="mt-4 text-gray-500">
              Chargement de vos souvenirs...
            </p>

          </div>

        </div>
      )}

      {/* EMPTY */}

      {!loading && memories.length === 0 && (
        <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-pink-100 bg-white shadow-sm">

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-100 text-pink-500">
              <Heart size={38} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-800">
              Notre histoire
            </h2>

            <p className="mt-2 text-gray-500">
              Aucun souvenir pour le moment.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-5 rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white hover:bg-pink-600"
            >
              Ajouter notre premier souvenir ❤️
            </button>

          </div>

        </div>
      )}

      {/* SOUVENIRS */}

      {!loading && memories.length > 0 && (

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {memories.map((memory) => (

            <div
              key={memory._id}
              className="group overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              {/* IMAGE */}

              {memory.image ? (

                <img
                  src={memory.image}
                  alt={memory.title}
                  className="h-52 w-full object-cover"
                />

              ) : (

                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 text-6xl">
                  ❤️
                </div>

              )}

              {/* CONTENU */}

              <div className="p-5">

                <div className="flex items-start justify-between gap-3">

                  <h2 className="text-lg font-bold text-gray-800">
                    {memory.title}
                  </h2>

                  <button
                    onClick={() => handleDelete(memory._id)}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    title="Supprimer"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

                {memory.description && (
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {memory.description}
                  </p>
                )}

                <div className="mt-4 space-y-2">

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={15} />

                    {formatDate(memory.date)}
                  </div>

                  {memory.createdBy && (
                    <div className="flex items-center gap-2 text-xs text-pink-500">
                      <User size={15} />

                      Ajouté par{" "}
                      {memory.createdBy.name ||
                        memory.createdBy.email}
                    </div>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Ajouter un souvenir ❤️
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Ce souvenir sera automatiquement partagé avec votre partenaire.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={22} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >

              {/* TITRE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Titre
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Notre premier voyage ❤️"
                  className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-pink-400"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Racontez ce beau souvenir..."
                  rows={4}
                  className="w-full resize-none rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-pink-400"
                />
              </div>

              {/* DATE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Date du souvenir
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-pink-400"
                />
              </div>

              {/* IMAGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Image
                </label>

                <input
                  type="url"
                  value={image}
                  onChange={(e) =>
                    setImage(e.target.value)
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-pink-400"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Pour l'instant, utilisez l'URL d'une image.
                </p>
              </div>

              {/* ACTIONS */}

              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {saving
                    ? "Enregistrement..."
                    : "Enregistrer ❤️"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Memories;
