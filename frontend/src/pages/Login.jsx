
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLock,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();


  // ========================================
  // ÉTATS
  // ========================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // ========================================
  // INPUT
  // ========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };


  // ========================================
  // LOGIN
  // ========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");


    try {

      setLoading(true);


      const data = await loginUser({
        email: formData.email,
        password: formData.password,
      });


      // Enregistrer utilisateur + JWT
      login(
        data.user,
        data.token
      );


      // Aller au Dashboard
      navigate("/dashboard");


    } catch (error) {

      console.error(error);

      if (error.response) {

        setError(
          error.response.data.message ||
          "Email ou mot de passe incorrect."
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


      <div className="flex min-h-screen items-center justify-center">

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

              Bon retour ❤️

            </h1>


            <p className="mt-2 text-gray-400">

              Retrouvez votre espace à deux.

            </p>

          </div>


          {/* CARD */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

            {/* ERREUR */}

            {error && (

              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">

                {error}

              </div>

            )}


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

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


              {/* PASSWORD */}

              <div>

                <div className="mb-2 flex justify-between">

                  <label className="text-sm text-gray-300">

                    Mot de passe

                  </label>


                  <Link
                    to="/forgot-password"
                    className="text-sm text-pink-400 hover:text-pink-300"
                  >

                    Mot de passe oublié ?

                  </Link>

                </div>


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


              {/* BOUTON */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >

                <FaLock />

                {loading
                  ? "Connexion..."
                  : "Se connecter"
                }

              </button>

            </form>


            {/* REGISTER */}

            <p className="mt-6 text-center text-sm text-gray-400">

              Vous n'avez pas encore de compte ?

              <Link
                to="/register"
                className="ml-1 font-semibold text-pink-400 hover:text-pink-300"
              >

                Créer un compte

              </Link>

            </p>

          </div>

        </motion.div>

      </div>

    </main>

  );
}

export default Login;

