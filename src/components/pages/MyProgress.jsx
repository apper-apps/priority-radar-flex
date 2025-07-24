import React from "react";
import PersonalStats from "@/components/organisms/PersonalStats";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const MyProgress = () => {
  const { currentUser, loading } = useCurrentUser();

  if (loading) {
    return <Loading type="stats" />;
  }

  if (!currentUser) {
    return <Error message="Unable to load user data" />;
  }

  return (
    <div className="space-y-6">
      <PersonalStats currentUser={currentUser} />
    </div>
  );
};

export default MyProgress;