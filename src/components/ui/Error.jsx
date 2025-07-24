import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true,
  type = "default" 
}) => {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Problem 📡",
          message: "Looks like you're having network issues. Check your connection and try again!",
          emoji: "📡"
        };
      case "notFound":
        return {
          icon: "SearchX",
          title: "Nothing Found 🔍",
          message: "We couldn't find what you're looking for. Maybe try something else?",
          emoji: "🔍"
        };
      default:
        return {
          icon: "AlertTriangle",
          title: "Oops! Something went wrong 😅",
          message: message || "Don't worry, these things happen. Let's try again!",
          emoji: "😅"
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <Card className="max-w-md mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-error/20 to-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={errorContent.icon} size={32} className="text-error" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {errorContent.title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {errorContent.message}
        </p>
        
        {showRetry && onRetry && (
          <Button onClick={onRetry} className="mb-4">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
        
        <div className="bg-gradient-to-r from-info/10 to-secondary/10 border border-info/30 rounded-xl p-4">
          <div className="flex items-center justify-center gap-2">
            <ApperIcon name="Heart" size={16} className="text-info" />
            <p className="text-sm text-gray-700 font-medium">
              Still having trouble? Take a deep breath, we've got this! 💪
            </p>
          </div>
        </div>
      </motion.div>
    </Card>
  );
};

export default Error;