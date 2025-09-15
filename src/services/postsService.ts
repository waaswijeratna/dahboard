import { fetchWithAuth } from "@/config/fetchWithAuth";

const API_URL = "/posts";

type FilterState = {
  search: string;
  sortBy: "time" | "name" | null;
  order: "asc" | "desc" | null;
  sortUser: string;
};

export const getUserPosts = async (filters?: FilterState) => {
  try {
    // Build query parameters based on filters
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.search) {
        queryParams.append("search", filters.search);
      }
      if (filters.sortBy) {
        queryParams.append("sortBy", filters.sortBy);
      }
      if (filters.order) {
        queryParams.append("order", filters.order);
      }
      if (filters.sortUser) {
        queryParams.append("sortUser", filters.sortUser);
      }
    }

    const url = `${API_URL}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetchWithAuth(url, {
      method: "GET",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch user posts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return null;
  }
};

export const deletePost = async (postId: string) => {
  try {
    const response = await fetchWithAuth(`${API_URL}/${postId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }

    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
};