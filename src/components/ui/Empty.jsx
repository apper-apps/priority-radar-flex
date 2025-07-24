import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet", 
  message = "Time to add something!", 
  actionLabel, 
  onAction,
  type = "default"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "checkin":
        return {
          icon: "Target",
          title: "Ready to start your day? ☀️",
          message: "Set your priorities and unlock your team's daily focus!",
          actionLabel: "Start Check-in",
          gradient: "from-primary to-accent"
        };
      case "tasks":
        return {
          icon: "CheckSquare",
          title: "No tasks for today 📝",
          message: "Looks like you haven't set your priorities yet. Let's get started!",
          actionLabel: "Add Priorities",
          gradient: "from-secondary to-info"
        };
      case "stats":
        return {
          icon: "BarChart3",
          title: "No data yet 📊",
          message: "Complete a few daily check-ins to see your awesome progress here!",
          actionLabel: "Start Tracking",
          gradient: "from-accent to-warning"
        };
      case "team":
        return {
          icon: "Users",
          title: "Team is getting ready 👥",
          message: "Waiting for your teammates to share their daily priorities!",
          actionLabel: null,
          gradient: "from-success to-secondary"
        };
      default:
        return {
          icon: "Smile",
          title: title,
          message: message,
          actionLabel: actionLabel,
          gradient: "from-primary to-secondary"
        };
    }
  };

  const emptyContent = getEmptyContent();

  return (
    <Card className="max-w-lg mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`w-20 h-20 bg-gradient-to-br ${emptyContent.gradient} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <ApperIcon name={emptyContent.icon} size={36} className="text-white" />
        </div>
        
        <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
          {emptyContent.title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed text-lg">
          {emptyContent.message}
        </p>
        
        {emptyContent.actionLabel && onAction && (
          <Button onClick={onAction} size="lg" className="mb-6">
            <ApperIcon name="Plus" size={20} className="mr-2" />
            {emptyContent.actionLabel}
          </Button>
        )}
        
        <div className={`bg-gradient-to-r ${emptyContent.gradient}/10 border border-current/30 rounded-2xl p-4`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <ApperIcon name="Sparkles" size={20} className="text-gray-600" />
            <p className="font-semibold text-gray-800">Fun Fact</p>
          </div>
          <p className="text-sm text-gray-700">
            Teams that share daily priorities are 40% more likely to achieve their goals! 🎯
          </p>
        </div>
      </motion.div>
    </Card>
  );
};

export default Empty;