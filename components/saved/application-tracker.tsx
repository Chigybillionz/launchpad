import { ApplicationStatus } from "@/types/saved";
import { ApplicationTimeline } from "@/components/applications/application-timeline";

interface ApplicationTrackerProps {
  currentStatus: ApplicationStatus;
}

export function ApplicationTracker({ currentStatus }: ApplicationTrackerProps) {
  const now = new Date().toISOString();
  return <ApplicationTimeline status={currentStatus} appliedAt={now} updatedAt={now} />;
}
