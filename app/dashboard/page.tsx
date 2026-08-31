"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardService } from "@/lib/services/dashboard";
import { OpportunitiesService } from "@/lib/services/opportunities";
import { ApplicationsService, DashboardStatsResponse } from "@/lib/services/applications";
import type { DashboardData } from "@/types";
import type { MatchedOpportunity } from "@/types/match";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SkillsToStrengthen } from "@/components/dashboard/skills-to-strengthen";
import { ApplicationStatusBadge } from "@/components/applications/application-status-badge";
import { 
  Briefcase, 
  ArrowRight,
  ExternalLink,
  Calendar,
  MapPin,
  Activity,
  Bookmark,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!authUser) return;
      try {
        setIsLoading(true);
        const [dashboardData, matchesData, dashboardStats] = await Promise.all([
          DashboardService.getDashboardData(),
          OpportunitiesService.getOpportunities({ limit: 5 }).catch(() => null),
          ApplicationsService.getDashboardStats().catch(() => null)
        ]);

        if (matchesData) {
          dashboardData.topOpportunities = matchesData.data.map((m: MatchedOpportunity) => ({
            ...m.opportunity,
            matchPercentage: m.match.score,
            recommendationReason: m.recommendationReason
          }));
        }

        setData(dashboardData);
        setStats(dashboardStats);
      } catch (err) {
        // Ignore errors in API calls to allow partial dashboard loads
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuthLoading) {
      if (authUser) {
        loadDashboard();
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(false);
      }
    }
  }, [authUser, isAuthLoading]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-[400px] rounded-xl lg:col-span-2" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!authUser || !data) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Please log in</h2>
        <p className="text-muted-foreground">You must be logged in to view your dashboard.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  const { summary, topOpportunities, applicationProgress } = data;
  const savedCount = stats?.saved ?? applicationProgress.saved;
  const applicationsCount = stats?.applications ?? summary.applications;
  const interviewsCount = stats?.interviews ?? applicationProgress.interview;
  const acceptedCount = stats?.accepted ?? applicationProgress.accepted;

  const SUMMARY_CARDS = [
    { title: "Saved", value: savedCount, icon: Bookmark, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Applications", value: applicationsCount, icon: Briefcase, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Interviews", value: interviewsCount, icon: Calendar, color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: "Accepted", value: acceptedCount, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  const PIPELINE_STAGES = [
    { label: "Saved", value: savedCount, color: "bg-muted-foreground/20" },
    { label: "Applied", value: applicationsCount, color: "bg-yellow-500/20" },
    { label: "Interview", value: interviewsCount, color: "bg-orange-500/20" },
    { label: "Accepted", value: acceptedCount, color: "bg-green-500/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Welcome back, {authUser.name?.split(" ")[0] || "there"}.
        </h1>
        <p className="text-lg text-muted-foreground">
          Here are your strongest opportunities and your next steps.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SUMMARY_CARDS.map((card, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.bg}`}>
                  <card.icon className={`size-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Top Opportunities & Skill Readiness */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Top Opportunities */}
          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Top Opportunities</CardTitle>
                <CardDescription>Hand-picked roles based on your profile.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="hidden sm:flex" render={<Link href="/dashboard/opportunities" />}>
                View All <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {topOpportunities.map((opp) => (
                <div key={opp.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{opp.title}</h3>
                        <p className="text-muted-foreground text-sm font-medium">{opp.organization}</p>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        {opp.matchPercentage}% Match
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground pt-1">
                      <div className="flex items-center gap-1">
                        <Briefcase className="size-3.5" />
                        <span className="capitalize">{opp.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        <span>{opp.remote ? "Remote" : opp.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        <span>Ends {new Date(opp.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {opp.recommendationReason && (
                      <div className="text-sm mt-2 font-medium text-primary/80 italic">
                        {opp.recommendationReason}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex sm:flex-col justify-end sm:justify-center mt-2 sm:mt-0">
                    <Button variant="secondary" size="sm" render={<Link href={opp.applicationUrl} target="_blank" rel="noopener noreferrer" />}>
                      View <ExternalLink className="ml-2 size-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full sm:hidden" render={<Link href="/dashboard/opportunities" />}>
                View All Opportunities
              </Button>
            </CardContent>
          </Card>

          <SkillsToStrengthen />
        </div>

        {/* Right Column: Progress & Activity */}
        <div className="space-y-6">
          
          {/* Application Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Application Progress</CardTitle>
              <CardDescription>Your current pipeline.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {PIPELINE_STAGES.map((stage, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50">
                    <div className="flex items-center gap-3">
                      <div className={`size-3 rounded-full ${stage.color}`} />
                      <span className="font-medium text-sm">{stage.label}</span>
                    </div>
                    <span className="font-semibold">{stage.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentApplications?.length ? (
                <div className="space-y-4">
                  {stats.recentApplications.map((application) => (
                    <Link
                      key={application.id}
                      href={`/dashboard/applications/${application.id}`}
                      className="block rounded-lg border border-border/50 bg-background/50 p-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{application.opportunity?.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(application.appliedAt).toLocaleDateString()}</p>
                        </div>
                        <ApplicationStatusBadge status={application.status} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground border rounded-lg border-dashed bg-muted/20">
                  <Activity className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">No recent application activity</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
