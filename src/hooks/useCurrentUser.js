import { useState, useEffect } from "react";
import { userService } from "@/services/api/userService";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      // For demo purposes, we'll use the first user as the current user
      const users = await userService.getAll();
      if (users.length > 0) {
        setCurrentUser(users[0]);
      }
    } catch (error) {
      console.error("Error loading current user:", error);
    } finally {
      setLoading(false);
    }
  };

  return { currentUser, loading };
};