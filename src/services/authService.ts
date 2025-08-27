const API_BASE_URL = "http://localhost:5000/moderators";

interface UpdateUserData {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  pfpUrl: string;
  password?: string;
}

type FilterState = {
  search: string;
  sortBy: "time" | "name" | null;
  order: "asc" | "desc" | null;
  sortUser: string;
};

let userData: {
  id: string;
  name: string;
  email: string;
  age: number;
  pfpUrl: string;
  role: string;
} | null = null;

// Function to save user data to local storage
const saveUserDataToLocalStorage = (user: {
  id: string;
  name: string;
  email: string;
  age: number;
  pfpUrl: string;
  role: string;
}) => {
  localStorage.setItem("userData", JSON.stringify(user));
};

// Function to load user data from local storage
const loadUserDataFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      userData = JSON.parse(storedData);
    }
  }
};

loadUserDataFromLocalStorage();

const saveUserIdToLocalStorage = (userId: string) => {
  localStorage.setItem("userId", userId);
};

const decodeToken = (token: string) => {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    console.error(
      "Invalid token format: Token must be a string with at least one dot"
    );
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error(
        "Invalid token format: Token must have three parts (header.payload.signature)"
      );
      return null;
    }

    // Add padding to base64 if needed
    const base64Payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64Payload.length % 4)) % 4);
    const jsonPayload = atob(base64Payload + padding);

    const payload = JSON.parse(jsonPayload);

    // Validate required fields
    const requiredFields = ["id", "name", "email", "age"];
    for (const field of requiredFields) {
      if (!payload[field]) {
        console.error(
          `Invalid token payload: Missing required field "${field}"`
        );
        return null;
      }
    }

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      age: Number(payload.age),
      role: payload.role,
      pfpUrl: payload.pfpUrl || payload.pfp_url,
    };
  } catch (error) {
    console.error("Token decoding error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      token: token.substring(0, 10) + "...", // Log only the start of the token for debugging
    });
    return null;
  }
};

export const registerUser = async (
  name: string,
  email: string,
  age: number,
  password: string,
  role: string,
  pfpUrl: string
) => {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, age, password, pfpUrl, role }),
  });

  const data = await res.json();
  console.log("came data", data);

  // ✅ Just return response, no localStorage or global state updates
  return data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log("came data", data);
  if (res.ok) {
    const decodedData = decodeToken(data.token);
    if (decodedData) {
      saveUserIdToLocalStorage(decodedData.id);
      saveUserDataToLocalStorage(decodedData);
      userData = decodedData;
    }
  }
  return data;
};

export const getProfile = () => {
  if (!userData) loadUserDataFromLocalStorage();
  return userData ? { ...userData } : null;
};

export const getProfileInfo = () => {
  if (!userData) loadUserDataFromLocalStorage();
  return userData ? { ...userData } : null;
};

export const getAllModerators = async (filters?: FilterState) => {
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

    const url = `${API_BASE_URL}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch moderators");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching moderators:", error);
    throw error;
  }
};

export const deleteModerator = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete moderator");
    return await response.json();
  } catch (error) {
    console.error("Error deleting moderator:", error);
    throw error;
  }
};

export const updateUser = async (updatedUserData: UpdateUserData) => {
  try {
    const { id, ...updateData } = updatedUserData;

    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    const data = await res.json();

    if (res.ok) {
      let updatedUser = null;

      // Check if the backend returns a new token
      if (data.token) {
        localStorage.setItem("token", data.token);
        const decodedData = decodeToken(data.token);
        if (decodedData) {
          saveUserIdToLocalStorage(decodedData.id);
          saveUserDataToLocalStorage(decodedData);
          userData = decodedData;
          updatedUser = decodedData;
        }
      }

      // Extract user data from response (handle both nested and top-level)
      const responseUser = data.user || data;
      if (responseUser && !updatedUser) {
        // Ensure fields are correctly mapped (adjust for backend's field names)
        updatedUser = {
          id: responseUser.id,
          name: responseUser.name,
          email: responseUser.email,
          age: Number(responseUser.age),
          role: responseUser.role,
          pfpUrl: responseUser.pfpUrl || responseUser.pfp_url,
        };
        saveUserDataToLocalStorage(updatedUser);
        userData = updatedUser;
      }

      return {
        success: true,
        message: data.message || "Profile updated successfully",
        user: updatedUser,
        token: data.token,
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to update profile",
      };
    }
  } catch (error) {
    console.error("Update user error:", error);
    return {
      success: false,
      message: "An error occurred while updating profile",
    };
  }
};
