const API_URL = "http://localhost:5000/posts";



export const getUserPosts = async () => {
  try {

    const response = await fetch(`${API_URL}`, {
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
