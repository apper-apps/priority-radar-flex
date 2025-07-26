import React, { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkInService } from "@/services/api/checkInService";
import CheckInForm from "@/components/organisms/CheckInForm";
import CheckOutReview from "@/components/organisms/CheckOutReview";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
const TodayFocus = () => {
  const { currentUser, loading: userLoading } = useCurrentUser();
  const [todaysCheckIn, setTodaysCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("checkin"); // checkin, checkout

const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    
    if (currentUser && mounted) {
      console.log("🔄 Loading today's check-in for user:", currentUser.id);
      loadTodaysCheckIn();
    }
    
    return () => {
      mounted = false;
    };
  }, [currentUser?.id]); // Only depend on user ID to prevent loops

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
    toast.success("Great job today! 🎉 See you tomorrow!");
    navigate("/progress");
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