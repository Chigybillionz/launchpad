import { PageHeader } from "@/components/layout/page-header";
import { OpportunitiesClient } from "@/components/opportunities/opportunities-client";

export default function OpportunitiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunities"
        description="Discover opportunities matched to your skills and goals."
      />

      <OpportunitiesClient />
    </div>
  );
}
