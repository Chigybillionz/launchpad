import { ApplicationsClient } from "@/components/applications/applications-client";
import { PageHeader } from "@/components/layout/page-header";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Track the opportunities you've applied to from Launchpad."
      />
      <ApplicationsClient />
    </div>
  );
}
