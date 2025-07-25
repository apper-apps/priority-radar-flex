import React from "react";
import { Outlet } from "react-router-dom";
import NavigationTabs from "@/components/molecules/NavigationTabs";

const Layout = () => {
  const navigationTabs = [
    {
      path: "/",
      icon: "Target",
      label: "Today"
    },
    {
      path: "/team",
      icon: "Users",
      label: "Team"
    },
    {
      path: "/progress",
      icon: "BarChart3",
      label: "Progress"
    },
{
      path: "/summary",
      icon: "Calendar",
      label: "Weekly"
    },
    {
      path: "/apis",
      icon: "Database",
      label: "APIs"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface/95 backdrop-blur-md border-b-2 border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎯</span>
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-gray-900">
                  Priority Radar
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Daily Focus Tracker
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-success/10 to-secondary/10 px-3 py-1.5 rounded-full border border-success/30">
                <span className="text-success">🔥</span>
                <span className="text-sm font-semibold text-gray-700">5 day streak</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <NavigationTabs tabs={navigationTabs} />
    </div>
  );
};

export default Layout;