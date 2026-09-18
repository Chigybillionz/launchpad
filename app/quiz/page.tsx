"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Plus, 
  X, 
  Briefcase, 
  Code2, 
  MapPin, 
  Laptop, 
  Layers, 
  Bot, 
  Smartphone, 
  Palette, 
  Megaphone,
  Loader2
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface QuizRole {
  id: string;
  title: string;
  description: string;
  icon: typeof Code2;
  suggestedSkills: string[];
}

const POPULAR_ROLES: QuizRole[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "Building responsive, modern web applications & interfaces",
    icon: Code2,
    suggestedSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript"],
  },
  {
    id: "fullstack",
    title: "Full-Stack Engineer",
    description: "End-to-end web apps, server logic & databases",
    icon: Layers,
    suggestedSkills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Next.js"],
  },
  {
    id: "backend",
    title: "Backend Engineer",
    description: "High-performance APIs, distributed systems & data pipelines",
    icon: Briefcase,
    suggestedSkills: ["Python", "PostgreSQL", "Node.js", "Docker", "REST APIs", "SQL"],
  },
  {
    id: "ai",
    title: "AI & Machine Learning",
    description: "Foundation models, alignment, data science & NLP",
    icon: Bot,
    suggestedSkills: ["Python", "PyTorch", "Machine Learning", "Data Analysis", "SQL"],
  },
  {
    id: "mobile",
    title: "Mobile App Developer",
    description: "Fluid mobile apps for iOS and Android",
    icon: Smartphone,
    suggestedSkills: ["React Native", "TypeScript", "iOS", "Android", "Mobile UI"],
  },
  {
    id: "devrel",
    title: "Developer Relations (DevRel)",
    description: "Community building, technical writing, demos & advocacy",
    icon: Megaphone,
    suggestedSkills: ["TypeScript", "PostgreSQL", "Public Speaking", "Writing", "Community"],
  },
  {
    id: "design",
    title: "Product & UI/UX Designer",
    description: "Design systems, user research, wireframing & prototyping",
    icon: Palette,
    suggestedSkills: ["Figma", "UI/UX", "Prototyping", "Design Systems", "User Research"],
  },
];

const POPULAR_SKILLS = [
  "React",
  "TypeScript",
  "Next.js",
  "PostgreSQL",
  "Python",
  "Node.js",
  "SQL",
  "Tailwind CSS",
  "Docker",
  "PyTorch",
  "Git",
  "REST APIs",
  "Figma",
  "Public Speaking",
  "Writing",
  "C++",
  "AWS",
  "Ruby",
  "Mobile UI",
];

const EXPERIENCE_LEVELS = [
  {
    id: "BEGINNER",
    label: "Beginner / Student",
    description: "Early in career, self-taught, or current university student (0–1 years)",
  },
  {
    id: "INTERMEDIATE",
    label: "Intermediate Developer",
    description: "Comfortable building independently, have shipped real projects (2–4 years)",
  },
  {
    id: "ADVANCED",
    label: "Advanced / Senior",
    description: "Deep expertise leading architecture, systems & mentoring (5+ years)",
  },
];

const WORK_STYLES = [
  { id: "remote", label: "Remote Only", icon: Laptop },
  { id: "hybrid", label: "Hybrid", icon: MapPin },
  { id: "any", label: "Open to Any", icon: Sparkles },
];

