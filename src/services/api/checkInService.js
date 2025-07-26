import checkInsData from "@/services/mockData/checkIns.json";
import { priorityService } from "./priorityService";
import { format, startOfWeek, endOfWeek, subWeeks, isToday, startOfDay } from "date-fns";
import { toast } from "react-toastify";
class CheckInService {
  constructor() {
    this.checkIns = [...checkInsData];
  }

  async createCheckIn(userId, priorityTexts) {
    await this.delay(300);
    
    // Create priorities first
    const priorities = [];
    for (const text of priorityTexts) {
      const priority = await priorityService.create({
        userId,
        text,
        category: this.categorizeTask(text)
      });
      priorities.push(priority.Id);
    }
    
    // Create check-in
    const newCheckIn = {
      Id: Math.max(...this.checkIns.map(c => c.Id)) + 1,
      userId,
      date: startOfDay(new Date()).toISOString(),
      priorities,
      submittedAt: new Date().toISOString()
    };
    
    this.checkIns.push(newCheckIn);
    return { ...newCheckIn };
  }

  async getTodaysCheckIns() {
    await this.delay(200);
    const today = startOfDay(new Date()).toISOString();
    const todaysCheckIns = this.checkIns.filter(c => 
      startOfDay(new Date(c.date)).toISOString() === today
    );
    
    // Get priorities for each check-in
    const checkInsWithPriorities = await Promise.all(
      todaysCheckIns.map(async (checkIn) => {
        const priorities = await Promise.all(
          checkIn.priorities.map(async (priorityId) => {
            try {
              return await priorityService.getById(priorityId);
            } catch (error) {
              return null;
            }
          })
        );
        
        return {
          ...checkIn,
          priorities: priorities.filter(p => p !== null)
        };
      })
    );
    
    return checkInsWithPriorities;
  }

  async getTodaysCheckIn(userId) {
    await this.delay(200);
    const today = startOfDay(new Date()).toISOString();
    const checkIn = this.checkIns.find(c => 
      c.userId === userId && startOfDay(new Date(c.date)).toISOString() === today
    );
    
    if (!checkIn) {
      return null;
    }
    
    // Get priorities for this check-in
    const priorities = await Promise.all(
      checkIn.priorities.map(async (priorityId) => {
        try {
          return await priorityService.getById(priorityId);
        } catch (error) {
          return null;
        }
      })
    );
    
    return {
      ...checkIn,
      priorities: priorities.filter(p => p !== null)
    };
  }

  async completeTask(taskId) {
    await this.delay(200);
    return await priorityService.complete(taskId);
  }

  async deferTask(taskId, newDate) {
    await this.delay(200);
    return await priorityService.defer(taskId, newDate);
  }

  async getUserStats(userId) {
    await this.delay(300);
    const userPriorities = await priorityService.getByUserId(userId);
    const thisWeekStart = startOfWeek(new Date());
    const thisWeekEnd = endOfWeek(new Date());
    
    const thisWeekPriorities = userPriorities.filter(p => {
      const createdDate = new Date(p.createdAt);
      return createdDate >= thisWeekStart && createdDate <= thisWeekEnd;
    });
    
    const completedThisWeek = thisWeekPriorities.filter(p => p.completedAt).length;
    const thisWeekCompletionRate = thisWeekPriorities.length > 0 
      ? Math.round((completedThisWeek / thisWeekPriorities.length) * 100)
      : 0;
    
    const totalCompleted = userPriorities.filter(p => p.completedAt).length;
    const mostDeferred = userPriorities
      .filter(p => p.deferCount > 2)
      .sort((a, b) => b.deferCount - a.deferCount)
      .slice(0, 3);
    
    return {
      thisWeekCompletionRate,
      currentStreak: Math.floor(Math.random() * 7) + 1, // Mock streak
      totalCompletedTasks: totalCompleted,
      mostDeferredTasks: mostDeferred
    };
  }

  async getWeeklyStats(userId) {
    await this.delay(300);
    const weeks = [];
    
    for (let i = 0; i < 4; i++) {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekEnd = endOfWeek(subWeeks(new Date(), i));
      
      const userPriorities = await priorityService.getByUserId(userId);
      const weekPriorities = userPriorities.filter(p => {
        const createdDate = new Date(p.createdAt);
        return createdDate >= weekStart && createdDate <= weekEnd;
      });
      
      const completed = weekPriorities.filter(p => p.completedAt).length;
      const total = weekPriorities.length;
      
      weeks.unshift({
        weekStart: weekStart.toISOString(),
        totalTasks: total,
        completedTasks: completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
    
    return weeks;
  }

  async getWeeklySummary() {
    await this.delay(300);
    // Mock weekly summary for current user
    return {
      completionRate: 75,
      totalTasks: 20,
      completedTasks: 15,
      deferredTasks: 3,
      commonFocus: ["Development", "Meetings", "Planning"]
    };
  }

  async getUserWeeklySummary(userId) {
    await this.delay(200);
    const userPriorities = await priorityService.getByUserId(userId);
    const thisWeekStart = startOfWeek(new Date());
    const thisWeekEnd = endOfWeek(new Date());
    
    const thisWeekPriorities = userPriorities.filter(p => {
      const createdDate = new Date(p.createdAt);
      return createdDate >= thisWeekStart && createdDate <= thisWeekEnd;
    });
    
    const completed = thisWeekPriorities.filter(p => p.completedAt).length;
    const total = thisWeekPriorities.length;
    
    return {
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalTasks: total,
      completedTasks: completed,
      streak: Math.floor(Math.random() * 7) + 1
    };
}

categorizeTask(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("campaign") || lowerText.includes("marketing") || lowerText.includes("promotion")) return "Campaign";
    if (lowerText.includes("admin") || lowerText.includes("administrative") || lowerText.includes("paperwork")) return "Admin";
    if (lowerText.includes("creative") || lowerText.includes("design") || lowerText.includes("mockup") || lowerText.includes("artistic")) return "Creative";
    if (lowerText.includes("meeting") || lowerText.includes("call")) return "Meeting";
    if (lowerText.includes("code") || lowerText.includes("develop") || lowerText.includes("bug")) return "Development";
    if (lowerText.includes("review") || lowerText.includes("approve")) return "Review";
    if (lowerText.includes("write") || lowerText.includes("document")) return "Documentation";
    if (lowerText.includes("plan") || lowerText.includes("prepare")) return "Planning";
    return "General";
  }

  delay(ms) {
    console.log(`⏱️ Service delay: ${ms}ms - ${new Date().toLocaleTimeString()}`);
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const checkInService = new CheckInService();