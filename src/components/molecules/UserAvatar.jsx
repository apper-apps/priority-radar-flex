import React from "react";
import { cn } from "@/utils/cn";

const UserAvatar = ({ user, size = "md", showName = false, className }) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-xl"
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGradientColor = (name) => {
    const colors = [
      "from-primary to-error",
      "from-secondary to-info",
      "from-accent to-warning",
      "from-success to-secondary",
      "from-info to-primary"
    ];
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br shadow-lg",
          sizes[size],
          getGradientColor(user.name)
        )}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          getInitials(user.name)
        )}
      </div>
      
      {showName && (
        <div>
          <p className="font-semibold text-gray-900">{user.name}</p>
          {user.weeklyStreak > 0 && (
            <p className="text-sm text-gray-600">
              🔥 {user.weeklyStreak} day streak
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;