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
  Phone,
  PhoneCall,
  PhoneOff,
  Video as VideoIcon,
} from "lucide-react";

import { io } from "socket.io-client";

// =====================================================
// CONFIG
// =====================================================

const API_URL =
  "https://k2love-backend.onrender.com";

// =====================================================
// COMPOSANT
// =====================================================

const Messages = () => {
  // ===================================================
  // MESSAGES
  // ===================================================

  const [messages, setMessages] = useState([]);

  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);

  const [sendingMedia, setSendingMedia] =
    useState(false);

  // ===================================================
  // AUDIO RECORDING
  // ===================================================

  const [recording, setRecording] =
    useState(false);

  const [mediaRecorder, setMediaRecorder] =
    useState(null);

  // ===================================================
  // USER
  // ===================================================

  const [currentUserId, setCurrentUserId] =
    useState(null);

  const [partnerId, setPartnerId] =
    useState(null);

  // ===================================================
  // APPEL
  // ===================================================

  const [callState, setCallState] =
    useState("idle");

  const [callType, setCallType] =
    useState(null);

  const [incomingCall, setIncomingCall] =
    useState(null);

  // ===================================================
  // REFS
  // ===================================================

  const socketRef = useRef(null);

  const messagesEndRef = useRef(null);

  const fileInputRef = useRef(null);

  const mediaTypeRef = useRef("image");

  const peerConnectionRef = useRef(null);

  const localStreamRef = useRef(null);

  const remoteStreamRef = useRef(null);

  const remoteAudioRef = useRef(null);

  const remoteVideoRef = useRef(null);

  const localVideoRef = useRef(null);

  // ICE reçus avant que la connexion soit prête
  const pendingIceCandidatesRef = useRef([]);

  // ===================================================
  // USER ID DEPUIS JWT
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

      const payload =
        JSON.parse(
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
        "❌ JWT :",
        error
      );

      return null;
    }
  };

  // ===================================================
  // SCROLL
  // ===================================================

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  // ===================================================
  // ADD MESSAGE
  // ===================================================

  const addMessage = (newMessage) => {
    if (!newMessage) {
      return;
    }

    setMessages((current) => {
      const exists = current.some(
        (message) =>
          String(message._id) ===
          String(newMessage._id)
      );

      if (exists) {
        return current;
      }

      return [
        ...current,
        newMessage,
      ];
    });

    scrollToBottom();
  };

  // ===================================================
  // GET MESSAGES
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
        "❌ Erreur messages :",
        error.response?.data ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // CLEANUP APPEL
  // ===================================================

  const cleanupCall = () => {
    console.log(
      "🧹 Nettoyage appel"
    );

    // -------------------------------------------------
    // Local stream
    // -------------------------------------------------

    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      localStreamRef.current = null;
    }

    // -------------------------------------------------
    // Peer connection
    // -------------------------------------------------

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();

      peerConnectionRef.current = null;
    }

    // -------------------------------------------------
    // Remote
    // -------------------------------------------------

    remoteStreamRef.current = null;

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject =
        null;
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject =
        null;
    }

    // -------------------------------------------------
    // Local video
    // -------------------------------------------------

    if (localVideoRef.current) {
      localVideoRef.current.srcObject =
        null;
    }

    // -------------------------------------------------
    // ICE
    // -------------------------------------------------

    pendingIceCandidatesRef.current = [];

    // -------------------------------------------------
    // State
    // -------------------------------------------------

    setCallState("idle");

    setCallType(null);

    setIncomingCall(null);
  };

  // ===================================================
  // SOCKET
  // ===================================================

  useEffect(() => {
    const userId =
      getCurrentUserId();

    if (!userId) {
      setLoading(false);

      return;
    }

    setCurrentUserId(userId);

    fetchMessages();

    const token =
      localStorage.getItem("token");

    if (!token) {
      return;
    }

    // -------------------------------------------------
    // SOCKET
    // -------------------------------------------------

    const socket = io(API_URL, {
      auth: {
        token,
      },

      transports: [
        "websocket",
        "polling",
      ],
    });

    socketRef.current = socket;

    // -------------------------------------------------
    // CONNECTION
    // -------------------------------------------------

    socket.on(
      "connect",
      () => {
        console.log(
          "🟢 Socket connecté :",
          socket.id
        );

        socket.emit(
          "registerUser",
          userId
        );
      }
    );

    // -------------------------------------------------
    // REGISTERED
    // -------------------------------------------------

    socket.on(
      "user-registered",
      (data) => {
        console.log(
          "👤 Utilisateur enregistré :",
          data
        );

        if (data?.partnerId) {
          setPartnerId(
            data.partnerId
          );

          console.log(
            "❤️ Partenaire trouvé :",
            data.partnerId
          );
        } else {
          console.log(
            "⚠️ Aucun partenaire trouvé"
          );
        }
      }
    );

    // -------------------------------------------------
    // NEW MESSAGE
    // -------------------------------------------------

    socket.on(
      "newMessage",
      (message) => {
        addMessage(message);
      }
    );

    // =================================================
    // APPEL ENTRANT
    // =================================================

    socket.on(
      "incoming-call",
      ({
        from,
        to,
        type,
        offer,
      }) => {
        console.log(
          "📞 Appel entrant :",
          {
            from,
            to,
            type,
          }
        );

        setIncomingCall({
          from,
          to,
          type,
          offer,
        });

        setCallType(
          type || "audio"
        );

        setCallState(
          "incoming"
        );
      }
    );

    // =================================================
    // APPEL ACCEPTÉ
    // =================================================

    socket.on(
      "call-answered",
      async ({
        from,
        answer,
      }) => {
        try {
          console.log(
            "📞 Réponse reçue"
          );

          const peer =
            peerConnectionRef.current;

          if (!peer) {
            console.error(
              "❌ PeerConnection inexistante"
            );

            return;
          }

          await peer.setRemoteDescription(
            new RTCSessionDescription(
              answer
            )
          );

          // Ajouter les ICE en attente
          await flushPendingIceCandidates();

          setCallState(
            "connected"
          );

          console.log(
            "🟢 Appel connecté"
          );
        } catch (error) {
          console.error(
            "❌ Erreur réponse appel :",
            error
          );

          cleanupCall();
        }
      }
    );

    // =================================================
    // ICE
    // =================================================

    socket.on(
      "ice-candidate",
      async ({
        from,
        candidate,
      }) => {
        try {
          if (!candidate) {
            return;
          }

          const peer =
            peerConnectionRef.current;

          if (!peer) {
            pendingIceCandidatesRef.current.push(
              candidate
            );

            return;
          }

          // Si remoteDescription pas encore prête,
          // on garde le candidat
          if (
            !peer.remoteDescription
          ) {
            pendingIceCandidatesRef.current.push(
              candidate
            );

            return;
          }

          await peer.addIceCandidate(
            new RTCIceCandidate(
              candidate
            )
          );
        } catch (error) {
          console.error(
            "❌ Erreur ICE :",
            error
          );
        }
      }
    );

    // =================================================
    // APPEL REFUSÉ
    // =================================================

    socket.on(
      "call-rejected",
      () => {
        alert(
          "Votre partenaire a refusé l'appel."
        );

        cleanupCall();
      }
    );

    // =================================================
    // APPEL TERMINÉ
    // =================================================

    socket.on(
      "call-ended",
      () => {
        cleanupCall();
      }
    );

    // =================================================
    // PARTENAIRE HORS LIGNE
    // =================================================

    socket.on(
      "user-offline",
      () => {
        alert(
          "Votre partenaire n'est pas connecté."
        );

        cleanupCall();
      }
    );

    // =================================================
    // PARTENAIRE INTROUVABLE
    // =================================================

    socket.on(
      "partner-not-found",
      () => {
        alert(
          "Aucun partenaire n'est associé à votre compte."
        );

        cleanupCall();
      }
    );

    // =================================================
    // ERREUR APPEL
    // =================================================

    socket.on(
      "call-error",
      (data) => {
        console.error(
          "❌ Call error :",
          data
        );

        alert(
          data?.message ||
            "Impossible de démarrer l'appel."
        );

        cleanupCall();
      }
    );

    // =================================================
    // DISCONNECT
    // =================================================

    socket.on(
      "disconnect",
      (reason) => {
        console.log(
          "🔴 Socket déconnecté :",
          reason
        );
      }
    );

    // =================================================
    // CLEANUP
    // =================================================

    return () => {
      socket.removeAllListeners();

      socket.disconnect();

      socketRef.current = null;

      cleanupCall();
    };
  }, []);

  // ===================================================
  // FLUSH ICE
  // ===================================================

  const flushPendingIceCandidates =
    async () => {
      const peer =
        peerConnectionRef.current;

      if (!peer) {
        return;
      }

      if (!peer.remoteDescription) {
        return;
      }

      const candidates =
        pendingIceCandidatesRef.current;

      pendingIceCandidatesRef.current = [];

      for (
        const candidate of candidates
      ) {
        try {
          await peer.addIceCandidate(
            new RTCIceCandidate(
              candidate
            )
          );
        } catch (error) {
          console.error(
            "❌ ICE pending :",
            error
          );
        }
      }
    };

  // ===================================================
  // TEXTE
  // ===================================================

  const handleSend = async (event) => {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Votre session a expiré."
        );

        return;
      }

      const response =
        await axios.post(
          `${API_URL}/api/messages`,
          {
            content:
              content.trim(),
          },
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

      setContent("");
    } catch (error) {
      console.error(
        "❌ Message :",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Impossible d'envoyer le message."
      );
    }
  };

  // ===================================================
  // CHOISIR MÉDIA
  // ===================================================

  const handleChooseMedia =
    (type) => {
      mediaTypeRef.current =
        type;

      setTimeout(() => {
        fileInputRef.current?.click();
      }, 0);
    };

  // ===================================================
  // MÉDIA
  // ===================================================

  const handleMediaChange =
    async (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      const selectedType =
        mediaTypeRef.current;

      // ------------------------------------------------
      // IMAGE
      // ------------------------------------------------

      if (
        selectedType ===
          "image" &&
        !file.type.startsWith(
          "image/"
        )
      ) {
        alert(
          "Veuillez sélectionner une image."
        );

        event.target.value = "";

        return;
      }

      // ------------------------------------------------
      // VIDEO
      // ------------------------------------------------

      if (
        selectedType ===
          "video" &&
        !file.type.startsWith(
          "video/"
        )
      ) {
        alert(
          "Veuillez sélectionner une vidéo."
        );

        event.target.value = "";

        return;
      }

      // ------------------------------------------------
      // SIZE
      // ------------------------------------------------

      if (
        file.size >
        50 * 1024 * 1024
      ) {
        alert(
          "Maximum 50 MB."
        );

        event.target.value = "";

        return;
      }

      try {
        setSendingMedia(true);

        const token =
          localStorage.getItem("token");

        if (!token) {
          return;
        }

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "type",
          selectedType
        );

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

        addMessage(
          response.data.message
        );
      } catch (error) {
        console.error(
          "❌ Média :",
          error.response?.data ||
            error.message
        );

        alert(
          error.response?.data
            ?.message ||
            "Impossible d'envoyer le fichier."
        );
      } finally {
        setSendingMedia(false);

        event.target.value = "";
      }
    };

  // ===================================================
  // ENREGISTREMENT AUDIO
  // ===================================================

  const startRecording =
    async () => {
      try {
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
        }

        const recorder =
          new MediaRecorder(
            stream,
            {
              mimeType,
            }
          );

        const chunks = [];

        recorder.ondataavailable =
          (event) => {
            if (
              event.data &&
              event.data.size
            ) {
              chunks.push(
                event.data
              );
            }
          };

        recorder.onstop =
          async () => {
            const blob =
              new Blob(
                chunks,
                {
                  type:
                    recorder.mimeType ||
                    "audio/webm",
                }
              );

            await sendAudio(blob);

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
          "❌ Microphone :",
          error
        );

        alert(
          "Impossible d'accéder au microphone."
        );
      }
    };

  // ===================================================
  // STOP RECORDING
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
  // SEND AUDIO
  // ===================================================

  const sendAudio = async (
    audioBlob
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        return;
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        audioBlob,
        "message.webm"
      );

      formData.append(
        "type",
        "audio"
      );

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

      addMessage(
        response.data.message
      );
    } catch (error) {
      console.error(
        "❌ Audio :",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data
          ?.message ||
          "Impossible d'envoyer le vocal."
      );
    }
  };

  // ===================================================
  // URL FICHIER
  // ===================================================

  const getFileUrl = (fileUrl) => {
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
  // MON MESSAGE
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
  // CONTENU MESSAGE
  // ===================================================

  const renderMessageContent =
    (message) => {
      if (
        message.type ===
        "text"
      ) {
        return (
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.content}
          </p>
        );
      }

      const fileUrl =
        getFileUrl(
          message.fileUrl
        );

      // ------------------------------------------------
      // IMAGE
      // ------------------------------------------------

      if (
        message.type ===
        "image"
      ) {
        return fileUrl ? (
          <img
            src={fileUrl}
            alt="Photo"
            className="max-h-[400px] max-w-full rounded-2xl object-cover"
          />
        ) : (
          <p>
            Image indisponible
          </p>
        );
      }

      // ------------------------------------------------
      // VIDEO
      // ------------------------------------------------

      if (
        message.type ===
        "video"
      ) {
        return fileUrl ? (
          <video
            src={fileUrl}
            controls
            preload="metadata"
            className="max-h-[400px] max-w-full rounded-2xl"
          />
        ) : (
          <p>
            Vidéo indisponible
          </p>
        );
      }

      // ------------------------------------------------
      // AUDIO
      // ------------------------------------------------

      if (
        message.type ===
        "audio"
      ) {
        const audioUrl =
          getFileUrl(
            message.audioUrl ||
              message.fileUrl
          );

        return audioUrl ? (
          <audio
            src={audioUrl}
            controls
            className="w-full"
          />
        ) : (
          <p>
            Audio indisponible
          </p>
        );
      }

      return null;
    };

  // ===================================================
  // PEER CONNECTION
  // ===================================================

  const createPeerConnection =
    (targetUserId) => {
      console.log(
        "🔗 Création PeerConnection vers :",
        targetUserId
      );

      const peer =
        new RTCPeerConnection(
          {
            iceServers: [
              {
                urls:
                  "stun:stun.l.google.com:19302",
              },

              {
                urls:
                  "stun:stun1.l.google.com:19302",
              },
            ],
          }
        );

      peerConnectionRef.current =
        peer;

      // ------------------------------------------------
      // ICE
      // ------------------------------------------------

      peer.onicecandidate =
        (event) => {
          if (
            event.candidate
          ) {
            socketRef.current?.emit(
              "ice-candidate",
              {
                to: targetUserId,

                candidate:
                  event.candidate,
              }
            );
          }
        };

      // ------------------------------------------------
      // TRACK
      // ------------------------------------------------

      peer.ontrack =
        (event) => {
          console.log(
            "🎥 Track distante reçue"
          );

          const stream =
            event.streams?.[0];

          if (!stream) {
            return;
          }

          remoteStreamRef.current =
            stream;

          // Vidéo
          if (
            remoteVideoRef.current
          ) {
            remoteVideoRef.current.srcObject =
              stream;
          }

          // Audio
          if (
            remoteAudioRef.current
          ) {
            remoteAudioRef.current.srcObject =
              stream;
          }
        };

      // ------------------------------------------------
      // CONNECTION STATE
      // ------------------------------------------------

      peer.onconnectionstatechange =
        () => {
          console.log(
            "📡 WebRTC state :",
            peer.connectionState
          );

          if (
            peer.connectionState ===
              "connected"
          ) {
            setCallState(
              "connected"
            );
          }

          if (
            peer.connectionState ===
              "failed"
          ) {
            console.error(
              "❌ Connexion WebRTC échouée"
            );

            cleanupCall();
          }

          if (
            peer.connectionState ===
              "disconnected"
          ) {
            console.log(
              "⚠️ WebRTC déconnecté"
            );
          }
        };

      return peer;
    };

  // ===================================================
  // DÉMARRER APPEL
  // ===================================================

  const startCall = async (
    type
  ) => {
    try {
      if (
        callState !==
        "idle"
      ) {
        return;
      }

      const socket =
        socketRef.current;

      if (!socket) {
        alert(
          "La connexion au serveur n'est pas prête."
        );

        return;
      }

      if (!currentUserId) {
        alert(
          "Utilisateur non connecté."
        );

        return;
      }

      // ------------------------------------------------
      // Demander microphone/caméra
      // ------------------------------------------------

      const constraints = {
        audio: true,

        video:
          type === "video",
      };

      console.log(
        "🎙️ Demande média :",
        constraints
      );

      const stream =
        await navigator.mediaDevices.getUserMedia(
          constraints
        );

      localStreamRef.current =
        stream;

      // ------------------------------------------------
      // Afficher vidéo locale
      // ------------------------------------------------

      if (
        localVideoRef.current
      ) {
        localVideoRef.current.srcObject =
          stream;
      }

      // ------------------------------------------------
      // Création Peer
      // ------------------------------------------------

      // Le serveur retrouvera automatiquement
      // le partenaire si "to" est absent.
      //
      // On utilise partnerId si déjà connu,
      // mais aucun ID n'est inventé.

      const targetUserId =
        partnerId || null;

      if (!targetUserId) {
        console.log(
          "ℹ️ PartnerId pas encore reçu. Le serveur va le résoudre."
        );
      }

      const peer =
        createPeerConnection(
          targetUserId
        );

      // ------------------------------------------------
      // Ajouter les tracks
      // ------------------------------------------------

      stream
        .getTracks()
        .forEach(
          (track) => {
            peer.addTrack(
              track,
              stream
            );
          }
        );

      // ------------------------------------------------
      // Créer OFFER
      // ------------------------------------------------

      const offer =
        await peer.createOffer();

      await peer.setLocalDescription(
        offer
      );

      // ------------------------------------------------
      // State
      // ------------------------------------------------

      setCallType(type);

      setCallState(
        "calling"
      );

      // ------------------------------------------------
      // Envoyer au serveur
      // ------------------------------------------------

      socket.emit(
        "call-user",
        {
          // null = le serveur trouve
          // automatiquement le partenaire
          to: targetUserId,

          from:
            currentUserId,

          type,

          offer,
        }
      );

      console.log(
        "📞 Appel envoyé"
      );
    } catch (error) {
      console.error(
        "❌ Démarrage appel :",
        error
      );

      cleanupCall();

      if (
        error.name ===
        "NotAllowedError"
      ) {
        alert(
          "Vous devez autoriser le microphone" +
            (type === "video"
              ? " et la caméra."
              : ".")
        );

        return;
      }

      alert(
        "Impossible de démarrer l'appel."
      );
    }
  };

  // ===================================================
  // ACCEPTER APPEL
  // ===================================================

  const acceptCall = async () => {
    try {
      if (!incomingCall) {
        return;
      }

      const socket =
        socketRef.current;

      if (!socket) {
        return;
      }

      const {
        from,
        type,
        offer,
      } =
        incomingCall;

      console.log(
        "✅ Acceptation appel :",
        {
          from,
          type,
        }
      );

      // ------------------------------------------------
      // Média
      // ------------------------------------------------

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,

            video:
              type === "video",
          }
        );

      localStreamRef.current =
        stream;

      // ------------------------------------------------
      // Vidéo locale
      // ------------------------------------------------

      if (
        localVideoRef.current
      ) {
        localVideoRef.current.srcObject =
          stream;
      }

      // ------------------------------------------------
      // Peer
      // ------------------------------------------------

      const peer =
        createPeerConnection(
          from
        );

      // ------------------------------------------------
      // Ajouter tracks
      // ------------------------------------------------

      stream
        .getTracks()
        .forEach(
          (track) => {
            peer.addTrack(
              track,
              stream
            );
          }
        );

      // ------------------------------------------------
      // Remote offer
      // ------------------------------------------------

      await peer.setRemoteDescription(
        new RTCSessionDescription(
          offer
        )
      );

      // ------------------------------------------------
      // ICE reçus avant offer
      // ------------------------------------------------

      await flushPendingIceCandidates();

      // ------------------------------------------------
      // ANSWER
      // ------------------------------------------------

      const answer =
        await peer.createAnswer();

      await peer.setLocalDescription(
        answer
      );

      // ------------------------------------------------
      // State
      // ------------------------------------------------

      setCallType(type);

      setCallState(
        "connected"
      );

      setIncomingCall(
        null
      );

      // ------------------------------------------------
      // Envoyer answer
      // ------------------------------------------------

      socket.emit(
        "answer-call",
        {
          to: from,

          answer,
        }
      );

      console.log(
        "📞 Réponse envoyée"
      );
    } catch (error) {
      console.error(
        "❌ Acceptation appel :",
        error
      );

      cleanupCall();

      alert(
        "Impossible d'accepter l'appel. Vérifiez les permissions du microphone et de la caméra."
      );
    }
  };

  // ===================================================
  // REFUSER APPEL
  // ===================================================

  const rejectCall = () => {
    if (!incomingCall) {
      return;
    }

    const from =
      incomingCall.from;

    socketRef.current?.emit(
      "reject-call",
      {
        to: from,
      }
    );

    cleanupCall();
  };

  // ===================================================
  // TERMINER APPEL
  // ===================================================

  const endCall = () => {
    // ------------------------------------------------
    // Informer partenaire
    // ------------------------------------------------

    let targetUserId =
      incomingCall?.from ||
      partnerId;

    // Si on connaît le partenaire
    if (targetUserId) {
      socketRef.current?.emit(
        "end-call",
        {
          to: targetUserId,
        }
      );
    } else {
      // Le serveur peut aussi retrouver
      // automatiquement le partenaire
      socketRef.current?.emit(
        "end-call"
      );
    }

    cleanupCall();
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col overflow-hidden rounded-3xl bg-white shadow-sm">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="flex items-center justify-between border-b border-gray-100 bg-white p-5">

        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Messages ❤️
          </h1>

          <p className="text-sm text-gray-500">
            Votre conversation privée
          </p>
        </div>

        {/* APPELS */}

        <div className="flex gap-2">

          {/* AUDIO */}

          <button
            type="button"
            onClick={() =>
              startCall("audio")
            }
            disabled={
              callState !==
              "idle"
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            title="Appel vocal"
          >
            <Phone
              size={18}
            />
          </button>

          {/* VIDEO */}

          <button
            type="button"
            onClick={() =>
              startCall("video")
            }
            disabled={
              callState !==
              "idle"
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            title="Appel vidéo"
          >
            <VideoIcon
              size={18}
            />
          </button>

        </div>
      </div>

      {/* =================================================
          MESSAGES
          ================================================= */}

      <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4 sm:p-6">

        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">
              Chargement...
            </p>
          </div>
        ) : messages.length ===
          0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-5xl">
                ❤️
              </div>

              <p className="mt-3 font-semibold">
                Votre histoire commence ici
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
                  className={`flex ${
                    mine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                      mine
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >

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

                    {renderMessageContent(
                      message
                    )}

                    <p className="mt-2 text-right text-[10px] opacity-60">
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

      {/* =================================================
          FORMULAIRE MESSAGE
          ================================================= */}

      <form
        onSubmit={
          handleSend
        }
        className="border-t border-gray-100 bg-white p-3"
      >

        <div className="flex items-center gap-2">

          {/* FILE INPUT */}

          <input
            ref={
              fileInputRef
            }
            type="file"
            accept={
              mediaTypeRef.current ===
              "video"
                ? "video/*"
                : "image/*"
            }
            onChange={
              handleMediaChange
            }
            className="hidden"
          />

          {/* IMAGE */}

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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600"
          >
            <ImageIcon
              size={20}
            />
          </button>

          {/* VIDEO */}

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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600"
          >
            <Video
              size={20}
            />
          </button>

          {/* AUDIO */}

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
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              recording
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600"
            }`}
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

          {/* INPUT */}

          <input
            type="text"
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
            disabled={
              recording ||
              sendingMedia
            }
            placeholder="Écrivez un message..."
            className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-500"
          />

          {/* SEND */}

          <button
            type="submit"
            disabled={
              !content.trim() ||
              recording ||
              sendingMedia
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white disabled:opacity-50"
          >
            <Send
              size={19}
            />
          </button>

        </div>

        {sendingMedia && (
          <p className="mt-2 text-center text-xs text-gray-400">
            📤 Envoi...
          </p>
        )}

        {recording && (
          <p className="mt-2 text-center text-xs text-red-500">
            🔴 Enregistrement...
          </p>
        )}

      </form>

      {/* =================================================
          APPEL ENTRANT
          ================================================= */}

      {incomingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">

            <div className="text-center">

              <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-pink-100 text-pink-600">

                {incomingCall.type ===
                "video" ? (
                  <VideoIcon
                    size={34}
                  />
                ) : (
                  <PhoneCall
                    size={34}
                  />
                )}

              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-800">
                Appel entrant ❤️
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {incomingCall.type ===
                "video"
                  ? "Votre partenaire vous appelle en vidéo."
                  : "Votre partenaire vous appelle."}
              </p>

              <div className="mt-7 flex justify-center gap-6">

                {/* REFUSER */}

                <button
                  type="button"
                  onClick={
                    rejectCall
                  }
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm transition hover:bg-red-200"
                  title="Refuser"
                >
                  <PhoneOff
                    size={22}
                  />
                </button>

                {/* ACCEPTER */}

                <button
                  type="button"
                  onClick={
                    acceptCall
                  }
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm transition hover:bg-green-200"
                  title="Accepter"
                >
                  <PhoneCall
                    size={22}
                  />
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          APPEL EN COURS
          ================================================= */}

      {callState !==
        "idle" &&
        !incomingCall && (
          <div className="fixed inset-0 z-40 bg-black">

            {/* =================================================
                VIDEO DISTANTE
                ================================================= */}

            <video
              ref={
                remoteVideoRef
              }
              autoPlay
              playsInline
              className={`h-full w-full object-cover ${
                callType ===
                "audio"
                  ? "hidden"
                  : "block"
              }`}
            />

            {/* =================================================
                AUDIO DISTANT
                ================================================= */}

            <audio
              ref={
                remoteAudioRef
              }
              autoPlay
            />

            {/* =================================================
                VIDEO LOCALE
                ================================================= */}

            {callType ===
              "video" && (
              <video
                ref={
                  localVideoRef
                }
                autoPlay
                muted
                playsInline
                className="absolute right-4 top-4 h-40 w-28 rounded-2xl border-2 border-white/30 bg-gray-900 object-cover shadow-xl sm:h-48 sm:w-36"
              />
            )}

            {/* =================================================
                APPEL AUDIO
                ================================================= */}

            {callType ===
              "audio" && (
              <div className="flex h-full items-center justify-center">

                <div className="text-center text-white">

                  <div className="mx-auto flex h-28 w-28 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-2xl">

                    <PhoneCall
                      size={48}
                    />

                  </div>

                  <h2 className="mt-6 text-2xl font-bold">
                    Appel vocal ❤️
                  </h2>

                  <p className="mt-2 text-gray-300">
                    {callState ===
                    "connected"
                      ? "Appel connecté"
                      : "Connexion..."}
                  </p>

                </div>

              </div>
            )}

            {/* =================================================
                STATUS
                ================================================= */}

            <div className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur">

              {callState ===
              "connected"
                ? "🟢 Appel connecté"
                : "📞 Appel en cours..."}

            </div>

            {/* =================================================
                RACCROCHER
                ================================================= */}

            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2">

              <button
                type="button"
                onClick={
                  endCall
                }
                className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl transition hover:bg-red-700"
                title="Raccrocher"
              >
                <PhoneOff
                  size={26}
                />
              </button>

            </div>

          </div>
        )}
    </div>
  );
};

export default Messages;
