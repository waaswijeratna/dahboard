// services/userService.ts

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

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await fetch(`http://localhost:5000/users`, {
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
