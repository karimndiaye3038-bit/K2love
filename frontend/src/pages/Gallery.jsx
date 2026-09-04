import { Image } from "lucide-react";

const Gallery = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Notre galerie 📸
        </h1>

        <p className="mt-2 text-gray-500">
          Tous vos souvenirs photos et vidéos au même endroit.
        </p>
      </div>

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

        </div>

      </div>

    </div>
  );
};

export default Gallery;