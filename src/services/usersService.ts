// services/userService.ts

type FilterState = {
  search: string;
  sortBy: "time" | "name" | null;
  order: "asc" | "desc" | null;
  sortUser: string;
};

// Get user profile by ID
export const getUserProfile = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:5000/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    return data; // Assuming the response contains { id, name, pfpUrl }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Get all users with filters
export const getAllUsers = async (filters?: FilterState) => {
  try {
    // Build query parameters based on filters
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.sortBy) {
        queryParams.append('sortBy', filters.sortBy);
      }
      if (filters.order) {
        queryParams.append('order', filters.order);
      }
      if (filters.sortUser) {
        queryParams.append('sortUser', filters.sortUser);
      }
    }

    const url = `http://localhost:5000/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// ✅ Delete user by ID
export const deleteUserById = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:5000/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    const data = await response.json();
    return data; // { success: true, message: 'User deleted successfully' }
  } catch (error) {
    console.error("Error deleting user:", error);
    return null;
  }
};