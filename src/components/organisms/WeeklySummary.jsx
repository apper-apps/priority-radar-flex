import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import UserAvatar from "@/components/molecules/UserAvatar";
import ApperIcon from "@/components/ApperIcon";
import { checkInService } from "@/services/api/checkInService";
import { userService } from "@/services/api/userService";
import { format, startOfWeek, endOfWeek } from "date-fns";

const WeeklySummary = ({ currentUser }) => {
  const [summary, setSummary] = useState(null);
  const [teamSummary, setTeamSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklySummary();
  }, []);

  const loadWeeklySummary = async () => {
    try {
      const [userSummary, users] = await Promise.all([
        checkInService.getWeeklySummary(),
        userService.getAll()
      ]);
      
      setSummary(userSummary);
      
      // Get team summaries
      const teamData = await Promise.all(
        users.map(async (user) => {
          const userWeeklySummary = await checkInService.getUserWeeklySummary(user.id);
          return { user, summary: userWeeklySummary };
        })
      );
      
      setTeamSummary(teamData.sort((a, b) => b.summary.completionRate - a.summary.completionRate));
    } catch (error) {
      console.error("Error loading weekly summary:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </Card>
        ))}
      </div>
    );
  }

  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Weekly Summary 📈
        </h2>
        <p className="text-gray-600">
          {format(weekStart, "MMM dd")} - {format(weekEnd, "MMM dd, yyyy")}
        </p>
      </div>

      {/* Personal Summary */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={32} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Your Week</h3>
            <p className="text-gray-600">How did you do?</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {summary?.completionRate || 0}%
            </div>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary mb-1">
              {summary?.totalTasks || 0}
            </div>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {summary?.completedTasks || 0}
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {summary?.deferredTasks || 0}
            </div>
            <p className="text-sm text-gray-600">Deferred</p>
          </div>
        </div>

        {summary?.commonFocus?.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Your Main Focus Areas 🎯</h4>
            <div className="flex flex-wrap gap-2">
              {summary.commonFocus.map((focus, index) => (
                <Badge key={index} variant="primary">
                  {focus}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Team Leaderboard */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ApperIcon name="Trophy" size={24} className="text-accent" />
          Team Leaderboard 🏆
        </h3>

        <div className="space-y-4">
          {teamSummary.map((member, index) => (
            <motion.div
              key={member.user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                index === 0 ? "bg-gradient-to-r from-accent/10 to-warning/10 border border-accent/30" :
                index === 1 ? "bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200" :
                index === 2 ? "bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200" :
                "bg-gray-50 border border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-2xl ${
                    index === 0 ? "🥇" : 
                    index === 1 ? "🥈" : 
                    index === 2 ? "🥉" : 
                    `${index + 1}.`
                  }`}>
                    {index < 3 ? (index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉") : `${index + 1}.`}
                  </span>
                  <UserAvatar user={member.user} showName />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {member.summary.completionRate}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {member.summary.completedTasks}/{member.summary.totalTasks} tasks
                  </div>
                </div>
                
                {member.summary.streak > 0 && (
                  <Badge variant="accent">
                    🔥 {member.summary.streak} days
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Team Insights */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ApperIcon name="Users" size={24} className="text-info" />
          Team Insights 🤝
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Common Focus Areas</h4>
            <div className="space-y-2">
              {["Development", "Design", "Meetings", "Planning"].map((focus) => (
                <div key={focus} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{focus}</span>
                  <Badge variant="secondary">
                    {Math.floor(Math.random() * 5) + 2} people
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Team Stats</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Average completion rate</span>
                <span className="font-bold text-primary">
                  {Math.round(teamSummary.reduce((acc, m) => acc + m.summary.completionRate, 0) / teamSummary.length)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total team tasks</span>
                <span className="font-bold text-secondary">
                  {teamSummary.reduce((acc, m) => acc + m.summary.totalTasks, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Most productive day</span>
                <span className="font-bold text-success">Tuesday</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WeeklySummary;