import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";

const Loading = ({ type = "default" }) => {
  if (type === "kanban") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-3 bg-gray-100 rounded-lg w-2/3"></div>
              </div>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-16 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-3 bg-gray-100 rounded-lg w-2/3 mx-auto"></div>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded-lg mb-4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-24 h-4 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full"></div>
                <div className="w-12 h-4 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-3 h-3 bg-gradient-to-r from-secondary to-info rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-3 h-3 bg-gradient-to-r from-accent to-warning rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
        />
      </motion.div>
    </div>
  );
};

export default Loading;