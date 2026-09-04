import {
  BarChart3,
  MessageCircle,
  Image,
  Phone,
} from "lucide-react";

const Statistics = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Nos statistiques 📊
        </h1>

        <p className="mt-2 text-gray-500">
          Découvrez votre activité sur K2Love.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-pink-100">
          <MessageCircle className="text-pink-500" />
          <p className="mt-4 text-sm text-gray-500">
            Messages
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            0
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-pink-100">
          <Image className="text-purple-500" />
          <p className="mt-4 text-sm text-gray-500">
            Photos
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            0
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-pink-100">
          <Phone className="text-pink-500" />
          <p className="mt-4 text-sm text-gray-500">
            Appels
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            0
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-pink-100">
          <BarChart3 className="text-purple-500" />
          <p className="mt-4 text-sm text-gray-500">
            Jours ensemble
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            0
          </h2>
        </div>

      </div>

    </div>
  );
};

export default Statistics;