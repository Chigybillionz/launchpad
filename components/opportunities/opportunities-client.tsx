"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { OpportunitiesService } from "@/lib/services/opportunities";
import { Opportunity } from "@/types/opportunity";
import { OpportunityCard } from "./opportunity-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "All",
  "Jobs",
  "Internships",
  "Hackathons",
  "Scholarships",
  "Fellowships",
  "Grants",
  "Mentorship",
  "Startup Programs",
];

const EXPERIENCE_LEVELS = ["All", "Entry Level", "Mid Level", "Senior", "Advanced", "Student"];

export function OpportunitiesClient() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [remote, setRemote] = useState("all");
  const [location, setLocation] = useState("all");
  const [experienceLevel, setExperienceLevel] = useState("all");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchOpportunities = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setPage(1);
      }
      setError(null);

      const currentPage = isLoadMore ? page + 1 : 1;
      
      const finalType = type === "Startup Programs" ? "startup program" : 
                        type === "Grants" ? "grant" :
                        type === "Jobs" ? "job" :
                        type === "Internships" ? "internship" :
                        type === "Hackathons" ? "hackathon" :
                        type === "Scholarships" ? "scholarship" :
                        type === "Fellowships" ? "fellowship" :
                        type === "Mentorship" ? "mentorship" :
                        undefined;


      const response = await OpportunitiesService.getOpportunities({
        search,
        type: finalType,
        remote: remote === "all" ? undefined : remote,
        location: location === "all" ? undefined : location,
        experienceLevel: experienceLevel === "all" ? undefined : experienceLevel,
        page: currentPage,
        limit: 6,
      });

      if (isLoadMore) {
        setOpportunities((prev) => [...prev, ...response.data]);
        setPage(currentPage);
      } else {
        setOpportunities(response.data);
      }
      
      setHasMore(response.hasMore);
    } catch (err) {
      setError("Failed to load opportunities. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [search, type, remote, location, experienceLevel, page]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOpportunities(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, type, remote, location, experienceLevel, fetchOpportunities]);

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="space-y-4">
        {/* Search & Main dropdowns */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, skill, organization..."
              className="pl-9 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 shrink-0 overflow-x-auto pb-1 sm:pb-0">
            <Select value={remote} onValueChange={(val) => val && setRemote(val)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Remote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Location</SelectItem>
                <SelectItem value="true">Remote Only</SelectItem>
                <SelectItem value="false">On-site Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={experienceLevel} onValueChange={(val) => val && setExperienceLevel(val)}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level} value={level.toLowerCase()}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={type === category ? "default" : "secondary"}
              className="rounded-full px-4"
              size="sm"
              onClick={() => setType(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* States and Grid */}
      {error ? (
        <div className="p-8 text-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => fetchOpportunities()}>
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl border border-border/60 bg-card p-4 flex flex-col gap-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2 mt-auto">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-border/60 bg-card">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No opportunities found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            Try adjusting your filters or search terms to find what you&apos;re looking for.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => {
            setSearch("");
            setType("All");
            setRemote("all");
            setLocation("all");
            setExperienceLevel("all");
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-8 pb-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => fetchOpportunities(true)}
                disabled={isLoadingMore}
                className="w-full sm:w-auto min-w-[200px]"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Opportunities"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
