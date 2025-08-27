/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { getAllCampaigns } from "@/services/fundraisingService";
import CampaignCard from "./CampaignCard";

const AllCampaignsSection = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [, setLoading] = useState(true);


  const fetchCampaigns = async () => {
    const data = await getAllCampaigns();
    setCampaigns(data || []);
    setLoading(false);
  };


  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (campaigns.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-semibold text-third">
          No campaigns available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto scrollbar-hide">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {campaigns.map((campaign) => (
          <div key={campaign._id} className="flex flex-col items-center ">
            <CampaignCard campaign={campaign} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCampaignsSection;
