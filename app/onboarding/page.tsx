"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  INITIAL_ONBOARDING_DATA,
  ONBOARDING_STEPS,
  type OnboardingData,
} from "@/types";

import { StepBasicInfo } from "@/components/onboarding/step-basic-info";
import { StepExperience } from "@/components/onboarding/step-experience";
import { StepSkills } from "@/components/onboarding/step-skills";
import { StepInterests } from "@/components/onboarding/step-interests";
import { StepGoals } from "@/components/onboarding/step-goals";
import { StepPreferences } from "@/components/onboarding/step-preferences";
import { StepSummary } from "@/components/onboarding/step-summary";

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_ONBOARDING_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = ONBOARDING_STEPS.length;
  const progress = (currentStep / totalSteps) * 100;

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
    // Clear errors for updated fields
    const newErrors = { ...errors };
    Object.keys(newData).forEach((key) => delete newErrors[key]);
    setErrors(newErrors);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!data.name.trim()) newErrors.name = "Name is required";
        if (!data.role.trim()) newErrors.role = "Role is required";
        if (!data.location.trim()) newErrors.location = "Location is required";
        break;
      case 2:
        if (!data.experienceLevel)
          newErrors.experienceLevel = "Please select your experience level";
        break;
      case 3:
        if (data.skills.length === 0)
          newErrors.skills = "Please add at least one skill";
        break;
      case 4:
        if (data.interests.length === 0)
          newErrors.interests = "Please select at least one interest";
        break;
      case 5:
        if (data.goals.length === 0)
          newErrors.goals = "Please select at least one goal";
        break;
      case 6:
        if (!data.workPreference)
          newErrors.workPreference = "Please select a work style";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {

      
      const submitData = {
        ...data,
        experienceLevel: data.experienceLevel === "" ? undefined : data.experienceLevel
      };
      
      await completeOnboarding(submitData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasicInfo data={data} updateData={updateData} errors={errors} />;
      case 2:
        return <StepExperience data={data} updateData={updateData} errors={errors} />;
      case 3:
        return <StepSkills data={data} updateData={updateData} errors={errors} />;
      case 4:
        return <StepInterests data={data} updateData={updateData} errors={errors} />;
      case 5:
        return <StepGoals data={data} updateData={updateData} errors={errors} />;
      case 6:
        return <StepPreferences data={data} updateData={updateData} errors={errors} />;
      case 7:
        return <StepSummary data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <Navbar />

      {/* Progress bar */}
      <div className="fixed top-14 left-0 z-40 w-full h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex flex-1 items-center justify-center py-12">
        <Container size="sm">
          <div className="mx-auto w-full max-w-lg">
            {/* Form Card */}
            <div className="relative rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
              
              {/* Step indicator */}
              <div className="mb-8 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                    type="button"
                  >
                    <ChevronLeft className="size-4" />
                    Back
                  </button>
                ) : (
                  <div /> // Spacer
                )}
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>

              {/* Step Content */}
              <div className="min-h-[300px]">
                {renderCurrentStep()}
              </div>

              {/* Footer Actions */}
              <div className="mt-8 pt-6 border-t border-border/60">
                {currentStep < totalSteps ? (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleNext}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Build My Opportunity Radar
                  </Button>
                )}
              </div>

            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
