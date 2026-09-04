import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Paramètres ⚙️
        </h1>

        <p className="mt-2 text-gray-500">
          Gérez votre compte et votre confidentialité.
        </p>
      </div>

      <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-500">
            <SettingsIcon size={27} />
          </div>

          <div>
            <h2 className="font-bold text-gray-800">
              Paramètres K2Love
            </h2>

            <p className="text-sm text-gray-500">
              Cette section sera développée prochainement.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;