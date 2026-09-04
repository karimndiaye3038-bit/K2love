
import { Link } from "react-router-dom";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

function ForgotPassword() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#100014] via-[#26002f] to-[#09000d] px-6 text-white">

      <div className="absolute left-6 top-6">
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <FaArrowLeft />
          Retour
        </Link>
      </div>

      <div className="flex min-h-screen items-center justify-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >

          <div className="mb-8 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-xl font-bold">
              K²
            </div>

            <h1 className="text-3xl font-bold">
              Mot de passe oublié ?
            </h1>

            <p className="mt-2 text-gray-400">
              Nous vous aiderons à retrouver votre compte.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

            <form className="space-y-5">

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Adresse email
                </label>

                <input
                  type="email"
                  placeholder="vous@example.com"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition placeholder:text-gray-600 focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold transition hover:scale-[1.02]"
              >
                <FaEnvelope />
                Envoyer le lien
              </button>

            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Vous vous souvenez de votre mot de passe ?

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

export default ForgotPassword;

