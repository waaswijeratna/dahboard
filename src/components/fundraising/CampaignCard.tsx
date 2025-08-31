/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import UserProfileCard from "../UserProfileCard";

type Props = {
  campaign: {
    _id: string;
    title: string;
    reason: string;
    imageUrl: string;
    userId: string;
    requiredAmount: number;
    fundedAmount: number;
    stripeAccountId: string;
    createdAt: string;
  };
};


import { FaTrash } from "react-icons/fa";

const CampaignCard: React.FC<Props & { userRole?: string; onDelete?: (id: string) => void }> = ({ campaign, userRole, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      {/* Delete Icon for super moderators */}
      {userRole === "super" && (
        <button
          className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-700 bg-white rounded-full p-2 shadow"
          onClick={e => {
            e.stopPropagation();
            if (onDelete) onDelete(campaign._id);
          }}
        >
          <FaTrash />
        </button>
      )}
      {/* Card */}
      <div
        className="p-4 w-full h-full rounded-lg shadow-md bg-white text-black cursor-pointer hover:shadow-lg transition"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="w-full h-40 object-cover rounded mb-4"
        />
        <h3 className="text-lg font-semibold mb-1">{campaign.title}</h3>
        {/* Truncated description */}
        <p className="text-gray-400 mb-2 text-sm truncate">{campaign.reason}</p>
        <div className="text-sm font-medium">
          <span className="text-secondary">Funded:</span> ${campaign.fundedAmount} / $
          {campaign.requiredAmount}
        </div>
        <div className="mt-3 border-t pt-3 border-gray-500">
          <UserProfileCard userId={campaign.userId} />
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-lg cursor-pointer"
            >
              ✕
            </button>
            <div className="w-50 h-50 rounded-xl mx-auto my-4">
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover rounded mb-4 mx-auto "
              />
            </div>
            <h2 className="text-2xl font-bold mb-2">{campaign.title}</h2>
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">
              {campaign.reason}
            </p>
            <div className="text-lg font-medium">
              <span className="text-secondary">Funded:</span> ${campaign.fundedAmount} / $
              {campaign.requiredAmount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignCard;
