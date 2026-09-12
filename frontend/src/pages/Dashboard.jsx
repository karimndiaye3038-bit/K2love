import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import {
  MessageCircle,
  Image,
  Video,
  Phone,
  Heart,
  CalendarDays,
  HeartHandshake,
} from "lucide-react";

import StatCard from "../components/StatCard";
import InvitationModal from "../components/InvitationModal";
import InvitationCard from "../components/InvitationCard";

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  // ========================================
  // ÉTATS
  // ========================================

  const [showInvitation, setShowInvitation] =
    useState(false);

  const [invitations, setInvitations] =
    useState([]);

  const [loadingInvitations, setLoadingInvitations] =
    useState(true);

  // ========================================
  // RÉCUPÉRER LES INVITATIONS
  // ========================================

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          console.log("Token absent.");
          return;
        }

        const response = await axios.get(
         "https://k2love-backend.onrender.com/api/invitations" ,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Invitations :",
          response.data.invitations
        );

        setInvitations(
          response.data.invitations || []
        );

      } catch (error) {
        console.error(
          "Erreur récupération invitations :",
          error.response?.data ||
            error.message
        );

      } finally {
        setLoadingInvitations(false);
      }
    };

    fetchInvitations();
  }, []);

  // ========================================
  // ACCEPTER
  // ========================================

  const handleAcceptInvitation = async (
    invitation
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await axios.post(
     "https://k2love-backend.onrender.com/api/invitations/accept",
        {
          token: invitation.token,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      setInvitations((current) =>
        current.filter(
          (item) =>
            item._id !== invitation._id
        )
      );

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Impossible d'accepter l'invitation."
      );
    }
  };

  // ========================================
  // REFUSER
  // ========================================

  const handleRejectInvitation = (
    invitation
  ) => {
    setInvitations((current) =>
      current.filter(
        (item) =>
          item._id !== invitation._id
      )
    );

    console.log(
      "Invitation refusée :",
      invitation._id
    );
  };

  return (
    <div className="space-y-8">

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 p-8 text-white shadow-xl"
      >

        <div className="relative z-10">

          <p className="mb-2 text-sm font-medium text-pink-100">
            Bienvenue dans votre espace privé
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Bonjour {user?.name || "Karim"} ❤️
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-pink-50 md:text-base">
            Chaque instant, chaque souvenir, chaque émotion…
            ensemble. ❤️
          </p>

        </div>

        {/* Décoration */}
        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10" />

        <div className="absolute -bottom-24 right-20 h-56 w-56 rounded-full bg-white/10" />

        <Heart
          className="absolute right-10 top-10 opacity-20"
          size={100}
        />

      </motion.section>


      {/* STATISTIQUES */}
      <section>

        <div className="mb-5">

          <h2 className="text-xl font-bold text-gray-800">
            Notre espace ❤️
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Vos statistiques de couple
          </p>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Messages"
            value="0"
            description="Messages échangés"
            icon={MessageCircle}
          />

          <StatCard
            title="Photos"
            value="0"
            description="Souvenirs enregistrés"
            icon={Image}
          />

          <StatCard
            title="Vidéos"
            value="0"
            description="Vidéos partagées"
            icon={Video}
          />

          <StatCard
            title="Appels"
            value="0"
            description="Appels effectués"
            icon={Phone}
          />

        </div>

      </section>
      <motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="grid gap-6 lg:grid-cols-2"
>
  {/* Profil */}
  <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-sm">

    <div className="flex items-center gap-4">

      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-xl font-bold text-white">
        {user?.name?.charAt(0).toUpperCase() || "K"}
      </div>

      <div>
        <p className="text-sm text-gray-400">
          Votre profil
        </p>

        <h2 className="text-xl font-bold text-gray-800">
          {user?.name || "Karim"}
        </h2>

        <p className="text-sm text-gray-500">
          {user?.email || "Email non disponible"}
        </p>
      </div>

    </div>

  </div>


  {/* Partenaire */}
  {showInvitation && (
  <InvitationModal
    onClose={() => setShowInvitation(false)}
  />
)}
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 p-8 text-white shadow-lg">

    <HeartHandshake
      size={90}
      className="absolute -right-5 -top-5 opacity-10"
    />

    <div className="relative z-10">

      <p className="text-sm text-pink-100">
        Notre espace
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Votre partenaire ❤️
      </h2>

      <p className="mt-3 text-sm leading-6 text-pink-50">
        Connectez votre partenaire pour commencer
        votre histoire sur K2Love.
      </p>

  <button
  type="button"
  onClick={() => {
    console.log("Bouton invitation cliqué");
    setShowInvitation(true);
  }}
  className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
>
  Inviter mon partenaire ❤️
</button>
    </div>

  </div>

</motion.section>
{invitations.length > 0 && (
  <section>

    <div className="mb-4">

      <h2 className="text-xl font-bold text-gray-800">
        Invitations ❤️
      </h2>

      <p className="text-sm text-gray-500">
        Quelqu'un souhaite partager son espace
        K2Love avec vous.
      </p>

    </div>

    <div className="space-y-4">

      {invitations.map((invitation) => (
        <InvitationCard
          key={invitation._id}
          invitation={invitation}
          onAccept={handleAcceptInvitation}
          onReject={handleRejectInvitation}
        />
      ))}

    </div>

  </section>
)}


      {/* HISTOIRE DU COUPLE */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid gap-6 lg:grid-cols-2"
      >

        {/* Jours ensemble */}
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-pink-100">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-500">
              <Heart size={23} />
            </div>

            <div>

              <h2 className="font-bold text-gray-800">
                Notre histoire
              </h2>

              <p className="text-sm text-gray-400">
                Chaque jour compte ❤️
              </p>

            </div>

          </div>

          <div className="mt-8 text-center">

            <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text">
              0
            </p>

            <p className="mt-2 text-sm text-gray-500">
              jours ensemble
            </p>

          </div>

          <button className="mt-8 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-sm font-semibold text-white transition hover:opacity-90">
            Ajouter notre date ❤️
          </button>

        </div>


        {/* Calendrier */}
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-pink-100">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <CalendarDays size={23} />
            </div>

            <div>

              <h2 className="font-bold text-gray-800">
                Prochains événements
              </h2>

              <p className="text-sm text-gray-400">
                Vos moments importants
              </p>

            </div>

          </div>

          <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-center">

            <p className="text-sm text-gray-400">
              Aucun événement
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Ajoutez votre premier événement ❤️
            </p>

          </div>

          <button className="mt-6 w-full rounded-xl border border-pink-200 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-50">
            Ajouter un événement
          </button>

        </div>

      </motion.section>

    </div>
  );
};

export default Dashboard;