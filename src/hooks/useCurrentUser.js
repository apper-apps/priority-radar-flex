import { useState, useEffect } from "react";
import { userService } from "@/services/api/userService";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      console.log("🔄 Loading current user...");
      setError(null);
      
      // For demo purposes, we'll use the first user as the current user
      const users = await userService.getAll();
      console.log("📋 Users loaded:", users.length);
      
      if (users.length > 0) {
        setCurrentUser(users[0]);
        console.log("✅ Current user set:", users[0].name);
      } else {
        throw new Error("No users found");
      }
    } catch (error) {
      console.error("❌ Error loading current user:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      console.log("🏁 User loading completed");
    }
  };

  const retry = () => {
    setLoading(true);
    setError(null);
    loadCurrentUser();
  };

  return { currentUser, loading, error, retry };
};