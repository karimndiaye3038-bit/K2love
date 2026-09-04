const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {value}
          </h2>
        </div>

        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-500">
            <Icon size={24} />
          </div>
        )}

      </div>

    </div>
  );
};

export default StatCard;