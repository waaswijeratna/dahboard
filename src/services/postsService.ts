const API_URL = "http://localhost:5000/posts";

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

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`${API_URL}/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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