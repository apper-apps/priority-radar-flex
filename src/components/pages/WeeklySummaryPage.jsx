import React from "react";
import WeeklySummary from "@/components/organisms/WeeklySummary";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const WeeklySummaryPage = () => {
  const { currentUser, loading } = useCurrentUser();

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Error message="Unable to load user data" />;
  }

  return (
    <div className="space-y-6">
      <WeeklySummary currentUser={currentUser} />
    </div>
  );
};

export default WeeklySummaryPage;