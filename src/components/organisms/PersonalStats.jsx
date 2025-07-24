import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ProgressRing from "@/components/molecules/ProgressRing";
import ApperIcon from "@/components/ApperIcon";
import { checkInService } from "@/services/api/checkInService";
import { format, startOfWeek, subWeeks } from "date-fns";

const PersonalStats = ({ currentUser }) => {
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPersonalStats();
  }, [currentUser]);

  const loadPersonalStats = async () => {
    try {
      const [userStats, weeklyStats] = await Promise.all([
        checkInService.getUserStats(currentUser.id),
        checkInService.getWeeklyStats(currentUser.id)
      ]);
      
      setStats(userStats);
      setWeeklyData(weeklyStats);
    } catch (error) {
      console.error("Error loading personal stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </Card>
        ))}
      </div>
    );
  }

  const thisWeekRate = stats?.thisWeekCompletionRate || 0;
  const streak = stats?.currentStreak || 0;
  const totalCompleted = stats?.totalCompletedTasks || 0;
  const mostDeferredTasks = stats?.mostDeferredTasks || [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Your Focus Journey 📊
        </h2>
        <p className="text-gray-600">
          Track your progress and celebrate your wins!
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <ProgressRing progress={thisWeekRate} size={80} className="mb-4">
            <span className="text-lg font-bold text-gray-900">{thisWeekRate}%</span>
          </ProgressRing>
          <h3 className="font-bold text-gray-900 mb-1">This Week</h3>
          <p className="text-sm text-gray-600">Completion Rate</p>
        </Card>

        <Card className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">{streak}</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Day Streak 🔥</h3>
          <p className="text-sm text-gray-600">Keep it going!</p>
        </Card>

        <Card className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-success to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">{totalCompleted}</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Tasks Done ✅</h3>
          <p className="text-sm text-gray-600">Total completed</p>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ApperIcon name="TrendingUp" size={20} className="text-primary" />
          Weekly Progress
        </h3>
        
        <div className="space-y-4">
          {weeklyData.map((week, index) => (
            <motion.div
              key={week.weekStart}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-24">
                <p className="text-sm font-medium text-gray-700">
                  {format(new Date(week.weekStart), "MMM dd")}
                </p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${week.completionRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700 w-12">
                    {week.completionRate}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {week.totalTasks} tasks • {week.completedTasks} completed
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Insights */}
      {mostDeferredTasks.length > 0 && (
        <Card>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="AlertCircle" size={20} className="text-warning" />
            Tasks That Need Attention 🤔
          </h3>
          
          <div className="space-y-3">
            {mostDeferredTasks.map((task) => (
              <div
                key={task.Id}
                className="flex items-center justify-between p-3 bg-warning/10 border border-warning/30 rounded-xl"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">{task.text}</p>
                  <p className="text-sm text-gray-600">
                    Deferred {task.deferCount} times
                  </p>
                </div>
                <Badge variant="warning">
                  {task.deferCount}x
                </Badge>
              </div>
            ))}
            
            <div className="bg-info/10 border border-info/30 rounded-xl p-4 mt-4">
              <div className="flex items-start gap-3">
                <ApperIcon name="Heart" size={20} className="text-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">💙 Gentle reminder:</p>
                  <p className="text-sm text-gray-700">
                    These tasks seem to be challenging. Would you like to break them down into smaller steps or discuss what's blocking you?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PersonalStats;