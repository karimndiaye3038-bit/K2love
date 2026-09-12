import {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import {
  Send,
  Image as ImageIcon,
  Video,
  Mic,
  Square,
} from "lucide-react";

import { io } from "socket.io-client";

// =====================================================
// CONFIGURATION
// =====================================================

const API_URL = "https://k2love-backend.onrender.com";

// =====================================================
// COMPONENT
// =====================================================

const Messages = () => {
  // ===================================================
  // STATES
  // ===================================================

  const [messages, setMessages] = useState([]);

  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);

  const [sendingMedia, setSendingMedia] =
    useState(false);

  const [recording, setRecording] =
    useState(false);

  const [mediaRecorder, setMediaRecorder] =
    useState(null);

  const [mediaType, setMediaType] =
    useState("image");

  const [currentUserId, setCurrentUserId] =
    useState(null);

  // ===================================================
  // REFS
  // ===================================================

  const socketRef = useRef(null);

  const messagesEndRef = useRef(null);

  const fileInputRef = useRef(null);

  // ===================================================
  // RÉCUPÉRER L'ID DE L'UTILISATEUR
  // ===================================================

  const getCurrentUserId = () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        return null;
      }

      const parts = token.split(".");

      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(
        atob(
          parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")
        )
      );

      return (
        payload.id ||
        payload.userId ||
        payload._id ||
        payload.sub ||
        null
      );
    } catch (error) {
      console.error(
        "Erreur récupération utilisateur :",
        error
      );

      return null;
    }
  };

  // ===================================================
  // SCROLL VERS LE BAS
  // ===================================================

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  // ===================================================
  // AJOUTER UN MESSAGE SANS DOUBLON
  // ===================================================

  const addMessage = (newMessage) => {
    if (!newMessage) {
      return;
    }

    setMessages((currentMessages) => {
      const exists = currentMessages.some(
        (message) =>
          String(message._id) ===
          String(newMessage._id)
      );

      if (exists) {
        return currentMessages;
      }

      return [
        ...currentMessages,
        newMessage,
      ];
    });

    scrollToBottom();
  };

  // ===================================================
  // RÉCUPÉRER LES MESSAGES
  // ===================================================

  const fetchMessages = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response =
        await axios.get(
          `${API_URL}/api/messages`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setMessages(
        response.data.messages || []
      );

      scrollToBottom();
    } catch (error) {
      console.error(
        "Erreur récupération messages :",
        error.response?.data ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // SOCKET.IO
  // ===================================================

  useEffect(() => {
    const userId =
      getCurrentUserId();

    setCurrentUserId(userId);

    fetchMessages();

    const token =
      localStorage.getItem("token");

    if (!token) {
      return;
    }

    // -------------------------------------------------
    // CONNEXION SOCKET
    // -------------------------------------------------

    socketRef.current = io(
      API_URL,
      {
        auth: {
          token,
        },
      }
    );

    // -------------------------------------------------
    // NOUVEAU MESSAGE
    // -------------------------------------------------

    socketRef.current.on(
      "newMessage",
      (message) => {
        addMessage(message);
      }
    );

    // -------------------------------------------------
    // NETTOYAGE
    // -------------------------------------------------

    return () => {
      socketRef.current?.disconnect();

      socketRef.current = null;
    };
  }, []);

  // ===================================================
  // ENVOYER MESSAGE TEXTE
  // ===================================================

  const handleSend = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Votre session a expiré. Veuillez vous reconnecter."
        );

        return;
      }

      const response =
        await axios.post(
          `${API_URL}/api/messages`,
          {
            content:
              content.trim(),

            type: "text",
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      // Ajouter seulement si Socket.IO
      // ne l'a pas déjà ajouté
      addMessage(
        response.data.message
      );

      setContent("");

      scrollToBottom();
    } catch (error) {
      console.error(
        "Erreur envoi message :",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Impossible d'envoyer le message."
      );
    }
  };

  // ===================================================
  // CHOISIR PHOTO / VIDEO
  // ===================================================

  const handleChooseMedia = (
    type
  ) => {
    setMediaType(type);

    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
  };

  // ===================================================
  // ENVOYER PHOTO / VIDEO
  // ===================================================

  const handleMediaChange = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // -------------------------------------------------
    // VÉRIFIER IMAGE
    // -------------------------------------------------

    if (
      mediaType === "image" &&
      !file.type.startsWith("image/")
    ) {
      alert(
        "Veuillez sélectionner une image."
      );

      event.target.value = "";

      return;
    }

    // -------------------------------------------------
    // VÉRIFIER VIDEO
    // -------------------------------------------------

    if (
      mediaType === "video" &&
      !file.type.startsWith("video/")
    ) {
      alert(
        "Veuillez sélectionner une vidéo."
      );

      event.target.value = "";

      return;
    }

    // -------------------------------------------------
    // LIMITE 100 MB
    // -------------------------------------------------

    if (
      file.size >
      100 * 1024 * 1024
    ) {
      alert(
        "Le fichier ne doit pas dépasser 100 MB."
      );

      event.target.value = "";

      return;
    }

    try {
      setSendingMedia(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Votre session a expiré."
        );

        return;
      }

      // -------------------------------------------------
      // FORMDATA
      // -------------------------------------------------

      const formData =
        new FormData();

      /*
       IMPORTANT :

       Le backend utilise :

       uploadMedia.single("media")

       Donc ici il faut utiliser "media"
       et NON "file".
      */

      formData.append(
        "media",
        file
      );

      formData.append(
        "type",
        mediaType
      );

      // -------------------------------------------------
      // ENVOI
      // -------------------------------------------------

      const response =
        await axios.post(
          `${API_URL}/api/messages/media`,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      // -------------------------------------------------
      // AJOUTER MESSAGE
      // -------------------------------------------------

      addMessage(
        response.data.message
      );

      scrollToBottom();
    } catch (error) {
      console.error(
        "Erreur envoi média :",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Impossible d'envoyer le fichier."
      );
    } finally {
      setSendingMedia(false);

      event.target.value = "";
    }
  };

  // ===================================================
  // COMMENCER ENREGISTREMENT VOCAL
  // ===================================================

  const startRecording = async () => {
    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
          .getUserMedia
      ) {
        alert(
          "Votre navigateur ne permet pas l'accès au microphone."
        );

        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      let mimeType =
        "audio/webm";

      if (
        MediaRecorder.isTypeSupported(
          "audio/webm;codecs=opus"
        )
      ) {
        mimeType =
          "audio/webm;codecs=opus";
      } else if (
        MediaRecorder.isTypeSupported(
          "audio/ogg;codecs=opus"
        )
      ) {
        mimeType =
          "audio/ogg;codecs=opus";
      }

      const recorder =
        new MediaRecorder(
          stream,
          {
            mimeType,
          }
        );

      const chunks = [];

      recorder.ondataavailable = (
        event
      ) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          chunks.push(
            event.data
          );
        }
      };

      recorder.onstop = async () => {
        const audioBlob =
          new Blob(
            chunks,
            {
              type:
                recorder.mimeType ||
                "audio/webm",
            }
          );

        await sendAudio(
          audioBlob
        );

        stream
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );
      };

      recorder.start();

      setMediaRecorder(
        recorder
      );

      setRecording(true);
    } catch (error) {
      console.error(
        "Erreur microphone :",
        error
      );

      if (
        error.name ===
        "NotFoundError"
      ) {
        alert(
          "Aucun microphone n'a été trouvé."
        );
      } else if (
        error.name ===
        "NotAllowedError"
      ) {
        alert(
          "L'accès au microphone a été refusé."
        );
      } else {
        alert(
          "Impossible d'accéder au microphone."
        );
      }
    }
  };

  // ===================================================
  // ARRÊTER ENREGISTREMENT
  // ===================================================

  const stopRecording = () => {
    if (
      mediaRecorder &&
      mediaRecorder.state !==
        "inactive"
    ) {
      mediaRecorder.stop();
    }

    setRecording(false);

    setMediaRecorder(null);
  };

  // ===================================================
  // ENVOYER AUDIO
  // ===================================================

  const sendAudio = async (
    audioBlob
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Votre session a expiré."
        );

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "audio",
        audioBlob,
        "message.webm"
      );

      const response =
        await axios.post(
          `${API_URL}/api/messages/audio`,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      addMessage(
        response.data.message
      );

      scrollToBottom();
    } catch (error) {
      console.error(
        "Erreur audio :",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Impossible d'envoyer le vocal."
      );
    }
  };

  // ===================================================
  // URL DES FICHIERS
  // ===================================================

  const getFileUrl = (
    fileUrl
  ) => {
    if (!fileUrl) {
      return null;
    }

    if (
      fileUrl.startsWith(
        "http://"
      ) ||
      fileUrl.startsWith(
        "https://"
      )
    ) {
      return fileUrl;
    }

    if (
      fileUrl.startsWith("/")
    ) {
      return `${API_URL}${fileUrl}`;
    }

    return `${API_URL}/${fileUrl}`;
  };

  // ===================================================
  // DÉTERMINER SI LE MESSAGE EST LE MIEN
  // ===================================================

  const isMyMessage = (
    message
  ) => {
    if (
      !currentUserId ||
      !message?.sender
    ) {
      return false;
    }

    const senderId =
      typeof message.sender ===
      "object"
        ? message.sender._id
        : message.sender;

    return (
      String(senderId) ===
      String(currentUserId)
    );
  };

  // ===================================================
  // AFFICHER LE CONTENU
  // ===================================================

  const renderMessageContent = (
    message
  ) => {
    // -------------------------------------------------
    // MESSAGE TEXTE
    // -------------------------------------------------

    if (
      message.type === "text"
    ) {
      return (
        <p className="whitespace-pre-wrap text-sm break-words">
          {message.content}
        </p>
      );
    }

    // -------------------------------------------------
    // URL FICHIER
    // -------------------------------------------------

    const fileUrl =
      getFileUrl(
        message.fileUrl
      );

    // -------------------------------------------------
    // IMAGE
    // -------------------------------------------------

    if (
      message.type === "image"
    ) {
      if (!fileUrl) {
        return (
          <p className="text-sm italic opacity-70">
            Image indisponible
          </p>
        );
      }

      return (
        <div className="overflow-hidden rounded-2xl">
          <img
            src={fileUrl}
            alt="Photo envoyée"
            className="block max-h-[400px] max-w-full rounded-2xl object-cover"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
          />
        </div>
      );
    }

    // -------------------------------------------------
    // VIDEO
    // -------------------------------------------------

    if (
      message.type === "video"
    ) {
      if (!fileUrl) {
        return (
          <p className="text-sm italic opacity-70">
            Vidéo indisponible
          </p>
        );
      }

      return (
        <video
          src={fileUrl}
          controls
          preload="metadata"
          className="max-h-[400px] max-w-full rounded-2xl"
        >
          Votre navigateur ne supporte pas
          la lecture vidéo.
        </video>
      );
    }

    // -------------------------------------------------
    // AUDIO
    // -------------------------------------------------

    if (
      message.type === "audio"
    ) {
      /*
       Le backend audio peut utiliser audioUrl.
       On utilise donc audioUrl en priorité,
       puis fileUrl comme solution de secours.
      */

      const audioUrl =
        getFileUrl(
          message.audioUrl ||
          message.fileUrl
        );

      if (!audioUrl) {
        return (
          <p className="text-sm italic opacity-70">
            Audio indisponible
          </p>
        );
      }

      return (
        <div className="min-w-[220px]">
          <audio
            src={audioUrl}
            controls
            className="w-full"
          >
            Votre navigateur ne supporte pas
            la lecture audio.
          </audio>
        </div>
      );
    }

    // -------------------------------------------------
    // AUTRE FICHIER
    // -------------------------------------------------

    if (!fileUrl) {
      return (
        <p className="text-sm italic opacity-70">
          Fichier indisponible
        </p>
      );
    }

    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        className="underline text-sm"
      >
        Voir le fichier
      </a>
    );
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col overflow-hidden rounded-3xl bg-white shadow-sm">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="border-b border-gray-100 bg-white p-5">
        <h1 className="text-xl font-bold text-gray-800">
          Messages ❤️
        </h1>

        <p className="text-sm text-gray-500">
          Votre conversation privée
        </p>
      </div>

      {/* ========================================= */}
      {/* LISTE DES MESSAGES */}
      {/* ========================================= */}

      <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4 sm:p-6">

        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-gray-400">
              Chargement...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-5xl">
                ❤️
              </div>

              <p className="mt-3 font-semibold text-gray-700">
                Votre histoire commence ici
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Envoyez votre premier message.
              </p>
            </div>
          </div>
        ) : (
          messages.map(
            (message) => {
              const mine =
                isMyMessage(
                  message
                );

              return (
                <div
                  key={
                    message._id
                  }
                  className={`flex w-full ${
                    mine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                      mine
                        ? "rounded-br-md bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        : "rounded-bl-md bg-white text-gray-800"
                    }`}
                  >

                    {/* ================================= */}
                    {/* NOM EXPÉDITEUR */}
                    {/* ================================= */}

                    {!mine &&
                      message.sender && (
                        <p className="mb-1 text-xs font-semibold text-pink-500">
                          {
                            message
                              .sender
                              .name
                          }
                        </p>
                      )}

                    {/* ================================= */}
                    {/* CONTENU */}
                    {/* ================================= */}

                    {renderMessageContent(
                      message
                    )}

                    {/* ================================= */}
                    {/* HEURE */}
                    {/* ================================= */}

                    <p
                      className={`mt-2 text-right text-[10px] ${
                        mine
                          ? "text-white/70"
                          : "text-gray-400"
                      }`}
                    >
                      {message.createdAt
                        ? new Date(
                            message.createdAt
                          ).toLocaleTimeString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute:
                                "2-digit",
                            }
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              );
            }
          )
        )}

        <div
          ref={
            messagesEndRef
          }
        />
      </div>

      {/* ========================================= */}
      {/* FORMULAIRE */}
      {/* ========================================= */}

      <form
        onSubmit={
          handleSend
        }
        className="border-t border-gray-100 bg-white p-3 sm:p-4"
      >
        <div className="flex items-center gap-2">

          {/* ================================= */}
          {/* INPUT FICHIER */}
          {/* ================================= */}

          <input
            ref={
              fileInputRef
            }
            type="file"
            accept={
              mediaType ===
              "video"
                ? "video/*"
                : "image/*"
            }
            onChange={
              handleMediaChange
            }
            className="hidden"
          />

          {/* ================================= */}
          {/* PHOTO */}
          {/* ================================= */}

          <button
            type="button"
            onClick={() =>
              handleChooseMedia(
                "image"
              )
            }
            disabled={
              sendingMedia
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition hover:bg-pink-100 disabled:opacity-50"
            title="Envoyer une photo"
          >
            <ImageIcon
              size={20}
            />
          </button>

          {/* ================================= */}
          {/* VIDEO */}
          {/* ================================= */}

          <button
            type="button"
            onClick={() =>
              handleChooseMedia(
                "video"
              )
            }
            disabled={
              sendingMedia
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition hover:bg-purple-100 disabled:opacity-50"
            title="Envoyer une vidéo"
          >
            <Video
              size={20}
            />
          </button>

          {/* ================================= */}
          {/* VOCAL */}
          {/* ================================= */}

          <button
            type="button"
            onClick={
              recording
                ? stopRecording
                : startRecording
            }
            disabled={
              sendingMedia
            }
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
              recording
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title={
              recording
                ? "Arrêter l'enregistrement"
                : "Message vocal"
            }
          >
            {recording ? (
              <Square
                size={18}
              />
            ) : (
              <Mic
                size={20}
              />
            )}
          </button>

          {/* ================================= */}
          {/* CHAMP TEXTE */}
          {/* ================================= */}

          <input
            type="text"
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
            placeholder={
              recording
                ? "Enregistrement en cours..."
                : "Écrivez un message..."
            }
            disabled={
              recording ||
              sendingMedia
            }
            className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-pink-500"
          />

          {/* ================================= */}
          {/* BOUTON ENVOYER */}
          {/* ================================= */}

          <button
            type="submit"
            disabled={
              !content.trim() ||
              recording ||
              sendingMedia
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-5"
          >
            <Send
              size={19}
            />

            <span className="ml-2 hidden sm:inline">
              Envoyer
            </span>
          </button>
        </div>

        {/* ========================================= */}
        {/* UPLOAD */}
        {/* ========================================= */}

        {sendingMedia && (
          <p className="mt-2 text-center text-xs text-gray-400">
            📤 Envoi du fichier en cours...
          </p>
        )}

        {/* ========================================= */}
        {/* ENREGISTREMENT */}
        {/* ========================================= */}

        {recording && (
          <p className="mt-2 text-center text-xs font-medium text-red-500">
            🔴 Enregistrement en cours...
            Cliquez sur le bouton microphone
            pour arrêter.
          </p>
        )}
      </form>
    </div>
  );
};

export default Messages;