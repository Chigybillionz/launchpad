"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  Gamepad2, 
  Zap, 
  BookOpen, 
  ExternalLink, 
  ArrowRight, 
  ChevronRight,
  Loader2,
  Lock,
  Flame
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { SkillGapAnalysis as SkillGapAnalysisType, SkillPriority } from "@/types/skill-gap";
import { SkillGapService } from "@/lib/services/skill-gaps";
import { getSkillLearningPlan, SkillLearningPlan } from "@/lib/matching/learning-resources";

interface SkillGapAnalysisProps {
  opportunityId: string;
  requiredSkills?: string[];
  onGeneratePlan: () => void;
  isGenerating: boolean;
  hasGenerated: boolean;
}

export function SkillGapAnalysis({ 
  opportunityId, 
  requiredSkills = [],
  onGeneratePlan, 
  isGenerating, 
  hasGenerated 
}: SkillGapAnalysisProps) {
  const { user, isLoading: authLoading } = useAuth();
  const [analysis, setAnalysis] = useState<SkillGapAnalysisType | null>(null);
  const [loading, setLoading] = useState(true);

  // For interactive guest simulation
  const [guestSkills, setGuestSkills] = useState<string[]>([]);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [selectedQuestSkill, setSelectedQuestSkill] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        if (user) {
          setIsGuestMode(false);
          const data = await SkillGapService.getOpportunitySkillGap(opportunityId);
          setAnalysis(data);
        } else {
          const guestProfileData = localStorage.getItem("launchpad_guest_profile");
          if (guestProfileData) {
            setIsGuestMode(false);
            const guestProfile = JSON.parse(guestProfileData);
            setGuestSkills(guestProfile.skills || []);

            const res = await fetch(`/api/discover/${opportunityId}/skill-gaps`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(guestProfile),
            });
            if (res.ok) {
              const json = await res.json();
              setAnalysis(json.data.analysis);
            } else {
              setIsGuestMode(true);
            }
          } else {
            // Guest has no profile yet -> enable interactive simulation mode!
            setIsGuestMode(true);
          }
        }
      } catch (error) {
        console.error("Failed to load skill gap analysis", error);
        setIsGuestMode(true);
      } finally {
        setLoading(false);
      }
    }

    if (authLoading) return;
    load();
  }, [opportunityId, user, authLoading]);

  // If in interactive guest mode without backend analysis, compute locally
  const activeAnalysis = useMemo(() => {
    if (analysis && !isGuestMode) {
      return analysis;
    }

    const allRequired = requiredSkills.length > 0 
      ? requiredSkills 
      : (analysis?.matchedSkills.concat(analysis.missingSkills.map(s => s.skill)) || []);

    const matched = allRequired.filter(req => 
      guestSkills.some(gs => gs.toLowerCase() === req.toLowerCase())
    );
    const missing = allRequired.filter(req => !matched.includes(req));
    const total = allRequired.length;
    const matchPercentage = total > 0 ? Math.round((matched.length / total) * 100) : 100;

    return {
      totalRequiredSkills: total,
      matchedSkills: matched,
      missingSkills: missing.map(skill => ({
        skill,
        priority: "HIGH" as SkillPriority,
        importance: 80,
      })),
      skillMatchPercentage: matchPercentage,
      summary: `You have ${matched.length} of ${total} required skills.`,
    };
  }, [analysis, isGuestMode, guestSkills, requiredSkills]);

  // Set default selected missing skill for quests
  useEffect(() => {
    if (activeAnalysis.missingSkills.length > 0) {
      if (!selectedQuestSkill || !activeAnalysis.missingSkills.some(s => s.skill === selectedQuestSkill)) {
        setSelectedQuestSkill(activeAnalysis.missingSkills[0].skill);
      }
    } else {
      setSelectedQuestSkill(null);
    }
  }, [activeAnalysis, selectedQuestSkill]);

  const toggleGuestSkill = (skill: string) => {
    setGuestSkills(prev => {
      const exists = prev.some(s => s.toLowerCase() === skill.toLowerCase());
      if (exists) {
        return prev.filter(s => s.toLowerCase() !== skill.toLowerCase());
      } else {
        return [...prev, skill];
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-44 w-full rounded-2xl" />
      </div>
    );
  }

  const { matchedSkills, missingSkills, skillMatchPercentage, totalRequiredSkills } = activeAnalysis;
  const matchedCount = matchedSkills.length;
  const totalCount = totalRequiredSkills || (matchedSkills.length + missingSkills.length);
  const currentPlan: SkillLearningPlan | null = selectedQuestSkill ? getSkillLearningPlan(selectedQuestSkill) : null;

  // Level & Rank computation
  let rankBadge = {
    title: "Level C • Skill Builder",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
    icon: Zap,
    message: "Great foundation! Pick up key skills to boost your match."
  };
  if (skillMatchPercentage === 100) {
    rankBadge = {
      title: "Level S • Master Match",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
      icon: Trophy,
      message: "Outstanding! You have 100% of the skills required."
    };
  } else if (skillMatchPercentage >= 75) {
    rankBadge = {
      title: "Level A • Ready to Apply",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
      icon: Flame,
      message: "Strong candidate! You're almost at full match."
    };
  } else if (skillMatchPercentage >= 50) {
    rankBadge = {
      title: "Level B • Quest in Progress",
      color: "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400",
      icon: Zap,
      message: "You have more than half the skills. Bridge the remaining gaps!"
    };
  }

  const RankIcon = rankBadge.icon;

  return (
    <div className="space-y-6" id="skill-gap-section">
      {/* Interactive Guest Mode Banner */}
      {isGuestMode && (
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-sm">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary shrink-0" />
            <span>
              <strong>Quick Match Game:</strong> Tap the skills you have below to see your live score update!
            </span>
          </div>
          <Badge variant="outline" className="shrink-0 text-[11px] font-semibold border-primary/30 text-primary">
            Interactive
          </Badge>
        </div>
      )}

      {/* GAMIFIED SCORE HUD CARD */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card/95 to-primary/[0.04] p-6 shadow-sm">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Gamepad2 className="h-4 w-4 text-primary" />
                Skill Match Score
              </span>
              <Badge variant="outline" className={`text-xs px-2.5 py-0.5 font-semibold ${rankBadge.color}`}>
                <RankIcon className="h-3 w-3 mr-1 inline" />
                {rankBadge.title}
              </Badge>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              You have <span className="text-primary">{matchedCount} out of {totalCount}</span> skills!
            </h3>
            <p className="text-sm text-muted-foreground">
              {rankBadge.message}
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end shrink-0">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-primary">
              {skillMatchPercentage}%
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Affinity Score
            </span>
          </div>
        </div>

        {/* Arcade-Style Segmented Progress Bar */}
        <div className="pt-4 pb-2">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
            <span>Progress Meter</span>
            <span>{matchedCount} / {totalCount} Completed</span>
          </div>
          <div className="flex h-3.5 w-full gap-1.5 rounded-full bg-muted/40 p-0.5">
            {Array.from({ length: totalCount || 1 }).map((_, index) => {
              const isFilled = index < matchedCount;
              return (
                <div
                  key={index}
                  className={`h-full flex-1 rounded-full transition-all duration-500 ${
                    isFilled 
                      ? "bg-gradient-to-r from-emerald-500 to-green-400 shadow-xs shadow-emerald-500/50" 
                      : "bg-muted/70"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Skill Pills Matrix */}
        <div className="mt-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {isGuestMode ? "Tap to test your match:" : "Required Skills breakdown:"}
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Matched Skills */}
            {matchedSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => isGuestMode && toggleGuestSkill(skill)}
                disabled={!isGuestMode}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isGuestMode ? "cursor-pointer hover:opacity-80 active:scale-95" : ""
                } bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>{skill}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-0.5">UNLOCKED</span>
              </button>
            ))}

            {/* Missing Skills */}
            {missingSkills.map(gap => (
              <button
                key={gap.skill}
                type="button"
                onClick={() => {
                  if (isGuestMode) {
                    toggleGuestSkill(gap.skill);
                  } else {
                    setSelectedQuestSkill(gap.skill);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedQuestSkill?.toLowerCase() === gap.skill.toLowerCase()
                    ? "ring-2 ring-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/50"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 hover:bg-amber-500/20"
                }`}
              >
                <Lock className="h-3.5 w-3.5 text-amber-500" />
                <span>{gap.skill}</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold ml-0.5">QUEST</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MISSING SKILL QUEST & LEARNING GUIDE */}
      {missingSkills.length > 0 && currentPlan && (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Zap className="h-4 w-4" />
                Level-Up Quest
              </div>
              <h4 className="text-xl font-bold">
                You&apos;re missing <span className="text-amber-600 dark:text-amber-400 underline decoration-amber-500/30 underline-offset-4">{currentPlan.skill}</span>
              </h4>
            </div>

            {missingSkills.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-muted-foreground mr-1">Switch Quest:</span>
                {missingSkills.map(gap => (
                  <Button
                    key={gap.skill}
                    variant={selectedQuestSkill === gap.skill ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs px-2.5"
                    onClick={() => setSelectedQuestSkill(gap.skill)}
                  >
                    {gap.skill}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/80 space-y-3">
            <p className="text-sm font-medium text-foreground">
              💡 <strong>Here&apos;s how you can learn it:</strong> {currentPlan.quickTip}
            </p>

            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recommended Practice Steps:
              </span>
              <ul className="grid gap-2 sm:grid-cols-2 text-xs">
                {currentPlan.quests.map((quest, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/40">
                    <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{quest}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Curated Resources */}
            {currentPlan.resources.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Curated Free Learning Resources:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentPlan.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors group"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                      <span>{res.title}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Readiness Plan Trigger */}
      {!hasGenerated && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-base flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {missingSkills.length > 0 ? "Unlock Your Personalized AI Roadmap" : "Polish Your Application with AI"}
            </h4>
            <p className="text-xs text-muted-foreground max-w-xl">
              {missingSkills.length > 0
                ? "Get an AI-generated, day-by-day learning schedule and project suggestions to conquer missing requirements."
                : "Get tailored interview practice prompts and tailored application talking points."}
            </p>
          </div>
          <Button 
            onClick={onGeneratePlan} 
            disabled={isGenerating}
            size="lg"
            className="w-full sm:w-auto shrink-0 shadow-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Plan...
              </>
            ) : (
              <>
                Generate AI Readiness Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
