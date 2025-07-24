import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import TaskCard from "@/components/molecules/TaskCard";
import UserAvatar from "@/components/molecules/UserAvatar";
import ApperIcon from "@/components/ApperIcon";
import { userService } from "@/services/api/userService";
import { checkInService } from "@/services/api/checkInService";

const TeamKanban = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      const [usersData, checkInsData] = await Promise.all([
        userService.getAll(),
        checkInService.getTodaysCheckIns()
      ]);
      
      setUsers(usersData);
      setCheckIns(checkInsData);
    } catch (error) {
      console.error("Error loading team data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserCheckIn = (userId) => {
    return checkIns.find(checkIn => checkIn.userId === userId);
  };

  const getCompletionRate = (checkIn) => {
    if (!checkIn?.priorities?.length) return 0;
    const completed = checkIn.priorities.filter(p => p.completedAt).length;
    return Math.round((completed / checkIn.priorities.length) * 100);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Team Focus Today 🎯
        </h2>
        <p className="text-gray-600">
          See what everyone's working on and cheer each other on!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => {
          const checkIn = getUserCheckIn(user.id);
          const completionRate = getCompletionRate(checkIn);
          const isCurrentUser = user.id === currentUser?.id;

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: users.indexOf(user) * 0.1 }}
            >
              <Card className={`h-full ${isCurrentUser ? "ring-2 ring-primary ring-opacity-50" : ""}`}>
                <div className="flex items-center justify-between mb-4">
                  <UserAvatar user={user} showName />
                  {isCurrentUser && (
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-2 py-1 rounded-full">
                      <span className="text-xs font-bold text-primary">You</span>
                    </div>
                  )}
                </div>

                {checkIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        Today's Progress
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-success to-secondary transition-all duration-300"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-700">
                          {completionRate}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {checkIn.priorities.map((priority) => (
                        <TaskCard
                          key={priority.Id}
                          task={priority}
                          showActions={false}
                          isCompleted={!!priority.completedAt}
                        />
                      ))}
                    </div>

                    {completionRate === 100 && (
                      <div className="bg-gradient-to-r from-success/10 to-secondary/10 border border-success/30 rounded-xl p-3 text-center">
                        <div className="text-2xl mb-1">🎉</div>
                        <p className="text-sm font-bold text-success">
                          All done for today!
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ApperIcon name="Clock" size={32} className="text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      Haven't checked in yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Waiting for their morning priorities
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamKanban;