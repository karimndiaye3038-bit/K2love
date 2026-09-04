
import { motion } from "framer-motion";
import { FaArrowRight, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-[#100014] via-[#26002f] to-[#09000d] text-white">

      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 font-bold">
            K²
          </div>

          <span className="text-xl font-bold">
            K2Love
          </span>
        </div>

        {/* Connexion */}
        <Link
          to="/login"
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm backdrop-blur-md transition hover:bg-white/10"
        >
          Se connecter
        </Link>

      </nav>

      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[calc(100vh-90px)] items-center justify-center px-6">

        {/* Animation lumineuse */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="absolute h-72 w-72 rounded-full bg-pink-600/20 blur-3xl"
        />

        {/* Contenu */}
        <div className="relative z-10 max-w-4xl text-center">

          {/* ================= LOGO ================= */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 text-3xl font-bold shadow-2xl shadow-pink-500/30">
              K²
            </div>
          </motion.div>

          {/* ================= TITRE ================= */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-black tracking-tight md:text-7xl"
          >
            K2

            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Love
            </span>

            <span className="ml-2">
              ❤️
            </span>
          </motion.h1>

          {/* ================= SLOGAN ================= */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl"
          >
            Deux cœurs, une histoire.

            <br />

            <span className="text-gray-400">
              Chaque instant, chaque souvenir, chaque émotion…
              ensemble. ❤️
            </span>
          </motion.p>

          {/* ================= BOUTONS ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
          >

            {/* Commencer → Inscription */}
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 font-semibold shadow-xl shadow-pink-500/20 transition hover:scale-105"
            >
              Commencer

              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Découvrir */}
            <button
              type="button"
              className="rounded-full border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur-md transition hover:bg-white/10"
            >
              Découvrir K2Love
            </button>

          </motion.div>

          {/* ================= SECURITE ================= */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500"
          >

            <FaLock />

            <span>
              Votre espace privé, rien que pour vous deux.
            </span>

          </motion.div>

        </div>

      </section>

    </main>
  );
}

export default Home;
