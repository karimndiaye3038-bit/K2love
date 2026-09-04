import { Heart, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
const InvitationCard = ({
  invitation,
  onAccept,
  onReject,
}) => {
  const sender = invitation.sender;

  return (
    <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">

      <div className="flex items-center gap-4">

        {/* Avatar */}
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-xl font-bold text-white">

          {sender?.avatar ? (
            <img
              src={sender.avatar}
              alt={sender.name}
              className="h-full w-full object-cover"
            />
          ) : (
            sender?.name?.charAt(0).toUpperCase()
          )}

        </div>

        {/* Texte */}
        <div className="flex-1">

          <h3 className="font-bold text-gray-800">
            {sender?.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            souhaite devenir votre partenaire
          </p>

        </div>

        <Heart
          size={24}
          className="text-pink-500"
          fill="currentColor"
        />

      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-3">

        <button
          type="button"
          onClick={() => onAccept(invitation)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white transition hover:scale-[1.02]"
        >
          <Check size={18} />
          Accepter ❤️
        </button>

        <button
          type="button"
          onClick={() => onReject(invitation)}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          <X size={18} />
          Refuser
        </button>

      </div>

    </div>
  );
};

export default InvitationCard;