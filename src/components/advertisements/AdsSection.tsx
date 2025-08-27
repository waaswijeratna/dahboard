import React, { useEffect, useState } from "react";
import AdCard from "./AdCard";
import { getAllAds } from "@/services/advertisementsService";
import { Advertisements } from "@/types";
import { useSearchFilters } from "../SearchFilterContext";

export default function AdsSection() {
  const [ads, setAds] = useState<Advertisements[]>([]);
  const { filters } = useSearchFilters();
  const [loading, setLoading] = useState(true);

  const fetchAds = async () => {
    setLoading(true);
    try {
      // Only pass filters that have values to avoid sending empty parameters
      const activeFilters = {
        ...(filters.search && { search: filters.search }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.order && { order: filters.order }),
        ...(filters.sortUser && { sortUser: filters.sortUser }),
      };
      
      const allAds = await getAllAds(activeFilters);
      setAds(allAds || []);
    } catch (error) {
      console.error("Error fetching ads:", error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [filters]); // Refetch when filters change

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-semibold text-third">
          Loading advertisements...
        </p>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-semibold text-third">
          No advertisements available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto scrollbar-hide">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} onEdit={() => {}} onDelete={() => {}} myAds={false} />
        ))}
      </div>
    </div>
  );
}