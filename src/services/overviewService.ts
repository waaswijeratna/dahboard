// services/overviewService.ts

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; // Fallback to localhost if env variable is not set

// Fetch overview stats
export const getOverviewStats = async (): Promise<OverviewStats> => {
  try {
    const res = await fetch(`${API_URL}/overview/statistics`);
    if (!res.ok) throw new Error("Failed to fetch overview stats");
    const data: OverviewStats = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching overview stats:", error);
    throw error;
  }
};
