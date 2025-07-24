import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const NavigationTabs = ({ tabs }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t-2 border-gray-100 z-50">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 relative min-w-[60px]",
                isActive 
                  ? "text-primary" 
                  : "text-gray-500 hover:text-primary"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-8 blob-indicator opacity-20" />
                )}
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  isActive && "bg-gradient-to-r from-primary/10 to-accent/10 scale-110"
                )}>
                  <ApperIcon 
                    name={tab.icon} 
                    size={24} 
                    className={cn(
                      "transition-all duration-200",
                      isActive && "animate-pop"
                    )}
                  />
                </div>
                <span className="text-xs font-medium mt-1">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default NavigationTabs;