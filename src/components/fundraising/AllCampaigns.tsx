/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { getAllCampaigns, deleteCampaign } from "@/services/fundraisingService"; // ⬅️ import here
import CampaignCard from "./CampaignCard";
import { useSearchFilters } from "../SearchFilterContext";

const AllCampaignsSection = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const { filters } = useSearchFilters();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      // Only pass filters that have values to avoid sending empty parameters
      const activeFilters = {
        ...(filters.search && { search: filters.search }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.order && { order: filters.order }),
        ...(filters.sortUser && { sortUser: filters.sortUser }),
      };

      const data = await getAllCampaigns(activeFilters);
      setCampaigns(data || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get current user's role from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      const { role } = JSON.parse(userData);
      setUserRole(role);
    }
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-semibold text-third">
          Loading campaigns...
        </p>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-semibold text-third">
          No campaigns available right now.
        </p>
      </div>
    );
  }

  // Delete handler
  const handleDelete = async (id: string) => {
    console.log("Deleting campaign with ID:", id);
    if (!id) return;
    try {
      const success = await deleteCampaign(id);
      if (success) {
        fetchCampaigns();
      }
    } catch (err) {
      console.error("Delete campaign error:", err);
    }
  };

  return (
    <div className="h-full w-full overflow-auto scrollbar-hide">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {campaigns.map((campaign) => (
          <div key={campaign._id} className="flex flex-col items-center ">
            <CampaignCard
              campaign={campaign}
              userRole={userRole}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCampaignsSection;
