import React, { useState, useEffect } from "react";
import CheckInForm from "@/components/organisms/CheckInForm";
import CheckOutReview from "@/components/organisms/CheckOutReview";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { checkInService } from "@/services/api/checkInService";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const TodayFocus = () => {
  const { currentUser, loading: userLoading } = useCurrentUser();
  const [todaysCheckIn, setTodaysCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("checkin"); // checkin, checkout

  useEffect(() => {
    if (currentUser) {
      loadTodaysCheckIn();
    }
  }, [currentUser]);

  const loadTodaysCheckIn = async () => {
    try {
      setError(null);
      const checkIn = await checkInService.getTodaysCheckIn(currentUser.id);
      setTodaysCheckIn(checkIn);
      
      // If user has checked in, show checkout view
      if (checkIn) {
        setViewMode("checkout");
      } else {
        setViewMode("checkin");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInComplete = () => {
    loadTodaysCheckIn();
  };

  const handleCheckOutComplete = () => {
    // Could navigate to summary or reset for next day
    console.log("Day completed!");
  };

  if (userLoading || loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTodaysCheckIn} />;
  }

  if (!currentUser) {
    return <Error message="Unable to load user data" onRetry={loadTodaysCheckIn} />;
  }

  return (
    <div className="space-y-6">
      {viewMode === "checkin" ? (
        <CheckInForm 
          currentUser={currentUser}
          onCheckInComplete={handleCheckInComplete}
        />
      ) : (
        <CheckOutReview
          currentUser={currentUser}
          onComplete={handleCheckOutComplete}
        />
      )}
    </div>
  );
};

export default TodayFocus;