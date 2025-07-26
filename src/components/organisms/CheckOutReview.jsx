import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import TaskCard from "@/components/molecules/TaskCard";
import ProgressRing from "@/components/molecules/ProgressRing";
import EmojiReaction from "@/components/molecules/EmojiReaction";
import ApperIcon from "@/components/ApperIcon";
import { checkInService } from "@/services/api/checkInService";

const CheckOutReview = ({ currentUser, onComplete }) => {
  const [todaysCheckIn, setTodaysCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    loadTodaysCheckIn();
  }, [currentUser]);

  const loadTodaysCheckIn = async () => {
    try {
      const checkIn = await checkInService.getTodaysCheckIn(currentUser.id);
      setTodaysCheckIn(checkIn);
    } catch (error) {
      console.error("Error loading today's check-in:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      await checkInService.completeTask(taskId);
      
      // Update local state
      setTodaysCheckIn(prev => ({
        ...prev,
        priorities: prev.priorities.map(p => 
          p.Id === taskId 
            ? { ...p, completedAt: new Date().toISOString() }
            : p
        )
      }));

      // Check if all tasks are now completed
      const updatedPriorities = todaysCheckIn.priorities.map(p => 
        p.Id === taskId ? { ...p, completedAt: new Date().toISOString() } : p
      );
      
      const allCompleted = updatedPriorities.every(p => p.completedAt);
      
      if (allCompleted) {
        setShowCelebration(true);
        toast.success("Amazing! You completed all your priorities today! 🎉");
      } else {
        toast.success("Great job! Keep going! 💪");
      }
      
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again. 😅");
    }
  };

  const handleTaskDefer = async (taskId, newDate) => {
    try {
      await checkInService.deferTask(taskId, newDate);
      
      // Update local state
      setTodaysCheckIn(prev => ({
        ...prev,
        priorities: prev.priorities.map(p => 
          p.Id === taskId 
            ? { ...p, deferredTo: newDate.toISOString(), deferCount: (p.deferCount || 0) + 1 }
            : p
        )
      }));

      toast.success("Task moved to another day! 📅");
      
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again. 😅");
    }
  };

  const handleTaskReschedule = (taskId) => {
    // This would open a date picker modal
    toast.info("Date picker coming soon! For now, use the quick defer options. 📅");
  };

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-100 rounded-lg"></div>
          <div className="h-24 bg-gray-100 rounded-lg"></div>
        </div>
      </Card>
    );
  }

  if (!todaysCheckIn) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <ApperIcon name="Calendar" size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Check-in Today</h3>
        <p className="text-gray-600">
          You haven't set any priorities for today yet.
        </p>
      </Card>
    );
  }

  const completedTasks = todaysCheckIn.priorities.filter(p => p.completedAt).length;
  const totalTasks = todaysCheckIn.priorities.length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  return (
    <>
      <Card className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <ProgressRing progress={completionRate} size={100} className="mb-4">
              <span className="text-xl font-bold text-gray-900">{completionRate}%</span>
            </ProgressRing>
            
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
              How did today go? 🌅
            </h2>
            <p className="text-gray-600 font-medium">
              {completedTasks} of {totalTasks} priorities completed
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {todaysCheckIn.priorities.map((priority) => (
              <TaskCard
                key={priority.Id}
                task={priority}
                onComplete={handleTaskComplete}
                onDefer={handleTaskDefer}
                onReschedule={handleTaskReschedule}
                isCompleted={!!priority.completedAt}
              />
            ))}
          </div>

          {completionRate === 100 ? (
            <div className="bg-gradient-to-r from-success/10 to-secondary/10 border border-success/30 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-success mb-2">
                Perfect Day!
              </h3>
              <p className="text-gray-700 mb-4">
                You completed all your priorities today. That's amazing!
              </p>
<Button
                onClick={() => {
                  toast.success("Perfect day completed! 🎉");
                  onComplete();
                }}
                className="bg-gradient-to-r from-success to-secondary"
              >
                <ApperIcon name="CheckCircle" size={20} className="mr-2" />
                Finish Day 🎯
              </Button>
            </div>
          ) : completionRate >= 70 ? (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-xl font-bold text-primary mb-2">
                Great Progress!
              </h3>
              <p className="text-gray-700 mb-4">
                You're doing really well! Don't forget about the remaining tasks.
              </p>
<Button onClick={() => {
                toast.success("Great progress today! Keep it up! 💪");
                onComplete();
              }}>
                <ApperIcon name="ArrowRight" size={20} className="mr-2" />
                Continue Tomorrow 💪
              </Button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-info/10 to-secondary/10 border border-info/30 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">💙</div>
              <h3 className="text-xl font-bold text-info mb-2">
                Tomorrow's a New Day
              </h3>
              <p className="text-gray-700 mb-4">
                Some days are harder than others, and that's perfectly okay. What matters is showing up.
              </p>
<Button onClick={() => {
                toast.info("Tomorrow is a fresh start! 🌅");
                onComplete();
              }} variant="secondary">
                <ApperIcon name="Sunrise" size={20} className="mr-2" />
                Plan Tomorrow 🌅
              </Button>
            </div>
          )}
        </motion.div>
      </Card>
      
      <EmojiReaction 
        trigger={showCelebration} 
        emojis={["🎉", "🎊", "✨", "🏆", "💪"]} 
      />
    </>
  );
};

export default CheckOutReview;