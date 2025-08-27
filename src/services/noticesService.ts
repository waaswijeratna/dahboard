// types
export interface Notice {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  userId: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Base URL
const API_URL = "http://localhost:5000/notices";

// Updated getNotices to support filters
export const getNotices = async (filters?: {
  search?: string;
  sortBy?: "time" | "name" | null;
  order?: "asc" | "desc" | null;
  sortUser?: string;
}): Promise<Notice[] | null> => {
  try {
    const query = new URLSearchParams();

    // Only add parameters that have truthy values
    if (filters?.search?.trim()) query.append("search", filters.search.trim());
    if (filters?.sortBy) query.append("sortBy", filters.sortBy);
    if (filters?.order) query.append("order", filters.order);
    if (filters?.sortUser?.trim()) query.append("sortUser", filters.sortUser.trim());
    
    const url = query.toString() ? `${API_URL}?${query.toString()}` : API_URL;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notices");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching notices:", error);
    return null;
  }
};

// Create a new notice
export const createNotice = async (
  noticeData: Notice
): Promise<Notice | null> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noticeData),
    });

    if (!response.ok) {
      throw new Error("Failed to create notice");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating notice:", error);
    return null;
  }
};

// Update a notice by ID
export const updateNotice = async (
  id: string,
  noticeData: Partial<Notice>
): Promise<Notice | null> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noticeData),
    });

    if (!response.ok) {
      throw new Error("Failed to update notice");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating notice:", error);
    return null;
  }
};

// Delete a notice by ID
export const deleteNotice = async (
  id: string
): Promise<{ message: string } | null> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete notice");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting notice:", error);
    return null;
  }
};