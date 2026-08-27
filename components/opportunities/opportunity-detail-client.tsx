"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Briefcase, 
  Calendar, 
  Globe, 
  ExternalLink, 
  BookmarkPlus, 
  BookmarkMinus, 
  ArrowLeft,
  Loader2
} from "lucide-react";

import { OpportunitiesService } from "@/lib/services/opportunities";
import { SavedService } from "@/lib/services/saved";
import { ReadinessService } from "@/lib/services/readiness";
import { MatchedOpportunity, MatchExplanation } from "@/types/match";
import { ReadinessPlan } from "@/types/readiness";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MatchAnalysisCard } from "./match-analysis-card";
import { SkillGapAnalysis } from "./skill-gap-analysis";
import { ReadinessPlanView } from "./readiness-plan-view";
import { MatchExplanationView } from "./match-explanation-view";

interface OpportunityDetailClientProps {
  id: string;
}

export function OpportunityDetailClient({ id }: OpportunityDetailClientProps) {
  const router = useRouter();
  const [data, setData] = useState<MatchedOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [explanation, setExplanation] = useState<MatchExplanation | null>(null);
  const [isExplaining, setIsExplaining] = useState(true);

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [readinessPlan, setReadinessPlan] = useState<ReadinessPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [oppData, status] = await Promise.all([
          OpportunitiesService.getOpportunityWithMatch(id),
          SavedService.checkStatus(id)
        ]);
        setData(oppData);
        setIsSaved(status !== null);
      } catch (err) {
        console.error(err);
        setError("Failed to load opportunity details.");
      } finally {
        setIsLoading(false);
      }
    }

    async function loadExplanation() {
      try {
        setIsExplaining(true);
        const explData = await OpportunitiesService.getOpportunityExplanation(id);
        setExplanation(explData.explanation);
      } catch (err) {
        console.error("Failed to load explanation:", err);
      } finally {
        setIsExplaining(false);
      }
    }

    loadData();
    loadExplanation();
  }, [id]);

  const toggleSave = useCallback(async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      if (isSaved) {
        await SavedService.removeSaved(id);
        setIsSaved(false);
      } else {
        await SavedService.saveOpportunity(id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }, [id, isSaved, isSaving]);

  const handleGeneratePlan = async () => {
    if (!data) return;
    setIsGeneratingPlan(true);
    setPlanError(null);
    try {
      const plan = await ReadinessService.generatePlan(id, data.match.missingSkills);
      setReadinessPlan(plan);
    } catch (err) {
      console.error(err);
      setPlanError("Unable to generate your readiness plan. Please try again.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-44 w-full rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-12 text-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive">
        <h3 className="text-lg font-medium">{error || "Opportunity not found"}</h3>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/opportunities")}>
          Back to Opportunities
        </Button>
      </div>
    );
  }

  const { opportunity, match } = data;
  const formattedDeadline = new Date(opportunity.deadline).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => router.back()}
        className="text-muted-foreground hover:text-foreground mb-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Header Section */}
      <div className="rounded-xl border bg-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <Badge variant="secondary" className="capitalize text-primary bg-primary/10">
                {opportunity.type}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {opportunity.title}
              </h1>
              <p className="text-lg font-medium text-muted-foreground">
                {opportunity.organization}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1.5">
                {opportunity.remote ? <Globe className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                <span>{opportunity.remote ? "Remote" : opportunity.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span className="capitalize">{opportunity.experienceLevel}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Deadline: {formattedDeadline}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:w-auto w-full shrink-0">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={toggleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isSaved ? (
                <BookmarkMinus className="mr-2 h-4 w-4" />
              ) : (
                <BookmarkPlus className="mr-2 h-4 w-4" />
              )}
              {isSaved ? "Unsave" : "Save Opportunity"}
            </Button>
            <Button 
              size="lg"
              className="w-full sm:w-auto shadow-xs"
              render={<a href={opportunity.applicationUrl} target="_blank" rel="noopener noreferrer" />}
            >
              Apply Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3 items-start pb-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card p-6 md:p-8 space-y-8">
            <MatchExplanationView explanation={explanation} isLoading={isExplaining} />

            <section className="space-y-3">
              <h2 className="text-lg font-semibold border-b pb-2">About the Opportunity</h2>
              <div className="text-muted-foreground leading-relaxed">
                {opportunity.description}
                <br /><br />
                This is a placeholder for a much longer description about the opportunity, the team, the expectations, and the impact you will make. It provides context and details about what the day-to-day responsibilities look like.
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Skill Requirements</h2>
              <SkillGapAnalysis 
                opportunityId={id} 
                onGeneratePlan={handleGeneratePlan}
                isGenerating={isGeneratingPlan}
                hasGenerated={!!readinessPlan}
              />
              {planError && (
                <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 mt-4">
                  {planError}
                </div>
              )}
              {readinessPlan && (
                <ReadinessPlanView plan={readinessPlan} />
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold border-b pb-2">Eligibility & Qualifications</h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>{opportunity.eligibility}</li>
                <li>At least {opportunity.experienceLevel} experience level.</li>
                {opportunity.remote && <li>Must be comfortable working in a fully remote environment.</li>}
              </ul>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 sticky top-6">
          <MatchAnalysisCard match={match} />
          
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4 text-center text-lg">Ready to apply?</h3>
            <Button 
              size="lg"
              className="w-full shadow-xs"
              render={<a href={opportunity.applicationUrl} target="_blank" rel="noopener noreferrer" />}
            >
              Apply Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Closes on {formattedDeadline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
