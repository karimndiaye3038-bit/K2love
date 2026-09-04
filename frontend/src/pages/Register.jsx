
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";

import { registerUser } from "../services/authService";

function Register() {

  // ========================================
  // ÉTATS
  // ========================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  // ========================================
  // GESTION DES INPUTS
  // ========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };


  // ========================================
  // INSCRIPTION
  // ========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // Vérifier les mots de passe

    if (formData.password !== formData.confirmPassword) {

      setError(
        "Les mots de passe ne correspondent pas."
      );

      return;
    }


    // Vérifier longueur

    if (formData.password.length < 6) {

      setError(
        "Le mot de passe doit contenir au moins 6 caractères."
      );

      return;
    }


    try {

      setLoading(true);


      // Envoyer au backend

      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });


      console.log("Utilisateur créé :", data);


      setSuccess(
        "Compte K2Love créé avec succès ❤️"
      );


      // Vider le formulaire

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });


      // Redirection après 2 secondes

      setTimeout(() => {

        navigate("/login");

      }, 2000);


    } catch (error) {

      console.error(error);


      if (error.response) {

        setError(
          error.response.data.message ||
          "Une erreur est survenue."
        );

      } else {

        setError(
          "Impossible de contacter le serveur."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // INTERFACE
  // ========================================

  return (

    <main className="min-h-screen bg-gradient-to-br from-[#100014] via-[#26002f] to-[#09000d] px-6 text-white">

      {/* Retour */}

      <div className="absolute left-6 top-6">

        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >

          <FaArrowLeft />

          Retour

        </Link>

      </div>


      <div className="flex min-h-screen items-center justify-center py-16">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="w-full max-w-md"
        >

          {/* Logo */}

          <div className="mb-8 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-xl font-bold shadow-xl shadow-pink-500/20">

              K²

            </div>


            <h1 className="text-3xl font-bold">

              Créez votre histoire ❤️

            </h1>


            <p className="mt-2 text-gray-400">

              Commencez votre espace K2Love.

            </p>

          </div>


          {/* Formulaire */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

            {/* ERREUR */}

            {error && (

              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">

                {error}

              </div>

            )}


            {/* SUCCÈS */}

            {success && (

              <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">

                {success}

              </div>

            )}


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NOM */}

              <div>

                <label className="mb-2 block text-sm text-gray-300">

                  Votre nom

                </label>


                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Karim"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-pink-500"
                />

              </div>


              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-sm text-gray-300">

                  Adresse email

                </label>


                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vous@example.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-pink-500"
                />

              </div>


              {/* MOT DE PASSE */}

              <div>

                <label className="mb-2 block text-sm text-gray-300">

                  Mot de passe

                </label>


                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-pink-500"
                />

              </div>


              {/* CONFIRMATION */}

              <div>

                <label className="mb-2 block text-sm text-gray-300">

                  Confirmer le mot de passe

                </label>


                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-pink-500"
                />

              </div>


              {/* BOUTON */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >

                <FaUserPlus />

                {loading
                  ? "Création du compte..."
                  : "Créer mon compte"
                }

              </button>

            </form>


            {/* CONNEXION */}

            <p className="mt-6 text-center text-sm text-gray-400">

              Vous avez déjà un compte ?

              <Link
                to="/login"
                className="ml-1 font-semibold text-pink-400 hover:text-pink-300"
              >

                Se connecter

              </Link>

            </p>

          </div>

        </motion.div>

      </div>

    </main>

  );
}

export default Register;
