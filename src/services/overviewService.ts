import { fetchWithAuth } from "@/config/fetchWithAuth";

export interface OverviewStats {
  posts: {
    total: number;
    timeDistribution: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  exhibitions: {
    total: number;
    todayCount: number;
  };
  campaigns: {
    totalCampaigns: number;
    totalFundsRaised: number;
  };
  advertisements: {
    total: number;
    timeDistribution: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  notices: {
    total: number;
    active: number;
    inactive: number;
  };
}

const API_URL = "/overview"; 

// Fetch overview stats
export const getOverviewStats = async (): Promise<OverviewStats> => {
  try {
    const res = await fetchWithAuth(`${API_URL}/statistics`);
    if (!res.ok) throw new Error("Failed to fetch overview stats");
    const data: OverviewStats = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching overview stats:", error);
    throw error;
  }
};
