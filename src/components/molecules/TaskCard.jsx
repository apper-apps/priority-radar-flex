import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const TaskCard = ({ 
  task, 
  onComplete, 
  onDefer, 
  onReschedule, 
  showActions = true,
  isCompleted = false,
  isDeferred = false 
}) => {
  const [showDeferOptions, setShowDeferOptions] = useState(false);

  const handleComplete = () => {
    onComplete?.(task.Id);
  };

  const handleQuickDefer = (days) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    onDefer?.(task.Id, newDate);
    setShowDeferOptions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "bg-surface rounded-2xl p-4 shadow-lg transition-all duration-200 hand-drawn-border",
        isCompleted && "bg-success/10 border-success/30",
        isDeferred && "bg-warning/10 border-warning/30",
        showActions && "hover:shadow-xl"
      )}
    >
      <div className="flex items-start gap-3">
        {showActions && (
          <button
            onClick={handleComplete}
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center mt-1",
              isCompleted 
                ? "bg-success border-success text-white" 
                : "border-gray-300 hover:border-primary hover:bg-primary/10"
            )}
          >
            {isCompleted && <ApperIcon name="Check" size={14} />}
          </button>
        )}
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-gray-900 font-medium leading-relaxed",
            isCompleted && "line-through text-gray-500"
          )}>
            {task.text}
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            {task.category && (
              <Badge variant="secondary" className="text-xs">
                {task.category}
              </Badge>
            )}
            
            {task.deferCount > 0 && (
              <Badge variant="warning" className="text-xs">
                Deferred {task.deferCount}x
              </Badge>
            )}
            
            {isDeferred && (
              <Badge variant="warning" className="text-xs">
                📅 From yesterday
              </Badge>
            )}
          </div>
        </div>
        
        {showActions && !isCompleted && (
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowDeferOptions(!showDeferOptions)}
              className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
            >
              <ApperIcon name="MoreHorizontal" size={16} />
            </button>
          </div>
        )}
      </div>
      
      {showDeferOptions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <p className="text-sm text-gray-600 mb-3 font-medium">Move this task to:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleQuickDefer(1)}
              className="text-xs"
            >
              Tomorrow
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleQuickDefer(3)}
              className="text-xs"
            >
              In 3 days
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleQuickDefer(7)}
              className="text-xs"
            >
              Next week
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReschedule?.(task.Id)}
              className="text-xs"
            >
              <ApperIcon name="Calendar" size={14} className="mr-1" />
              Pick date
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskCard;