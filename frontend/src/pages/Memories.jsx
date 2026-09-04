import { Heart } from "lucide-react";

const Memories = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Nos souvenirs ❤️
        </h1>

        <p className="mt-2 text-gray-500">
          Conservez les moments les plus précieux de votre histoire.
        </p>
      </div>

      <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-pink-100 bg-white shadow-sm">

        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-100 text-pink-500">
            <Heart size={38} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-800">
            Notre histoire
          </h2>

          <p className="mt-2 text-gray-500">
            Vos souvenirs seront conservés ici.
          </p>

        </div>

      </div>

    </div>
  );
};

export default Memories;