export default function QuizPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("BEGINNER");
  const [workStyle, setWorkStyle] = useState("remote");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectRole = (role: QuizRole) => {
    setSelectedRole(role.title);
    // Add suggested skills if not already added
    const newSkills = Array.from(new Set([...selectedSkills, ...role.suggestedSkills.slice(0, 3)]));
    setSelectedSkills(newSkills);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      const exists = prev.some((s) => s.toLowerCase() === skill.toLowerCase());
      if (exists) {
        return prev.filter((s) => s.toLowerCase() !== skill.toLowerCase());
      } else {
        return [...prev, skill];
      }
    });
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!selectedSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedSkills([...selectedSkills, trimmed]);
    }
    setCustomSkillInput("");
  };

  const handleFinishQuiz = async () => {
    setIsSubmitting(true);

    const guestProfile = {
      name: "Guest Explorer",
      role: selectedRole || "Software Developer",
      location: workStyle === "remote" ? "Remote" : "Global",
      experienceLevel: experienceLevel,
      skills: selectedSkills.length > 0 ? selectedSkills : ["JavaScript", "Problem Solving"],
      interests: [selectedRole || "Technology", "Web Development"],
      goals: ["Find opportunities", "Level up skills"],
      workPreference: workStyle === "remote" ? "REMOTE" : "HYBRID",
    };

    // Save to localStorage for instant client-side matching
    localStorage.setItem("launchpad_guest_profile", JSON.stringify(guestProfile));

    // Snappy transition animation
    setTimeout(() => {
      router.push("/discover");
    }, 1000);
  };

  const totalSteps = 3;
  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <Navbar />

      {/* Top progress line */}
      <div className="fixed top-14 left-0 z-40 w-full h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-2xl">
          {/* Card Container */}
          <div className="rounded-2xl border bg-card p-6 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Step Counter */}
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              <span className="flex items-center gap-1.5 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Step {step} of {totalSteps}
              </span>
              <span>Quick Match Quiz</span>
            </div>

            {/* STEP 1: TARGET ROLE */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    What role or path interests you most?
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Select your focus area so we can calibrate your match radar.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {POPULAR_ROLES.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.title;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleSelectRole(role)}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                            : "border-border hover:border-primary/40 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="font-semibold text-sm flex items-center gap-1.5">
                              {role.title}
                              {isSelected && <Check className="h-4 w-4 text-primary" />}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {role.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button
                    size="lg"
                    disabled={!selectedRole}
                    onClick={() => setStep(2)}
                  >
                    Continue to Skills
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: SKILLS SELECTION */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    What skills do you have?
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Tap the skills you know. We&apos;ll match these to real jobs and highlight your game score!
                  </p>
                </div>

                {/* Popular skills matrix */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Popular Skills (Click to toggle):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SKILLS.map((skill) => {
                      const isSelected = selectedSkills.some(
                        (s) => s.toLowerCase() === skill.toLowerCase()
                      );
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom skill add */}
                <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                  <Input
                    placeholder="Add other skill (e.g. GraphQL, Tailwind, Golang)..."
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    className="h-10 text-sm"
                  />
                  <Button type="submit" variant="secondary" className="shrink-0 h-10">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </form>

                {/* Selected summary */}
                {selectedSkills.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Selected Skills ({selectedSkills.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedSkills([])}
                        className="text-xs text-muted-foreground hover:text-foreground underline"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSkills.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="gap-1 pr-1.5 text-xs py-1"
                        >
                          {s}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => toggleSkill(s)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    size="lg"
                    disabled={selectedSkills.length === 0}
                    onClick={() => setStep(3)}
                  >
                    Next: Experience
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: EXPERIENCE & WORK STYLE */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Almost there! What&apos;s your experience level?
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    We calibrate roles so you don&apos;t waste time applying to mismatched seniority levels.
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Experience Level:
                  </span>
                  <div className="grid gap-2.5">
                    {EXPERIENCE_LEVELS.map((exp) => {
                      const isSelected = experienceLevel === exp.id;
                      return (
                        <button
                          key={exp.id}
                          type="button"
                          onClick={() => setExperienceLevel(exp.id)}
                          className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                              : "border-border hover:border-primary/40 hover:bg-muted/40"
                          }`}
                        >
                          <div className="font-semibold text-sm flex items-center gap-1.5">
                            {exp.label}
                            {isSelected && <Check className="h-4 w-4 text-primary" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {exp.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Work Location Preference:
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    {WORK_STYLES.map((ws) => {
                      const isSelected = workStyle === ws.id;
                      const Icon = ws.icon;
                      return (
                        <button
                          key={ws.id}
                          type="button"
                          onClick={() => setWorkStyle(ws.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/30 font-semibold text-primary"
                              : "border-border hover:border-primary/40 hover:bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5 mb-1.5" />
                          <span className="text-xs">{ws.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleFinishQuiz}
                    disabled={isSubmitting}
                    className="shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Calculating Matches...
                      </>
                    ) : (
                      <>
                        See My Matches Now
                        <Sparkles className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            No signup required to view your matches • Free forever to discover
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
