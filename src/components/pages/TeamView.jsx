import React, { useState, useEffect } from "react";
import TeamKanban from "@/components/organisms/TeamKanban";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { checkInService } from "@/services/api/checkInService";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const TeamView = () => {
  const { currentUser, loading: userLoading } = useCurrentUser();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    let mounted = true;
    
    if (currentUser && mounted) {
      checkUserAccess();
    }
    
    return () => {
      mounted = false;
    };
  }, [currentUser?.id]); // Only depend on user ID to prevent loops

  const checkUserAccess = async () => {
    try {
      setError(null);
      const todaysCheckIn = await checkInService.getTodaysCheckIn(currentUser.id);
      setHasCheckedIn(!!todaysCheckIn);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || loading) {
    return <Loading type="kanban" />;
  }

  if (error) {
    return <Error message={error} onRetry={checkUserAccess} />;
  }

  if (!currentUser) {
    return <Error message="Unable to load user data" onRetry={checkUserAccess} />;
  }

  if (!hasCheckedIn) {
    return (
      <Empty
        type="checkin"
        title="Check in first! 🔒"
        message="You need to share your priorities before you can see what your teammates are working on. It's only fair! 😊"
        actionLabel="Go to Check-in"
        onAction={() => window.location.hash = "#/"}
      />
    );
  }

  return (
    <div className="space-y-6">
      <TeamKanban currentUser={currentUser} />
    </div>
  );
};

export default TeamView;