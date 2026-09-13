import { useEffect, useRef, useState } from "react";
import {
  Image,
  Plus,
  Trash2,
  X,
  Upload,
  Play,
  Loader2,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const Gallery = () => {
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");

  const fileInputRef = useRef(null);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  /* =========================
     CHARGER LA GALERIE
  ========================= */

  const loadGallery = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const response = await fetch(`${API_URL}/gallery`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de charger la galerie."
        );
      }

      setItems(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  /* =========================
     SELECTION FICHIER
  ========================= */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  };

  /* =========================
     UPLOAD
  ========================= */

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Sélectionnez une photo ou une vidéo.");
      return;
    }

    try {
      setUploading(true);

      const token = getToken();

      const formData = new FormData();

      formData.append("media", selectedFile);
      formData.append("description", description);

      const response = await fetch(`${API_URL}/gallery`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible d'ajouter le média."
        );
      }

      setItems((prev) => [data, ...prev]);

      setSelectedFile(null);
      setDescription("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     SUPPRIMER
  ========================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce média ?"
    );

    if (!confirmed) return;

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/gallery/${id}`,
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
          data.message || "Impossible de supprimer le média."
        );
      }

      setItems((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  /* =========================
     TYPE MEDIA
  ========================= */

  const isVideo = (item) => {
    return (
      item.type === "video" ||
      item.mimeType?.startsWith("video/")
    );
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Notre galerie 📸
          </h1>

          <p className="mt-2 text-gray-500">
            Tous vos souvenirs photos et vidéos au même endroit.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-pink-100 transition hover:scale-[1.02]"
        >
          <Plus size={20} />

          Ajouter un média
        </button>

      </div>

      {/* CHARGEMENT */}

      {loading && (
        <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-pink-100 bg-white">

          <div className="text-center">

            <Loader2
              size={40}
              className="mx-auto animate-spin text-pink-500"
            />

            <p className="mt-4 text-gray-500">
              Chargement de votre galerie...
            </p>

          </div>

        </div>
      )}

      {/* GALERIE VIDE */}

      {!loading && items.length === 0 && (
        <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-pink-100 bg-white shadow-sm">

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-100 text-purple-600">
              <Image size={38} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-800">
              Votre galerie ❤️
            </h2>

            <p className="mt-2 text-gray-500">
              Vos photos et vidéos apparaîtront ici.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 font-semibold text-white"
            >
              Ajouter votre premier souvenir 📸
            </button>

          </div>

        </div>
      )}

      {/* GALERIE */}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {items.map((item) => (
            <div
              key={item._id}
              className="group overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              {/* MEDIA */}

              <div className="relative aspect-square overflow-hidden bg-gray-100">

                {isVideo(item) ? (
                  <video
                    src={item.url}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.description || "Souvenir"}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                )}

                {/* DELETE */}

                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-gray-500 opacity-0 shadow transition group-hover:opacity-100 hover:text-red-500"
                  title="Supprimer"
                >
                  <Trash2 size={17} />
                </button>

                {/* VIDEO */}

                {isVideo(item) && (
                  <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 p-2 text-white">
                    <Play size={15} fill="white" />
                  </div>
                )}

              </div>

              {/* DESCRIPTION */}

              <div className="p-4">

                {item.description && (
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                )}

                {item.createdBy && (
                  <p className="mt-2 text-xs text-pink-500">
                    ❤️ Ajouté par{" "}
                    {item.createdBy.name ||
                      item.createdBy.email}
                  </p>
                )}

                {item.createdAt && (
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString("fr-FR")}
                  </p>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

      {/* MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Ajouter à notre galerie ❤️
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Le média sera automatiquement partagé avec votre partenaire.
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
              onSubmit={handleUpload}
              className="mt-6 space-y-5"
            >

              {/* FICHIER */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Photo ou vidéo
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50 p-8 text-center transition hover:border-pink-400"
                >

                  <Upload
                    size={35}
                    className="text-pink-500"
                  />

                  <p className="mt-3 font-semibold text-gray-700">
                    {selectedFile
                      ? selectedFile.name
                      : "Choisir une photo ou une vidéo"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    JPG, PNG, WEBP, MP4, MOV...
                  </p>

                </button>

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
                  rows={3}
                  placeholder="Un petit mot sur ce souvenir..."
                  className="w-full resize-none rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-pink-400"
                />

              </div>

              {/* ACTIONS */}

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={
                    uploading || !selectedFile
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {uploading && (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  )}

                  {uploading
                    ? "Envoi..."
                    : "Ajouter ❤️"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Gallery;
