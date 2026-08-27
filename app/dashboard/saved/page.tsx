import { PageHeader } from "@/components/layout/page-header";
import { SavedClient } from "@/components/saved/saved-client";

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Opportunities"
        description="Keep track of opportunities you're preparing for and applying to."
      />
      <SavedClient />
    </div>
  );
}
